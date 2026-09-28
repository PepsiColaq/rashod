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

Шаг 1: найди в ШАПКЕ таблицы число ${day} (день месяца). Это единственный нужный столбец.
Не читай соседние дни (${day - 1}, ${day + 1} и т.д.).

Шаг 2: иди СВЕРХУ ВНИЗ по строкам с ФИО. Строка i списка = i-я фамилия на листе.
Для КАЖДОЙ строки смотри ТОЛЬКО клетку на пересечении этой строки и столбца ${day}.

Легенда mark:
горизонтальная чёрточка − / - = absent (НЕТ человека)
крест + = present (ЕСТЬ)
кириллическая Н (как латинская H) = duty (наряд)
О = excused, Б = sick, Н/П = unknown, С = unauthorized
пусто = empty
Если жирный − поверх + → absent.

Частые ошибки — НЕ делай так:
- не путай + и − (плюс имеет вертикальную линию, минус — только горизонталь);
- не сдвигай отметку на строку выше/ниже;
- не бери отметку из соседнего дня.

Группа ${group}. Список ровно ${n} человек:
${list}

Ответ — строго JSON без markdown:
{"day":${day},"marks":["present","absent",...]}
В marks ровно ${n} значений, порядок = порядок списка.`
}

function buildVerifyPrompt({ day, roster, firstMarks }) {
  const lines = roster
    .map((p, i) => `${i + 1}. ${p.fullName} → было: ${firstMarks[i] || 'empty'}`)
    .join('\n')
  const n = roster.length

  return `ПЕРЕПРОВЕРКА. Тот же лист. Столбец дня ${day} только.

Ниже черновик первого прохода. Исправь ошибки. Особенно проверь:
- у кого стоит absent — точно ли в клетке дня ${day} минус, а не плюс;
- у кого стоит present — точно ли плюс, а не минус;
- наряды (Н) не перепутаны со строками соседей.

Черновик:
${lines}

Верни исправленный JSON:
{"day":${day},"marks":["present","absent",...]}
Ровно ${n} mark в том же порядке строк.`
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

function mergeMarks(first, second) {
  // второй проход приоритетнее; при расхождении confidence ниже
  return first.map((a, i) => {
    const b = second[i] || a
    return {
      mark: b,
      confidence: a === b ? 0.92 : 0.55,
      disagreed: a !== b,
      firstMark: a,
    }
  })
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
      const secondMarks = marksFromParsed(
        extractJson(verifyUp?.choices?.[0]?.message?.content),
        roster.length,
      )

      const merged = mergeMarks(firstMarks, secondMarks)
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
