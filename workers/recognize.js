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
  мп.: 'event',
  mp: 'event',
  'м.п': 'event',
  'м.п.': 'event',
  ип: 'event',
  'мероприятие': 'event',
  excused: 'excused',
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

function buildPrompt({ day, group, roster }) {
  const list = roster.map((p, i) => `${i + 1}. ${p.fullName}`).join('\n')
  const n = roster.length

  return `Ты внимательный OCR табличного графика посещаемости.

Шаг 1: найди в ШАПКЕ таблицы число ${day}. Читай ТОЛЬКО этот столбец.
Соседние дни (${Math.max(1, day - 1)}, ${Math.min(31, day + 1)}) ИГНОРИРУЙ.

Шаг 2: сопоставь по НОМЕРУ строки (колонка №):
строка 1 списка = №1 на листе, строка 2 = №2, ... без сдвига вверх/вниз.

Легенда mark (латиница в JSON):
+ = present
− / - (только горизонталь) = absent
Н (одна буква, как H, наряд) = duty
мп / МП / м.п. (две буквы, мероприятие; иногда похоже на «ип») = event
О = excused, Б = sick, Н/П = unknown, С = unauthorized
пусто = empty

КРИТИЧНО — не путай:
- Н (наряд) ≠ мп (мероприятие). мп = две буквы подряд.
- Н у строки i не переноси на строку i±1.
- + имеет вертикальную черту; − — нет.
- Жирный − поверх + → absent.

Группа ${group}. Список ровно ${n} чел. (порядок = № на листе):
${list}

JSON без markdown:
{"day":${day},"marks":["present","absent","duty","event",...],"glyphs":["+","-","Н","мп",...]}
marks.length = ${n}, glyphs.length = ${n}.
glyphs — что реально видно в клетке (сырой символ), marks — нормализованный код.`
}

function buildVerifyPrompt({ day, roster, firstMarks }) {
  const suspect = []
  const presentish = []
  firstMarks.forEach((m, i) => {
    const line = `${i + 1}. ${roster[i].fullName} (сейчас: ${m})`
    if (m !== 'present') suspect.push(line)
    else presentish.push(line)
  })

  return `ПЕРЕПРОВЕРКА столбца дня ${day}. Не переписывай весь список — только ошибки.

Особо проверь:
- duty (Н) стоит у правильной фамилии (часто путают соседние строки);
- event (мп/МП) не пропущен и не назван duty;
- absent: есть ли минус у тех, кто marked present (и наоборот).

Сейчас НЕ present:
${suspect.length ? suspect.join('\n') : '(никого)'}

Present (ищи пропуски − / Н / мп), строки 1–14:
${presentish.slice(0, 14).join('\n')}

JSON:
{"fixes":[{"i":9,"mark":"duty","reason":"у Исмаилова в дне ${day} буква Н"},{"i":12,"mark":"event","reason":"мп"}]}
i с 1. Только реальные исправления. Если ок — {"fixes":[]}.`
}

function applyFixes(firstMarks, fixes) {
  const out = firstMarks.map((mark) => ({
    mark,
    confidence: 0.8,
    disagreed: false,
    firstMark: mark,
  }))

  if (!Array.isArray(fixes)) return out

  for (const fix of fixes) {
    const i = Number(fix?.i) - 1
    if (!Number.isInteger(i) || i < 0 || i >= out.length) continue
    const next = normalizeMark(fix.mark)
    if (!next) continue
    const prev = out[i].mark
    out[i] = {
      mark: next,
      confidence: prev === next ? 0.9 : 0.7,
      disagreed: prev !== next,
      firstMark: prev,
    }
  }
  return out
}

function fixesFromParsed(parsed) {
  if (Array.isArray(parsed?.fixes)) return parsed.fixes
  // если модель снова вернула полный marks — применяем только отличия от first позже
  return null
}

function mergeFullSecondAsDiffOnly(first, second) {
  // запасной путь: второй полный массив не затирает первый целиком
  return first.map((a, i) => {
    const b = second[i] || a
    if (a === b) {
      return { mark: a, confidence: 0.92, disagreed: false, firstMark: a }
    }
    if (a === 'present' && b !== 'present' && b !== 'empty') {
      return { mark: b, confidence: 0.65, disagreed: true, firstMark: a }
    }
    if (a !== 'present' && b === 'present') {
      return { mark: b, confidence: 0.65, disagreed: true, firstMark: a }
    }
    return { mark: a, confidence: 0.5, disagreed: true, firstMark: a }
  })
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

async function callPolza(env, { model, prompt, dataUrl }) {
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
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: dataUrl, detail: 'high' },
            },
          ],
        },
      ],
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

    const { imageBase64, mimeType = 'image/jpeg', day, group, roster } = body || {}
    if (!imageBase64 || !day || !Array.isArray(roster) || !roster.length) {
      return json({ error: 'Нужны imageBase64, day и roster' }, 400)
    }

    const dayNum = Number(day)
    if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 31) {
      return json({ error: 'day должен быть 1–31' }, 400)
    }

    const dataUrl = String(imageBase64).startsWith('data:')
      ? imageBase64
      : `data:${mimeType};base64,${imageBase64}`

    const g = group || '0903-ПД3'

    try {
      const firstUp = await callPolza(env, {
        model,
        prompt: buildPrompt({ day: dayNum, group: g, roster }),
        dataUrl,
      })
      const firstMarks = marksFromParsed(
        extractJson(firstUp?.choices?.[0]?.message?.content),
        roster.length,
      )

      const verifyUp = await callPolza(env, {
        model: verifyModel,
        prompt: buildVerifyPrompt({ day: dayNum, roster, firstMarks }),
        dataUrl,
      })
      const verifyParsed = extractJson(verifyUp?.choices?.[0]?.message?.content)
      const fixes = fixesFromParsed(verifyParsed)

      let merged
      if (fixes) {
        merged = applyFixes(firstMarks, fixes)
      } else if (Array.isArray(verifyParsed?.marks) || Array.isArray(verifyParsed?.students)) {
        const secondMarks = marksFromParsed(verifyParsed, roster.length)
        merged = mergeFullSecondAsDiffOnly(firstMarks, secondMarks)
      } else {
        merged = applyFixes(firstMarks, [])
      }

      const result = normalizeResult(merged, roster, dayNum)
      const filled = result.students.filter((s) => s.mark !== 'empty').length
      const disagreed = result.students.filter((s) => s.disagreed).length
      const usage = sumUsage(firstUp.usage, verifyUp.usage)

      return json({
        ok: true,
        model,
        verifyModel,
        verified: true,
        disagreed,
        fixesApplied: Array.isArray(fixes) ? fixes.length : null,
        usage,
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
