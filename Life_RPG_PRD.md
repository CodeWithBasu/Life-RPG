# Life RPG — Product Requirements Document

**Team size:** 4
**Roles:** Frontend Engineer · Backend Engineer · Database/API Engineer · Deployment & UI/UX Lead
*(Assumption: since 5 functions were listed for 4 people, Deployment and UI/UX are combined into one role — that person owns visual design decisions AND ships the infra. Swap this pairing if your team prefers Database+Backend combined instead, with a standalone UI/UX person — see "Alternate Team Split" at the end.)*

---

## 1. Product Vision

Life RPG turns real-world habits into a persistent character-progression game. Completing a task ("Quest") gives XP toward a non-linear level curve, feeds a category-specific attribute (Intellect, Strength, Discipline...), extends a daily streak, and pays out currency to spend in a cosmetic shop. The app must feel like a game first, a tracker second — instant feedback, juicy animations, zero perceptible network lag — while still being a real full-stack app with auth, a real database, and cross-device sync.

## 2. Target User

Someone who has tried habit trackers before and abandoned them because they felt like spreadsheets. They respond to games, streaks, and loss-aversion ("don't break the chain").

## 3. Success Criteria (tie back to judging rubric)

| Pillar | What "done" looks like |
|---|---|
| Design & UX | Cohesive theme (art direction locked by Day 2), no default/unstyled components |
| Performance & SEO | Lighthouse ≥90 perf/SEO, optimistic UI on every mutation |
| Gamification | Non-linear leveling, streaks, attributes, economy all interlocking, not bolted on |
| Robustness | Empty states, offline/slow-network states, validation errors all handled |
| Accessibility | Full keyboard nav, semantic HTML, screen-reader labels, responsive 320px→1440px |

---

## 4. Tech Stack Decision (lock this on Day 1)

- **Frontend:** React + Vite + Tailwind + Framer Motion
- **Backend:** Node.js + Express (or NestJS) — REST API
- **Database:** PostgreSQL (relational fits Users/Tasks/Attributes/Transactions well) via Prisma ORM
- **Auth:** JWT with httpOnly refresh cookies (or Clerk/Supabase Auth if the team wants to move faster)
- **Deploy:** Frontend → Vercel/Netlify · Backend+DB → Railway/Render (keeps both in one dashboard, simplifies env vars)

Picking one option per category *now* avoids integration hell in week 2.

---

## 5. System Architecture

```
[React SPA] --HTTPS/JWT--> [Express API] --Prisma--> [PostgreSQL]
     |                            |
  optimistic UI            business logic:
  loading skeletons        XP curve, streak calc,
  local cache               attribute updates,
                            currency ledger
```

Single source of truth for game rules lives in the **backend**, never the frontend — this is what satisfies the "prevent cheating" requirement. The frontend predicts the outcome for instant feedback (optimistic update), then reconciles with the server's authoritative response.

---

## 6. Database Schema (owned by Database/API Engineer)

Core tables:
- **users**: id, email, password_hash, display_name, created_at
- **characters**: id, user_id (FK), level, current_xp, xp_to_next_level, currency_balance
- **attributes**: id, character_id (FK), name (Intellect/Strength/...), value
- **tasks**: id, user_id (FK), title, category (maps to an attribute), status, difficulty, created_at, completed_at
- **streaks**: id, character_id (FK), current_streak, longest_streak, last_activity_date
- **transactions**: id, character_id (FK), type (earn/spend), amount, reason, created_at
- **shop_items**: id, name, cost, type (theme/badge/cosmetic)
- **inventory**: id, character_id (FK), shop_item_id (FK), acquired_at

Leveling formula example (non-linear): `xp_to_next_level = floor(100 * level^1.5)`. Document the actual formula chosen in the README.

---

## 7. API Contract (owned jointly by Backend + Frontend, finalize by Day 2)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/signup, /auth/login, /auth/refresh | Auth |
| GET | /me | Current user + character state |
| GET/POST | /tasks | List / create tasks |
| PATCH | /tasks/:id/complete | Triggers XP, attribute, streak, currency logic server-side |
| DELETE | /tasks/:id | Delete task |
| GET | /shop | List shop items |
| POST | /shop/:id/purchase | Spend currency, add to inventory |
| GET | /leaderboard (optional stretch) | Cross-user comparison |

