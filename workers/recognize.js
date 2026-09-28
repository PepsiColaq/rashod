/**
 * Cloudflare Worker — распознавание расхода через Polza.ai (Gemini).
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type,x-access-code',
  'Access-Control-Max-Age': '86400',
}

const POLZA_URL = 'https://polza.ai/api/v1/chat/completions'

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

  return `OCR графика посещаемости. Прочитай ТОЛЬКО столбец дня ${day}.

Легенда → mark:
+ = present
- или жирный минус поверх плюса = absent
Н = duty
О = excused
Б = sick
Н/П = unknown
С = unauthorized
пусто = empty

Строка 1 списка = первая ФИО на листе, и так далее.
Группа ${group}. Список (${n} чел.):
${list}

Верни ТОЛЬКО валидный JSON одной строкой, без markdown и без комментариев:
{"day":${day},"marks":["present","absent","duty"]}

В marks ровно ${n} строк, порядок как в списке выше. Только латиница из легенды.`
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
  // trailing commas
  s = s.replace(/,\s*([}\]])/g, '$1')
  // smart quotes
  s = s.replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'")
  return s
}

function extractJson(text) {
  if (!text) throw new Error('Пустой ответ модели')
  const repaired = repairJson(text)
  try {
    return JSON.parse(repaired)
  } catch (firstErr) {
    // fallback: вытащить массив marks по regex
    const marksMatch = repaired.match(/"marks"\s*:\s*\[([\s\S]*?)\]/)
    if (marksMatch) {
      const parts = marksMatch[1]
        .split(',')
        .map((x) => x.replace(/[^a-zA-Zа-яА-ЯёЁ+\-−/]/g, '').trim())
        .filter(Boolean)
      if (parts.length) {
        return { marks: parts, day: null, _repaired: true }
      }
    }
    // fallback: students objects
    const objs = [...repaired.matchAll(/"mark"\s*:\s*"([^"]+)"/gi)].map((m) => ({
      mark: m[1],
    }))
    if (objs.length) return { students: objs, _repaired: true }
    throw firstErr
  }
}

function normalizeResult(parsed, roster) {
  let incoming = []
  if (Array.isArray(parsed?.marks)) {
    incoming = parsed.marks.map((mark) => ({ mark }))
  } else if (Array.isArray(parsed?.students)) {
    incoming = parsed.students
  }

  const bySurname = new Map()
  for (const s of incoming) {
    const key = String(s?.surname || '')
      .trim()
      .toLowerCase()
    if (key) bySurname.set(key, s)
  }

  const students = roster.map((r, i) => {
    const hit = bySurname.get(String(r.surname).toLowerCase()) || incoming[i] || {}
    const mark = normalizeMark(hit.mark) || 'empty'
    const confidence =
      typeof hit.confidence === 'number'
        ? hit.confidence
        : mark === 'empty'
          ? 0.2
          : 0.7
    return {
      surname: r.surname,
      mark,
      confidence,
      rawMark: hit.mark ?? null,
    }
  })

  return {
    group: parsed?.group || null,
    day: parsed?.day ?? null,
    students,
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
      max_tokens: 2500,
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
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({ ok: true, model: env.MODEL || 'google/gemini-3.8-flash' })
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

    const model = env.MODEL || 'google/gemini-3.8-flash'
    const prompt = buildPrompt({ day: dayNum, group: group || '0903-ПД3', roster })

    let upstreamJson
    try {
      upstreamJson = await callPolza(env, { model, prompt, dataUrl })
    } catch (err) {
      return json(
        { error: err.message || String(err), detail: err.detail || null },
        err.status || 502,
      )
    }

    const content = upstreamJson?.choices?.[0]?.message?.content
    try {
      const parsed = extractJson(content)
      const result = normalizeResult(parsed, roster)
      const filled = result.students.filter((s) => s.mark !== 'empty').length
      return json({
        ok: true,
        model,
        usage: upstreamJson.usage || null,
        filled,
        result,
      })
    } catch (err) {
      return json(
        {
          error: 'Модель вернула битый ответ. Нажми «Распознать» ещё раз.',
          detail: err.message || String(err),
          raw: String(content || '').slice(0, 1500),
        },
        502,
      )
    }
  },
}
