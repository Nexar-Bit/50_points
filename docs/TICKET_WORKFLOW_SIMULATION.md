# Ticket workflow simulation — all run types

Use this checklist to verify the full ticket path from landing → modality → racetrack → ticket → races → submission. Run each scenario with the dev stack (`npm run dev` + `python run.py`).

## Canonical flow (no extra steps)

```
/comenzar (info landing)
  → /modalidades or /modalidades/guest
  → /modalidades/{free|guest}/hipodromos
  → banner + overview dots + tabs + accordion
  → 3 horizontal ticket tabs (local only)
  → landscape ticket + VER TICKET / play
  → /tournament/{slug}?modality=&ticket=&track=&return=
  → CARRERAS accordion → Full / Dual / Smart picks → submit
```

**Local-only interactions (no navigation):**

- Overview bar: 3 dots under each track logo
- `TrackTicketsPanel`: ticket tabs 1 / 2 / 3
- Race list: strategy buttons under each horse (in-tournament)

---

## Run type A — Standard / demo sheet (UI walkthrough)

**Purpose:** Validate layout and pick UX with seeded backend data. No auth required for browsing; ticket “used” state is client-side.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open `/comenzar` | Steps, facts, CTAs to modalities and how-to-play |
| 2 | Click **ELEGIR MODALIDAD** → `/modalidades` → **MODALIDAD GRATIS** | Lands on `/modalidades/free/hipodromos` |
| 3 | Confirm banner “3 TICKETS GRATIS…” and overview bar | Track logos + 3 slots per track |
| 4 | Click a track logo or expand accordion row | `TrackTicketsPanel` appears below list |
| 5 | Click ticket tab **2** (or overview dot 2) | Tab highlights; landscape ticket updates |
| 6 | Click **VER TICKET** | `/tournament/{slug}?play` absent — overview only, race accordion closed |
| 7 | Click **Jugar carrera** (or play CTA) | URL includes `play=1`; Race 1 expands |
| 8 | Pick horses with Full / Dual / Smart | Points allocation matches strategy |
| 9 | Confirm pick for race 1 | Confirmation UI; repeat for races 2–7 |
| 10 | Return to hipódromos (`return` query) | Ticket 1 slot shows green check (localStorage) |

**Data source:** `BACKEND/app/seed.py` tournaments (Gulfstream, Churchill Downs, Santa Anita, etc.) via `GET /api/tournaments`.

**Ticket used tracking:** `localStorage` key `50points_free_track_tickets_v1` — see `trackTicketUsage.js`. Event `50points-tickets-updated` refreshes overview dots.

---

## Run type B — Guest real run (API + guest session)

**Purpose:** Full path as unregistered user with backend guest token.

| Step | Action | Expected |
|------|--------|----------|
| 1 | `/comenzar` → **JUGAR SIN REGISTRO** | `POST /api/auth/guest` → redirect `/modalidades/guest/hipodromos` |
| 2 | Expand live track (e.g. Gulfstream) | 3 ticket tabs; none used initially |
| 3 | Select ticket **1** → play | `modality=guest&ticket=1&track={slug}&play=1` |
| 4 | Complete picks and submit ticket | `POST /api/tickets` with guest token |
| 5 | Back to hipódromos | Dot 1 = used; tabs 2–3 still available |
| 6 | Play ticket **2** on same track | Independent picks/score from ticket 1 |

**Verify API:**

```bash
# Guest session
curl -X POST http://localhost:5000/api/auth/guest

# Live tournaments (poll used by workflow list)
curl http://localhost:5000/api/tournaments?status=live
```

---

## Run type C — Registered real run (auth + persisted tickets)

**Purpose:** Registered free-modality user; tickets stored server-side.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Register or login → `/comenzar` → **IR A HIPODROMOS** or hub **MODALIDAD GRATIS** | `/modalidades/free/hipodromos` |
| 2 | Select track + ticket 3 → play | Auth header on ticket fetch/submit |
| 3 | Submit all 7 races | `GET /api/tickets?tournamentId=` returns submitted rows |
| 4 | Reload tournament page | Prior picks restored from API |
| 5 | Return to workflow | Overview dot 3 marked used (localStorage + server state) |

---

## Run type D — Dummy / offline-style run (no backend)

**Purpose:** UI-only when API is down or empty list.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Stop backend or clear DB | Hipódromos list shows empty message |
| 2 | Home live section | `previewOnly` cards — no direct tournament entry |
| 3 | All play CTAs | Route through `/comenzar` → modalities, not home cover |

> **Note:** There is no separate “PLANTILLA FICTICIA” route in code today; demo data comes from seed. A future static demo tournament could mount the same `TournamentClient` with fixture JSON.

---

## URL parameters reference

| Param | Meaning |
|-------|---------|
| `modality` | `free`, `guest`, `paid`, `special` |
| `ticket` | 1, 2, or 3 |
| `track` | Track slug for return + usage key |
| `return` | Encoded path back to hipódromos workflow |
| `play=1` | Auto-expand race 1 on tournament load |

Built by `buildTournamentEntryHref()` in `gameModalities.js`.

---

## Regression checklist

- [ ] Overview dot click does **not** navigate away — only selects track + ticket
- [ ] Ticket tabs do **not** navigate — only change active panel
- [ ] Accordion collapse/expand does not lose `activeTicketNum`
- [ ] `VER TICKET` opens tournament **without** `play=1`
- [ ] Play CTA opens with `play=1` and race 1 expanded
- [ ] Home `/` does **not** enter tournaments directly — CTA goes to `/comenzar`
- [ ] `/tournaments` page uses same preview-only cards (if applicable)

---

## Files map

| Concern | File |
|---------|------|
| Unified workflow UI | `TracksWorkflowList.jsx` |
| Overview dots | `FreeTicketsOverviewBar.jsx` |
| Ticket tabs + card | `TrackTicketsPanel.jsx`, `FreeTicketCard.jsx` |
| Entry URLs | `gameModalities.js` |
| Used state (client) | `trackTicketUsage.js` |
| Tournament play | `TournamentClient.js` |
| Info landing | `comenzar/ComenzarPageClient.jsx` |
| Seed data | `BACKEND/app/seed.py` |
