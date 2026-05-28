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

Open: [http://localhost:3000](http://localhost:3000)

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI base URL (no trailing slash) |

## Deploy on Vercel

1. **Root Directory:** `FRONTEND` (required — repo is a monorepo).
2. **Environment:** `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
3. Open `https://<your-app>.vercel.app/` (app is served at domain root).

Old `/50points` URLs redirect to `/` automatically.
