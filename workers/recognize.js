/**
 * Cloudflare Worker — распознавание расхода через Polza.ai (Gemini).
 *
 * Деплой:
 *   1. npx wrangler login
 *   2. npx wrangler secret put POLZA_API_KEY --config workers/wrangler.toml
 *   3. npm run worker:deploy
 *   4. URL вида https://rashod-api.XXXX.workers.dev → в .env.local как VITE_API_URL
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Max-Age': '86400',
}

const POLZA_URL = 'https://polza.ai/api/v1/chat/completions'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS },
  })
}

function buildPrompt({ day, group, roster }) {
  const list = roster
    .map((p, i) => `${i + 1}. ${p.fullName} (фамилия: ${p.surname})`)
    .join('\n')

  return `Ты разбираешь фото «График посещаемости» курсантов.

Задача: прочитать ТОЛЬКО столбец дня ${day} (число месяца в шапке таблицы 1–31).

Легенда бланка:
- «+» = present (на лицо)
- «−» / «-» = absent (отсутствует)
- «Н» = duty (наряд)
- «О» = excused (отпущен)
- «Б» = sick (болен)
- «Н/П» = unknown
- «С» = unauthorized (самовольный уход)
- пустая ячейка (выходной/нет отметки) = empty

Важно про исправления:
- если поверх «+» жирно перечёркнуто или написан более жирный «−» — это absent;
- не путай «Н» (кириллическая) с плюсом.

Группа по умолчанию: ${group}.
Список курсантов (сопоставляй по порядку строк и ФИО на листе):
${list}

Верни СТРОГО один JSON без markdown:
{
  "group": "${group}",
  "day": ${day},
  "students": [
    { "surname": "Фамилия", "mark": "present|absent|duty|excused|sick|unknown|unauthorized|empty", "confidence": 0.0 }
  ]
}

students — ровно по одному на каждого из списка выше, в том же порядке.
confidence от 0 до 1.`
}

function extractJson(text) {
  if (!text) throw new Error('Пустой ответ модели')
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('В ответе нет JSON')
  return JSON.parse(cleaned.slice(start, end + 1))
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
          temperature: 0.1,
          max_tokens: 4000,
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
      return json({
        ok: true,
        model,
        usage: upstreamJson.usage || null,
        result: parsed,
      })
    } catch (err) {
      return json(
        { error: err.message || 'Не разобрать ответ', raw: String(content).slice(0, 2000) },
        502,
      )
    }
  },
}
