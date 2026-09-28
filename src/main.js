import './styles.css'
import { GROUP_CODE, ROSTER, MARKS, QUICK_MARKS } from './data/roster.js'
import { buildRashodText } from './lib/format.js'

const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function dayFromIso(iso) {
  const parts = String(iso).split('-')
  return Number(parts[2] || 0)
}

function formatDateRu(iso) {
  const [y, m, d] = String(iso).split('-')
  if (!y || !m || !d) return iso
  return `${d}.${m}.${y}`
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
    reader.readAsDataURL(file)
  })
}

/** Сжимаем фото перед отправкой — дешевле и быстрее для vision */
async function compressImage(file, maxSide = 2800, quality = 0.92) {
  const dataUrl = await fileToDataUrl(file)
  const img = await new Promise((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error('Битый файл изображения'))
    el.src = dataUrl
  })

  const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', quality)
}

function defaultPeople() {
  return ROSTER.map((r) => ({
    surname: r.surname,
    fullName: r.fullName,
    mark: 'present',
    reason: '',
    event: false,
    confidence: null,
  }))
}

const ACCESS_STORAGE_KEY = 'rashod_access_code'

function getStoredAccessCode() {
  try {
    return sessionStorage.getItem(ACCESS_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function setStoredAccessCode(code) {
  try {
    if (code) sessionStorage.setItem(ACCESS_STORAGE_KEY, code)
    else sessionStorage.removeItem(ACCESS_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

const state = {
  accessCode: getStoredAccessCode(),
  unlocked: false,
  authBusy: false,
  authError: '',
  date: todayIso(),
  imageDataUrl: '',
  people: defaultPeople(),
  busy: false,
  message: '',
  error: false,
  usage: null,
}

const app = document.querySelector('#app')

function setStatus(msg, isError = false) {
  state.message = msg
  state.error = isError
  render()
}

function apiUrl(path) {
  if (apiBase) return `${apiBase}${path}`
  return `/api${path}`
}

function recognizeUrl() {
  return apiUrl('/recognize')
}

function authUrl() {
  return apiUrl('/auth')
}

async function unlock(code) {
  const trimmed = String(code || '').trim()
  if (!trimmed) {
    state.authError = 'Введи код доступа'
    render()
    return
  }
  state.authBusy = true
  state.authError = ''
  render()
  try {
    const res = await fetch(authUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Code': trimmed,
      },
      body: JSON.stringify({ accessCode: trimmed }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      throw new Error(data.error || 'Неверный код')
    }
    state.accessCode = trimmed
    state.unlocked = true
    setStoredAccessCode(trimmed)
  } catch (err) {
    state.unlocked = false
    state.authError = err.message || String(err)
  } finally {
    state.authBusy = false
    render()
  }
}

function lock() {
  state.unlocked = false
  state.accessCode = ''
  setStoredAccessCode('')
  state.authError = ''
  render()
}

async function recognize() {
  if (!state.unlocked || !state.accessCode) {
    setStatus('Сначала введи код доступа', true)
    return
  }
  if (!state.imageDataUrl) {
    setStatus('Сначала выбери фото листа', true)
    return
  }
  const day = dayFromIso(state.date)
  if (!day) {
    setStatus('Укажи дату', true)
    return
  }

  state.busy = true
  setStatus('Распознаю и перепроверяю столбец (2× Pro)…')

  try {
    const res = await fetch(recognizeUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Code': state.accessCode,
      },
      body: JSON.stringify({
        imageBase64: state.imageDataUrl,
        mimeType: 'image/jpeg',
        day,
        group: GROUP_CODE,
        roster: ROSTER,
        accessCode: state.accessCode,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (res.status === 401) {
      lock()
      throw new Error(data.error || 'Код доступа не принят')
    }
    if (!res.ok || !data.ok) {
      const extra = data.detail ? ` (${typeof data.detail === 'string' ? data.detail : ''})` : ''
      throw new Error((data.error || `Ошибка API (${res.status})`) + extra)
    }

    const students = data.result?.students || []
    const bySurname = new Map(
      students.map((s) => [String(s.surname || '').trim().toLowerCase(), s]),
    )

    const normalizeClient = (raw) => {
      const key = String(raw ?? '')
        .trim()
        .toLowerCase()
      const map = {
        present: 'present',
        '+': 'present',
        plus: 'present',
        absent: 'absent',
        '-': 'absent',
        '−': 'absent',
        duty: 'duty',
        н: 'duty',
        h: 'duty',
        excused: 'excused',
        о: 'excused',
        sick: 'sick',
        б: 'sick',
        unknown: 'unknown',
        unauthorized: 'unauthorized',
        empty: 'empty',
      }
      return map[key] || (MARKS[key] ? key : null)
    }

    state.people = ROSTER.map((r, i) => {
      const hit = bySurname.get(r.surname.toLowerCase()) || students[i] || {}
      const mark = normalizeClient(hit.mark) || (MARKS[hit.mark] ? hit.mark : 'empty')
      return {
        surname: r.surname,
        fullName: r.fullName,
        mark,
        reason: '',
        event: false,
        confidence: typeof hit?.confidence === 'number' ? hit.confidence : null,
        disagreed: !!hit.disagreed,
      }
    })

    state.usage = data.usage || null
    const presentN = state.people.filter((p) => p.mark === 'present').length
    const absentN = state.people.filter((p) =>
      ['absent', 'excused', 'sick', 'unknown', 'unauthorized'].includes(p.mark),
    ).length
    const dutyN = state.people.filter((p) => p.mark === 'duty').length
    const emptyN = state.people.filter((p) => p.mark === 'empty').length
    const disagreedN = state.people.filter((p) => p.disagreed).length
    const cost = data.usage?.cost_rub ?? data.usage?.cost

    if (emptyN === state.people.length) {
      setStatus(
        'Модель не прочитала отметки (все пусто). Проверь дату столбца и попробуй более ровное фото.',
        true,
      )
    } else {
      const bits = [
        `Готово (2× Pro)`,
        `+${presentN}`,
        `нет ${absentN}`,
        `наряд ${dutyN}`,
      ]
      if (emptyN) bits.push(`пусто ${emptyN}`)
      if (disagreedN) bits.push(`спорных ${disagreedN} — проверь`)
      if (cost != null) bits.push(`~${Number(cost).toFixed(2)} ₽`)
      setStatus(bits.join('. ') + '. Допиши причины при необходимости.')
    }
  } catch (err) {
    setStatus(err.message || String(err), true)
  } finally {
    state.busy = false
    render()
  }
}

async function onFile(file) {
  if (!file) return
  try {
    state.busy = true
    setStatus('Готовлю фото…')
    state.imageDataUrl = await compressImage(file)
    setStatus('Фото готово — нажми «Распознать»')
  } catch (err) {
    setStatus(err.message || String(err), true)
  } finally {
    state.busy = false
    render()
  }
}

async function copyText() {
  const text = buildRashodText({
    group: GROUP_CODE,
    dateLabel: formatDateRu(state.date),
    people: state.people,
  })
  try {
    await navigator.clipboard.writeText(text)
    setStatus('Текст скопирован')
  } catch {
    setStatus('Не удалось скопировать — выдели вручную', true)
  }
}

function renderGate() {
  app.innerHTML = `
    <section class="card gate">
      <h1>Расход</h1>
      <p class="sub">Доступ только по коду</p>
      <label>
        Код доступа
        <input id="access-code" type="password" inputmode="numeric" autocomplete="current-password" placeholder="Введи код" />
      </label>
      <div class="actions">
        <button class="primary" id="unlock" ${state.authBusy ? 'disabled' : ''}>
          ${state.authBusy ? 'Проверяю…' : 'Войти'}
        </button>
      </div>
      <div class="status ${state.authError ? 'error' : ''}">${state.authError || ''}</div>
    </section>
  `
  const input = app.querySelector('#access-code')
  const go = () => unlock(input.value)
  app.querySelector('#unlock').addEventListener('click', go)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') go()
  })
  input.focus()
}

function render() {
  if (!state.unlocked) {
    renderGate()
    return
  }

  const text = buildRashodText({
    group: GROUP_CODE,
    dateLabel: formatDateRu(state.date),
    people: state.people,
  })

  app.innerHTML = `
    <div class="topbar">
      <div>
        <h1>Расход</h1>
        <p class="sub">Фото графика → правка → готовый текст в группу командиров</p>
      </div>
      <button type="button" class="ghost" id="logout">Выйти</button>
    </div>

    <section class="card">
      <div class="row two">
        <label>
          Дата расхода
          <input id="date" type="date" value="${state.date}" />
        </label>
        <label>
          День столбца
          <input type="text" value="${dayFromIso(state.date)}" readonly />
        </label>
      </div>

      <div class="file-zone" style="margin-top:12px">
        <strong>Фото листа посещаемости</strong>
        <span>Галерея или камера</span>
        <input id="file" type="file" accept="image/*" />
      </div>
      <div class="actions" style="margin-top:8px">
        <button type="button" class="ghost" id="pick-gallery">Из галереи</button>
        <button type="button" class="ghost" id="pick-camera">С камеры</button>
      </div>
      <input id="file-camera" type="file" accept="image/*" capture="environment" hidden />
      ${
        state.imageDataUrl
          ? `<img class="preview" alt="Превью" src="${state.imageDataUrl}" />`
          : ''
      }

      <div class="actions">
        <button class="primary" id="recognize" ${state.busy || !state.imageDataUrl ? 'disabled' : ''}>
          ${state.busy ? 'Жди…' : 'Распознать'}
        </button>
        <button class="ghost" id="reset" ${state.busy ? 'disabled' : ''}>Сбросить список</button>
      </div>
      <div class="status ${state.error ? 'error' : ''}">${state.message || ''}</div>
    </section>

    <section class="card">
      <p class="hint">После распознавания поправь отметки кнопками <b>+</b> / <b>−</b> / <b>Н</b>. Причину и «мероприятие» впиши сам.</p>
      <div id="people">
        ${state.people
          .map((p, i) => {
            const low = p.confidence != null && p.confidence < 0.55
            return `
            <div class="person" data-i="${i}">
              <div class="person-top">
                <div class="person-name">${p.surname}</div>
                ${
                  low || p.mark === 'empty' || p.disagreed
                    ? `<span class="badge warn">${p.disagreed ? 'спорно — проверь' : MARKS[p.mark]?.label || 'проверить'}</span>`
                    : `<span class="badge">${MARKS[p.mark]?.short || '?'} ${MARKS[p.mark]?.label || ''}</span>`
                }
              </div>
              <div class="quick-marks">
                ${QUICK_MARKS.map((k) => {
                  const active = p.mark === k ? 'active' : ''
                  return `<button type="button" class="mark-btn ${active}" data-quick="${k}">${MARKS[k].short}</button>`
                }).join('')}
                <select data-field="mark" class="mark-select" aria-label="Другая отметка">
                  ${Object.entries(MARKS)
                    .map(
                      ([k, v]) =>
                        `<option value="${k}" ${p.mark === k ? 'selected' : ''}>${v.label}</option>`,
                    )
                    .join('')}
                </select>
              </div>
              <div class="person-grid">
                <label>
                  Причина (если нет)
                  <input data-field="reason" type="text" placeholder="плохое самочувствие" value="${escapeAttr(p.reason)}" />
                </label>
                <label class="check">
                  <input data-field="event" type="checkbox" ${p.event ? 'checked' : ''} />
                  Мероприятие
                </label>
              </div>
            </div>`
          })
          .join('')}
      </div>
    </section>

    <section class="card">
      <label>
        Текст для группы
        <textarea id="out" readonly>${escapeHtml(text)}</textarea>
      </label>
      <div class="actions">
        <button class="primary" id="copy">Скопировать</button>
      </div>
    </section>
  `

  app.querySelector('#logout').addEventListener('click', () => lock())

  app.querySelector('#date').addEventListener('change', (e) => {
    state.date = e.target.value
    render()
  })

  app.querySelector('#file').addEventListener('change', (e) => {
    const file = e.target.files?.[0]
    onFile(file)
  })

  app.querySelector('#file-camera').addEventListener('change', (e) => {
    const file = e.target.files?.[0]
    onFile(file)
  })

  app.querySelector('#pick-gallery').addEventListener('click', () => {
    app.querySelector('#file').click()
  })

  app.querySelector('#pick-camera').addEventListener('click', () => {
    app.querySelector('#file-camera').click()
  })

  app.querySelector('#recognize').addEventListener('click', () => recognize())
  app.querySelector('#reset').addEventListener('click', () => {
    state.people = defaultPeople()
    setStatus('Список сброшен')
  })
  app.querySelector('#copy').addEventListener('click', () => copyText())

  app.querySelectorAll('.person').forEach((el) => {
    const i = Number(el.dataset.i)

    const refreshOut = () => {
      const out = app.querySelector('#out')
      if (out) {
        out.value = buildRashodText({
          group: GROUP_CODE,
          dateLabel: formatDateRu(state.date),
          people: state.people,
        })
      }
      const badge = el.querySelector('.badge')
      const mark = state.people[i].mark
      if (badge) {
        badge.textContent = `${MARKS[mark]?.short || '?'} ${MARKS[mark]?.label || ''}`
        badge.classList.toggle('warn', mark === 'empty' || (state.people[i].confidence != null && state.people[i].confidence < 0.55))
      }
      el.querySelectorAll('.mark-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-quick') === mark)
      })
      const sel = el.querySelector('[data-field="mark"]')
      if (sel) sel.value = mark
    }

    el.querySelectorAll('[data-quick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.people[i].mark = btn.getAttribute('data-quick')
        refreshOut()
      })
    })

    el.querySelectorAll('[data-field]').forEach((input) => {
      const field = input.getAttribute('data-field')
      const handler = () => {
        if (field === 'event') state.people[i].event = input.checked
        else state.people[i][field] = input.value
        refreshOut()
      }
      input.addEventListener('change', handler)
      input.addEventListener('input', handler)
    })
  })
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeAttr(s) {
  return String(s).replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

async function boot() {
  if (state.accessCode) {
    await unlock(state.accessCode)
    return
  }
  render()
}

boot()
