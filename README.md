# Расход группы 0903-ПД3

Сайт: фото графика посещаемости → распознавание через Polza.ai (`google/gemini-3.8-flash`) → правка → текст расхода.

## Важно про ключ

API-ключ **не** кладётся в GitHub Pages. Он хранится только как секрет Cloudflare Worker.

Если ключ светился в чате — **перевыпусти** его в [polza.ai/dashboard](https://polza.ai/dashboard).

## Локально

```bash
npm install
# Workers / секрет:
# создай workers/.dev.vars:
#   POLZA_API_KEY=pza_...
npm run worker:dev
# в другом терминале:
echo VITE_API_URL= > .env.local
npm run dev
```

При пустом `VITE_API_URL` Vite проксирует `/api` на `http://127.0.0.1:8787`.

## Деплой

1. Worker:

```bash
npx wrangler login
npx wrangler secret put POLZA_API_KEY --config workers/wrangler.toml
npm run worker:deploy
```

2. В `.env.local`:

```
VITE_API_URL=https://rashod-api.<твой-сабаккаунт>.workers.dev
```

3. Сайт на GitHub Pages:

```bash
npm run deploy
```

Страница будет на `https://pepsicolaq.github.io/rashod/`.
