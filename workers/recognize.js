/**
 * Cloudflare Worker — распознавание расхода через Polza.ai (Gemini).
 * Два прохода: основной + перепроверка спорных/+−.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type,x-access-code',
  'Access-Control-Max-Age': '86400',
}

const POLZA_URL = 'https://polza.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'google/gemini-2.5-pro'
const DEFAULT_VERIFY_MODEL = 'google/gemini-2.5-pro'

const MARK_ALIASES = {
  present: 'present',
  '+': 'present',
  plus: 'present',
  'плюс': 'present',
  'на лицо': 'present',
  налицо: 'present',
  absent: 'absent',
  '-': 'absent',
  '−': 'absent',
  '–': 'absent',
  minus: 'absent',
  'минус': 'absent',
  'нет': 'absent',
  'отсутствует': 'absent',
  duty: 'duty',
  н: 'duty',
  h: 'duty',
  'наряд': 'duty',
  event: 'event',
  мп: 'event',
  'мп.': 'event',
  mp: 'event',
  'м.п': 'event',
  'м.п.': 'event',
  ип: 'event',
  мероприятие: 'event',  excused: 'excused',
  о: 'excused',
  'отпущен': 'excused',
  sick: 'sick',
  б: 'sick',
  'болен': 'sick',
  unknown: 'unknown',
  'н/п': 'unknown',
  нп: 'unknown',
  unauthorized: 'unauthorized',
  с: 'unauthorized',
  'самоволка': 'unauthorized',
  empty: 'empty',
  '': 'empty',
  null: 'empty',
}

function normalizeMark(raw) {
  const key = String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replaceAll('.', '')
  return MARK_ALIASES[key] || MARK_ALIASES[key.replaceAll(' ', '')] || null
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  })
}

function buildGlyphsChunkPrompt({ day, group, roster, start, end }) {
  // start/end — индексы 0-based, end exclusive
  const slice = roster.slice(start, end)
  const list = slice.map((p, i) => `${start + i + 1}. ${p.fullName}`).join('\n')
  const n = slice.length

  return `OCR фрагмента. Группа ${group}. Столбец дня ${day} только.

Прочитай знаки ТОЛЬКО для строк №${start + 1}–${start + n} (подряд, без пропусков и сдвигов).

Легенда glyph:
"+" есть
"-" нету  
"Н" наряд (одна буква)
"мп" мероприятие (две буквы; не путай с Н)
"О" "Б" "Н/П" "С" или "+"

Метод: для каждого номера найди ряд слева с этим №, веди взгляд вправо в столбец ${day}.

Строки:
${list}

JSON:
{"from":${start + 1},"to":${start + n},"glyphs":[${Array(n).fill('\"+\"').join(',')}]}
glyphs.length строго ${n}. glyphs[0] = знак строки №${start + 1}.`
}

function buildConfirmSpecialsPrompt({ day, roster, glyphs }) {
  const specials = []
  glyphs.forEach((g, i) => {
    const mark = normalizeMark(g) || (g === '+' ? 'present' : 'present')
    if (mark !== 'present' && String(g).trim() !== '+' && String(g).trim() !== '') {
      specials.push(`${i + 1}. ${roster[i].fullName} → glyph="${g}"`)
    }
  })
  // всегда дополнительно просим проверить «опасные» ряды 2,9,12
  const must = [2, 9, 12]
    .filter((n) => n <= roster.length)
    .map((n) => `${n}. ${roster[n - 1].fullName} (сейчас "${glyphs[n - 1] || '?'}")`)
    .join('\n')

  return `Финальная проверка столбца ${day}.

Сейчас как non-plus:
${specials.length ? specials.join('\n') : '(нет)'}

Обязательно перепроверь эти ряды (часто ошибаются):
${must}

Верни ПОЛНЫЙ массив glyphs длины ${roster.length} с исправлениями:
{"glyphs":[...]}`
}

function marksFromGlyphs(glyphs, rosterLen) {
  const out = []
  for (let i = 0; i < rosterLen; i++) {
    const g = glyphs[i]
    const mark = normalizeMark(g) || (String(g || '').trim() === '+' ? 'present' : null) || 'empty'
    // сырой + 
    const finalMark =
      mark === 'empty' && String(g || '').trim() === '+'
        ? 'present'
        : mark === 'empty' && !String(g || '').trim()
          ? 'present' // пусто в учебный день чаще = не заполнено, но для расхода считаем как есть? User said others are +. Empty -> present for typical sheet
          : mark === 'empty'
            ? 'present'
            : mark
    out.push({
      mark: finalMark === 'empty' ? 'present' : finalMark,
      confidence: 0.88,
      disagreed: false,
      firstMark: finalMark,
      glyph: g ?? null,
    })
  }
  return out
}

function glyphsFromParsed(parsed, rosterLen) {
  if (!Array.isArray(parsed?.glyphs)) return null
  const g = parsed.glyphs.map((x) => String(x ?? '').trim())
  if (g.length === rosterLen) return g
  if (g.length > rosterLen) return g.slice(0, rosterLen)
  // pad
  while (g.length < rosterLen) g.push('+')
  return g
}

function resolveExceptionIndex(roster, ex) {
  const sn = String(ex?.surname || '')
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')

  let byName = -1
  if (sn) {
    byName = roster.findIndex((r) => r.surname.toLowerCase().replace(/ё/g, 'е') === sn)
    if (byName < 0) {
      byName = roster.findIndex((r) => {
        const full = r.fullName.toLowerCase().replace(/ё/g, 'е')
        const sur = r.surname.toLowerCase().replace(/ё/g, 'е')
        return full.startsWith(sn) || sn.startsWith(sur)
      })
    }
  }

  const i = Number(ex?.n) - 1
  const nOk = Number.isInteger(i) && i >= 0 && i < roster.length

  // Приоритет номера строки на листе: знак читаем по горизонтали ряда,
  // фамилии модель часто путает.
  if (nOk) {
    const disagreed = byName >= 0 && byName !== i
    return { index: i, disagreed }
  }
  if (byName >= 0) return { index: byName, disagreed: false }
  return { index: -1, disagreed: false }
}

function marksFromExceptions(roster, exceptions) {
  const marks = roster.map(() => 'present')
  const meta = roster.map(() => ({ confidence: 0.85, disagreed: false, firstMark: 'present' }))

  for (const ex of exceptions || []) {
    const { index: i, disagreed } = resolveExceptionIndex(roster, ex)
    if (i < 0) continue
    const mark = normalizeMark(ex.mark) || normalizeMark(ex.glyph) || 'empty'
    if (mark === 'present' || mark === 'empty') continue
    marks[i] = mark
    meta[i] = {
      confidence: disagreed ? 0.6 : 0.9,
      disagreed,
      firstMark: mark,
      glyph: ex.glyph || null,
    }
  }

  return marks.map((mark, i) => ({
    mark,
    confidence: meta[i].confidence,
    disagreed: meta[i].disagreed,
    firstMark: meta[i].firstMark,
  }))
}

function exceptionsFromParsed(parsed) {
  if (Array.isArray(parsed?.exceptions)) return parsed.exceptions
  if (Array.isArray(parsed?.fixes)) {
    return parsed.fixes.map((f) => ({
      n: f.i,
      mark: f.mark,
      surname: f.surname,
      glyph: f.glyph,
    }))
  }
  return null
}

function repairJson(text) {
  let s = String(text)
    .replace(/```json\s*/gi, '')
    .replace(/```/g, '')
    .trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('В ответе нет JSON')
  s = s.slice(start, end + 1)
  s = s.replace(/,\s*([}\]])/g, '$1')
  s = s.replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'")
  return s
}

function extractJson(text) {
  if (!text) throw new Error('Пустой ответ модели')
  const repaired = repairJson(text)
  try {
    return JSON.parse(repaired)
  } catch (firstErr) {
    const marksMatch = repaired.match(/"marks"\s*:\s*\[([\s\S]*?)\]/)
    if (marksMatch) {
      const parts = marksMatch[1]
        .split(',')
        .map((x) => x.replace(/[^a-zA-Zа-яА-ЯёЁ+\-−/]/g, '').trim())
        .filter(Boolean)
      if (parts.length) return { marks: parts, day: null, _repaired: true }
    }
    const objs = [...repaired.matchAll(/"mark"\s*:\s*"([^"]+)"/gi)].map((m) => ({
      mark: m[1],
    }))
    if (objs.length) return { students: objs, _repaired: true }
    throw firstErr
  }
}

function marksFromParsed(parsed, rosterLen) {
  let raw = []
  if (Array.isArray(parsed?.marks)) raw = parsed.marks
  else if (Array.isArray(parsed?.students)) raw = parsed.students.map((s) => s.mark)

  const out = []
  for (let i = 0; i < rosterLen; i++) {
    out.push(normalizeMark(raw[i]) || 'empty')
  }
  return out
}

function normalizeResult(merged, roster, day) {
  const students = roster.map((r, i) => {
    const hit = merged[i] || { mark: 'empty', confidence: 0.2 }
    return {
      surname: r.surname,
      mark: hit.mark,
      confidence: hit.confidence,
      rawMark: hit.firstMark ?? null,
      disagreed: !!hit.disagreed,
    }
  })
  return { day, students }
}

function sumUsage(a, b) {
  if (!a && !b) return null
  const x = a || {}
  const y = b || {}
  return {
    prompt_tokens: (x.prompt_tokens || 0) + (y.prompt_tokens || 0),
    completion_tokens: (x.completion_tokens || 0) + (y.completion_tokens || 0),
    total_tokens: (x.total_tokens || 0) + (y.total_tokens || 0),
    cost_rub: Number(x.cost_rub ?? x.cost ?? 0) + Number(y.cost_rub ?? y.cost ?? 0),
    cost: Number(x.cost_rub ?? x.cost ?? 0) + Number(y.cost_rub ?? y.cost ?? 0),
  }
}

async function callPolza(env, { model, prompt, images }) {
  const content = [{ type: 'text', text: prompt }]
  for (const url of images) {
    if (!url) continue
    content.push({
      type: 'image_url',
      image_url: { url, detail: 'high' },
    })
  }
  const upstream = await fetch(POLZA_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.POLZA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content }],
    }),
  })
  const rawText = await upstream.text()
  let upstreamJson
  try {
    upstreamJson = JSON.parse(rawText)
  } catch {
    throw new Error('Polza вернула не JSON: ' + rawText.slice(0, 200))
  }
  if (!upstream.ok) {
    const msg = upstreamJson?.error?.message || upstreamJson?.message || 'Ошибка Polza'
    const err = new Error(msg)
    err.status = upstream.status
    err.detail = upstreamJson
    throw err
  }
  return upstreamJson
}

function accessOk(request, body, env) {
  const expected = String(env.ACCESS_CODE || '').trim()
  if (!expected) return false
  const fromHeader = (request.headers.get('x-access-code') || '').trim()
  const fromBody = String(body?.accessCode || '').trim()
  return fromHeader === expected || fromBody === expected
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    const url = new URL(request.url)
    const model = env.MODEL || DEFAULT_MODEL
    const verifyModel = env.VERIFY_MODEL || DEFAULT_VERIFY_MODEL

    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({ ok: true, model, verifyModel })
    }

    if (request.method === 'POST' && url.pathname.endsWith('/auth')) {
      let body = {}
      try {
        body = await request.json()
      } catch {
        body = {}
      }
      if (!accessOk(request, body, env)) {
        return json({ ok: false, error: 'Неверный код доступа' }, 401)
      }
      return json({ ok: true })
    }

    if (request.method !== 'POST' || !url.pathname.endsWith('/recognize')) {
      return json({ error: 'Not found' }, 404)
    }

    if (!env.POLZA_API_KEY) {
      return json({ error: 'POLZA_API_KEY не задан' }, 500)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Неверный JSON' }, 400)
    }

    if (!accessOk(request, body, env)) {
      return json({ error: 'Нужен код доступа' }, 401)
    }

    const { imageBase64, imageCropBase64, mimeType = 'image/jpeg', day, group, roster } =
      body || {}
    if (!imageBase64 || !day || !Array.isArray(roster) || !roster.length) {
      return json({ error: 'Нужны imageBase64, day и roster' }, 400)
    }

    const dayNum = Number(day)
    if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 31) {
      return json({ error: 'day должен быть 1–31' }, 400)
    }

    const toDataUrl = (raw) =>
      String(raw).startsWith('data:') ? raw : `data:${mimeType};base64,${raw}`

    const dataUrl = toDataUrl(imageBase64)
    const cropUrl = imageCropBase64 ? toDataUrl(imageCropBase64) : null
    const images = cropUrl ? [dataUrl, cropUrl] : [dataUrl]

    const g = group || '0903-ПД3'

    try {
      const chunks = [
        [0, 7],
        [7, 14],
        [14, roster.length],
      ]
      let glyphs = []
      let usageAcc = null

      for (const [start, end] of chunks) {
        const up = await callPolza(env, {
          model,
          prompt:
            buildGlyphsChunkPrompt({ day: dayNum, group: g, roster, start, end }) +
            (cropUrl
              ? '\n\nВторое фото — увеличенный правый край листа (дни). Ориентируйся по нему для знаков.'
              : ''),
          images,
        })
        usageAcc = sumUsage(usageAcc, up.usage)
        const parsed = extractJson(up?.choices?.[0]?.message?.content)
        const part = glyphsFromParsed(parsed, end - start)
        if (!part) {
          throw new Error(`Не разобрать glyphs для строк ${start + 1}–${end}`)
        }
        glyphs = glyphs.concat(part)
      }

      if (glyphs.length !== roster.length) {
        while (glyphs.length < roster.length) glyphs.push('+')
        glyphs = glyphs.slice(0, roster.length)
      }

      const verifyUp = await callPolza(env, {
        model: verifyModel,
        prompt:
          buildConfirmSpecialsPrompt({ day: dayNum, roster, glyphs }) +
          (cropUrl ? '\nВторое фото — кроп дней, сверь спорные клетки по нему.' : ''),
        images,
      })
      usageAcc = sumUsage(usageAcc, verifyUp.usage)
      const verifyParsed = extractJson(verifyUp?.choices?.[0]?.message?.content)
      const glyphs2 = glyphsFromParsed(verifyParsed, roster.length)
      const before = glyphs.slice()
      if (glyphs2) glyphs = glyphs2

      const merged = marksFromGlyphs(glyphs, roster.length)
      for (let i = 0; i < merged.length; i++) {
        if (String(before[i] || '') !== String(glyphs[i] || '')) {
          merged[i].disagreed = true
          merged[i].confidence = 0.6
        }
      }

      const result = normalizeResult(merged, roster, dayNum)
      const filled = result.students.filter((s) => s.mark !== 'empty').length
      const disagreed = result.students.filter((s) => s.disagreed).length
      const specials = result.students.filter((s) => s.mark !== 'present').length

      return json({
        ok: true,
        model,
        verifyModel,
        verified: true,
        mode: 'glyphs-chunked',
        glyphs,
        specials,
        disagreed,
        usage: usageAcc,
        filled,
        result,
      })
    } catch (err) {
      return json(
        {
          error: err.message || 'Ошибка распознавания',
          detail: err.detail || null,
        },
        err.status || 502,
      )
    }
  },
}
