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

function buildExceptionsPrompt({ day, group, roster }) {
  const list = roster.map((p, i) => `${i + 1}. ${p.fullName}`).join('\n')
  const n = roster.length

  return `OCR графика посещаемости. Группа ${group}.

Большинство клеток в столбце дня ${day} — это «+» (человек есть).
Твоя задача: найти ВСЕ исключения в столбце ${day}, где знак НЕ плюс.

Легенда исключений:
- или − = absent (нету)
Н (одна буква как H) = duty (наряд)
мп / МП / м.п. (две буквы; иногда криво как «ип») = event (мероприятие)
О = excused, Б = sick, Н/П = unknown, С = unauthorized

Правила:
1) Смотри ТОЛЬКО столбец с числом ${day} в шапке.
2) Номер строки = колонка № на листе = номер в списке ниже (без сдвига).
3) Не путай Н и мп.
4) Не включай тех, у кого обычный +.

Список (${n} чел.):
${list}

JSON:
{"day":${day},"exceptions":[{"n":2,"surname":"Брюкин","glyph":"-","mark":"absent"}]}

n — номер с 1. Если исключений нет — {"day":${day},"exceptions":[]}.`
}

function buildConfirmExceptionsPrompt({ day, roster, exceptions }) {
  const lines = (exceptions || [])
    .map((e) => `n=${e.n}, ${roster[(e.n || 1) - 1]?.fullName || e.surname}, glyph=${e.glyph || '?'}, mark=${e.mark}`)
    .join('\n')

  return `Подтверди исключения столбца дня ${day}.

Черновик исключений (все остальные на листе = +):
${lines || '(пусто)'}

Для КАЖДОГО пункта: верно ли, что в клетке дня ${day} у этой строки именно такой знак?
Также: не пропущен ли кто-то ещё с − / Н / мп?

JSON:
{"exceptions":[{"n":2,"surname":"Брюкин","glyph":"-","mark":"absent"}],"ok":true}

Верни полный итоговый список exceptions (исправленный). ok=true если черновик был верным.`
}

function marksFromExceptions(roster, exceptions) {
  const marks = roster.map(() => 'present')
  const meta = roster.map(() => ({ confidence: 0.85, disagreed: false, firstMark: 'present' }))

  for (const ex of exceptions || []) {
    let i = Number(ex?.n) - 1
    if (!Number.isInteger(i) || i < 0 || i >= roster.length) {
      const sn = String(ex?.surname || '')
        .trim()
        .toLowerCase()
      if (sn) {
        i = roster.findIndex((r) => r.surname.toLowerCase() === sn)
      }
    }
    if (i < 0 || i >= roster.length) continue
    const mark = normalizeMark(ex.mark) || normalizeMark(ex.glyph) || 'empty'
    if (mark === 'present' || mark === 'empty') continue
    marks[i] = mark
    meta[i] = {
      confidence: 0.9,
      disagreed: false,
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
      // Проход 1: только исключения (не +) — точнее для типичного расхода
      const firstUp = await callPolza(env, {
        model,
        prompt: buildExceptionsPrompt({ day: dayNum, group: g, roster }),
        dataUrl,
      })
      const firstParsed = extractJson(firstUp?.choices?.[0]?.message?.content)
      let exceptions = exceptionsFromParsed(firstParsed) || []

      // Проход 2: подтвердить/дополнить список исключений
      const verifyUp = await callPolza(env, {
        model: verifyModel,
        prompt: buildConfirmExceptionsPrompt({ day: dayNum, roster, exceptions }),
        dataUrl,
      })
      const verifyParsed = extractJson(verifyUp?.choices?.[0]?.message?.content)
      const confirmed = exceptionsFromParsed(verifyParsed)
      if (Array.isArray(confirmed)) exceptions = confirmed

      // Fallback: если модель вернула полный marks вместо exceptions
      let merged
      if (
        (!exceptions.length &&
          (Array.isArray(firstParsed?.marks) || Array.isArray(verifyParsed?.marks))) ||
        (!exceptions.length && Array.isArray(verifyParsed?.students))
      ) {
        const marks = marksFromParsed(
          Array.isArray(verifyParsed?.marks) || Array.isArray(verifyParsed?.students)
            ? verifyParsed
            : firstParsed,
          roster.length,
        )
        merged = marks.map((mark) => ({
          mark,
          confidence: 0.7,
          disagreed: false,
          firstMark: mark,
        }))
      } else {
        merged = marksFromExceptions(roster, exceptions)
      }

      const result = normalizeResult(merged, roster, dayNum)
      const filled = result.students.filter((s) => s.mark !== 'empty').length
      const disagreed = result.students.filter((s) => s.disagreed).length
      const usage = sumUsage(firstUp.usage, verifyUp.usage)
      const specials = result.students.filter((s) => s.mark !== 'present').length

      return json({
        ok: true,
        model,
        verifyModel,
        verified: true,
        mode: 'exceptions',
        exceptionsCount: exceptions.length,
        specials,
        disagreed,
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
