import './styles.css'
import { GROUP_CODE, ROSTER, MARKS } from './data/roster.js'
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
async function compressImage(file, maxSide = 2000, quality = 0.82) {
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

const state = {
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

function recognizeUrl() {
  if (apiBase) return `${apiBase}/recognize`
  // dev proxy: vite → worker
  return '/api/recognize'
}

async function recognize() {
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
  setStatus('Распознаю столбец дня…')

  try {
    const res = await fetch(recognizeUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: state.imageDataUrl,
        mimeType: 'image/jpeg',
        day,
        group: GROUP_CODE,
        roster: ROSTER,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.ok) {
      throw new Error(data.error || `Ошибка API (${res.status})`)
    }

    const bySurname = new Map(
      (data.result?.students || []).map((s) => [String(s.surname || '').toLowerCase(), s]),
    )

    state.people = ROSTER.map((r) => {
      const hit = bySurname.get(r.surname.toLowerCase())
      const mark = hit?.mark && MARKS[hit.mark] ? hit.mark : 'empty'
      return {
        surname: r.surname,
        fullName: r.fullName,
        mark,
        reason: '',
        event: false,
        confidence: typeof hit?.confidence === 'number' ? hit.confidence : null,
      }
    })

    state.usage = data.usage || null
    const cost = data.usage?.cost_rub ?? data.usage?.cost
    setStatus(
      cost != null
        ? `Готово. Проверь отметки и допиши причины. (~${Number(cost).toFixed(2)} ₽)`
        : 'Готово. Проверь отметки и допиши причины.',
    )
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

function render() {
  const text = buildRashodText({
    group: GROUP_CODE,
    dateLabel: formatDateRu(state.date),
    people: state.people,
  })

  app.innerHTML = `
    <h1>Расход ${GROUP_CODE}</h1>
    <p class="sub">Фото графика → правка → готовый текст в группу командиров</p>

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
        <span>С телефона можно сразу с камеры</span>
        <input id="file" type="file" accept="image/*" capture="environment" />
      </div>
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
      <p class="hint">Поправь отметки при ошибке. Причину и «мероприятие» вписывай сам.</p>
      <div id="people">
        ${state.people
          .map((p, i) => {
            const low = p.confidence != null && p.confidence < 0.55
            return `
            <div class="person" data-i="${i}">
              <div class="person-top">
                <div class="person-name">${p.surname}</div>
                ${
                  low
                    ? `<span class="badge warn">низкая уверенность</span>`
                    : `<span class="badge">${MARKS[p.mark]?.short || '?'}</span>`
                }
              </div>
              <div class="person-grid">
                <label>
                  Отметка
                  <select data-field="mark">
                    ${Object.entries(MARKS)
                      .map(
                        ([k, v]) =>
                          `<option value="${k}" ${p.mark === k ? 'selected' : ''}>${v.short} — ${v.label}</option>`,
                      )
                      .join('')}
                  </select>
                </label>
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

  app.querySelector('#date').addEventListener('change', (e) => {
    state.date = e.target.value
    render()
  })

  app.querySelector('#file').addEventListener('change', (e) => {
    const file = e.target.files?.[0]
    onFile(file)
  })

  app.querySelector('#recognize').addEventListener('click', () => recognize())
  app.querySelector('#reset').addEventListener('click', () => {
    state.people = defaultPeople()
    setStatus('Список сброшен')
  })
  app.querySelector('#copy').addEventListener('click', () => copyText())

  app.querySelectorAll('.person').forEach((el) => {
    const i = Number(el.dataset.i)
    el.querySelectorAll('[data-field]').forEach((input) => {
      const field = input.getAttribute('data-field')
      const handler = () => {
        if (field === 'event') state.people[i].event = input.checked
        else state.people[i][field] = input.value
        // обновляем только текст, без полного ре-рендера полей (фокус)
        const out = app.querySelector('#out')
        if (out) {
          out.value = buildRashodText({
            group: GROUP_CODE,
            dateLabel: formatDateRu(state.date),
            people: state.people,
          })
        }
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

render()