Write this as an OpenAPI/Postman spec on Day 1 so Frontend can build against mocked responses while Backend implements the real thing in parallel.

---

## 8. Role Breakdown & Responsibilities

### Frontend Engineer
- React app shell, routing, state management (React Query/Zustand for server-state caching)
- All game-feel work: XP bar fill animation, level-up celebration, particle/confetti on quest complete, skeleton loaders
- Optimistic updates: apply the XP/level change locally immediately, roll back if the API call fails
- Full keyboard nav + ARIA roles + responsive breakpoints
- Consumes the API contract from Step 7 (mock with MSW/JSON server before backend endpoints are live)

### Backend Engineer
- Express/Nest API implementing every endpoint in the contract
- Auth: signup/login/session handling, password hashing, JWT issuance/refresh
- Server-side authority for ALL game math (XP, leveling, streak resets, currency) — never trust client-submitted stat changes
- Input validation, error handling, rate limiting on sensitive routes

### Database/API Engineer
*(can also own Prisma schema + migrations + some API endpoints if backend engineer is stretched)*
- Schema design (Section 6), migrations, seed data for demo/testing
- Query optimization (indexes on user_id, foreign keys)
- Data integrity: cascading deletes, unique constraints (e.g., one streak record per character)
- Works closely with Backend Engineer on the transaction logic for currency/XP so nothing double-counts

### Deployment & UI/UX Lead
- **UI/UX half:** locks the theme (fantasy/cyberpunk/retro/minimal) by end of Day 1, produces a mini style guide (palette, type scale, spacing, key component states — button/card/modal in default/hover/disabled), reviews every screen before merge for visual consistency
- **Deployment half:** CI/CD setup, environment variables across frontend/backend/DB, staging + production environments, uptime/monitoring, final production smoke test before submission, records the 90–180s demo video

---

## 9. Build Plan (suggested — adjust to your actual timeline)

**Phase 0 — Setup (Day 1)**
- Lock tech stack, theme, and API contract
- Repo scaffolded with folders for frontend/backend, README started, .env.example created
- DB schema drafted and migrated to a dev database

**Phase 1 — Core Loop (Days 2–4)**
- Auth working end-to-end (signup → login → protected route)
- Task CRUD working end-to-end
- Basic XP/level calculation on task completion (server-authoritative)
- Frontend renders real data, no animations yet

**Phase 2 — Gamification (Days 5–7)**
- Streak tracking logic
- Attributes tied to task categories
- Currency + shop + inventory
- Frontend: XP bar animations, level-up modal, streak UI, shop UI

**Phase 3 — Polish (Days 8–9)**
- Full responsive pass, keyboard nav pass, screen reader labels
- Loading skeletons + optimistic UI on every mutation
- Error states: empty task list, failed network call, invalid form input
- Lighthouse pass for performance/SEO

**Phase 4 — Ship (Day 10)**
- Deploy frontend + backend to production
- Final smoke test on the live URL (not localhost)
- Record demo video: signup/login → add & complete a quest → level up → refresh page to prove persistence
- Clean commit history check, finalize README

---

## 10. Zero-Tolerance Checklist Before Submitting

- [ ] Repo is public with ≥3 real commits and backend code included
- [ ] Live URL loads with no console errors and no blank-screen crash
- [ ] Data survives a full page refresh (not localStorage-only)
- [ ] Backend actually connects to the production database (not just local)
- [ ] Video is public, unlisted-but-linkable, under 100MB, 90–180 seconds
- [ ] README has setup steps and a real `.env.example`

---

## 11. Alternate Team Split (if preferred)

If you'd rather keep UI/UX as a fully separate discipline:
- Person 1: Frontend (structure/logic, no design ownership)
- Person 2: Backend + Database (one person owns both, since schema and API logic are tightly coupled)
- Person 3: UI/UX (owns theme, style guide, component polish, works directly with Frontend)
- Person 4: Deployment/DevOps + QA (CI/CD, environments, cross-device testing, demo video)

Choose whichever split matches your team's actual strengths — the deliverables and checklist above don't change either way.
