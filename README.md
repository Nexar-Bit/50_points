# FRONTEND — 50points (Next.js)

Next.js 14 UI for the 50points horse-racing tournament platform. Talks to the **BACKEND** FastAPI server (`../BACKEND`) for all data.

> Start the API first: `cd ../BACKEND && uvicorn app.main:app --reload --port 8000`

## Setup

```bash
cd FRONTEND
npm install
copy .env.example .env.local
```

## Run

Start the API first (`BACKEND` on port 8000), then:

```bash
npm run dev
```

Open: [http://localhost:3000/50points](http://localhost:3000/50points)

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI base URL (no trailing slash) |

Static assets and pages use `basePath: /50points` (see `next.config.mjs`).
