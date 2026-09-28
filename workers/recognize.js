/**
 * Cloudflare Worker — распознавание расхода через Polza.ai (Gemini).
 *
 * Деплой:
 *   npx wrangler secret put POLZA_API_KEY --config workers/wrangler.toml
 *   npm run worker:deploy
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
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
  const list = roster
    .map((p, i) => `${i + 1}. ${p.fullName} | surname=${p.surname}`)
    .join('\n')

  return `Ты OCR-парсер графика посещаемости курсантов (фото таблицы).

Нужен ТОЛЬКО столбец с числом ${day} в шапке (дни 1–31). Остальные дни игнорируй.

Легенда ячеек → значение mark (строго латиницей из списка):
+ → present
- или − (в т.ч. жирный минус поверх плюса) → absent
Н (кириллица, похожа на H) → duty
О → excused
Б → sick
Н/П → unknown
С → unauthorized
пустая ячейка → empty

Правила:
1) Смотри строку i списка = строка i на листе (сверху вниз, после шапки).
2) В surname копируй фамилию РОВНО как в поле surname= из списка.
3) mark — только: present, absent, duty, excused, sick, unknown, unauthorized, empty.
4) Нельзя всем ставить empty, если в столбце дня ${day} видны плюсы/минусы.
5) Если плюс зачёркнут жирным минусом — absent.

Группа: ${group}
Список (порядок строк):
${list}

Ответ — один JSON без markdown:
{"group":"${group}","day":${day},"students":[{"surname":"...","mark":"present","confidence":0.0}]}
students.length = ${roster.length}, тот же порядок.`
}

function extractJson(text) {
  if (!text) throw new Error('Пустой ответ модели')
  const cleaned = String(text).replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('В ответе нет JSON')
  return JSON.parse(cleaned.slice(start, end + 1))
}

function normalizeResult(parsed, roster) {
  const incoming = Array.isArray(parsed?.students) ? parsed.students : []
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
          : 0.6
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

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    const url = new URL(request.url)
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json({ ok: true, model: env.MODEL || 'google/gemini-3.8-flash' })
    }

    if (request.method !== 'POST' || !url.pathname.endsWith('/recognize')) {
      return json({ error: 'Not found' }, 404)
    }

    const apiKey = env.POLZA_API_KEY
    if (!apiKey) {
      return json({ error: 'POLZA_API_KEY не задан (wrangler secret put)' }, 500)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Неверный JSON' }, 400)
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

    let upstream
    try {
      upstream = await fetch(POLZA_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0,
          max_tokens: 5000,
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
    } catch (err) {
      return json({ error: 'Сеть: ' + (err.message || String(err)) }, 502)
    }

    const rawText = await upstream.text()
    let upstreamJson
    try {
      upstreamJson = JSON.parse(rawText)
    } catch {
      return json({ error: 'Polza вернула не JSON', detail: rawText.slice(0, 500) }, 502)
    }

    if (!upstream.ok) {
      return json(
        {
          error: upstreamJson?.error?.message || upstreamJson?.message || 'Ошибка Polza',
          detail: upstreamJson,
        },
        upstream.status || 502,
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
        { error: err.message || 'Не разобрать ответ', raw: String(content).slice(0, 2000) },
        502,
      )
    }
  },
}
