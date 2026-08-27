# OnAir — AI Interview Assistant

A mock-interview studio: pick a track, speak your answers to a live AI interviewer,
and get scored, specific feedback in seconds. Full rewrite of the original prototype
(kept in [`legacy/`](./legacy) for reference) on a modern, production-shaped stack.

## Stack

- **Next.js 15** (App Router) + **TypeScript** — one deployable app, UI + API routes
- **Tailwind CSS** with a small hand-built design system ("On Air" studio theme — see [`DESIGN.md`](./DESIGN.md))
- **MongoDB + Mongoose**
- **JWT sessions in httpOnly cookies** (not localStorage), **Zod** validation on every API route
- **Google Gemini** (`@google/genai`) for answer evaluation and resume analysis, with a graceful fallback if the API key is missing or the call fails
- **pdf-parse** for resume text extraction
- **Recharts** for the dashboard trend chart
- Native **Web Speech API** for voice-to-text answers and text-to-speech questions (Chrome-based browsers)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run seed            # populates a broad question bank across all tracks
npm run dev
```

Open http://localhost:3000, sign up, and start an interview.

### Environment variables

See [`.env.example`](./.env.example). At minimum you need `MONGO_URI` and `JWT_SECRET`.
Without `GEMINI_API_KEY`, answers are still saved but evaluation shows an
"AI temporarily unavailable" state instead of a fabricated score.

### Creating an admin account

Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before running `npm run seed` — it will
create (or promote) that account to `role: "admin"`, unlocking `/admin` for curating
the question bank.

## Project structure

```
app/
  (marketing)/            landing page
  (auth)/login, signup/   auth screens
  (app)/                  authenticated app (middleware-protected)
    setup/                pick a track + difficulty, optional resume upload
    interview/[id]/       live Q&A flow
    results/[id]/         session summary
    dashboard/            history + trend chart
    admin/                question bank CRUD (admin role only)
    settings/             change password
  api/                    route handlers (auth, interview, resume, admin)
components/               ui primitives + feature components
lib/                      db, auth/session, zod validators, gemini client
models/                   Mongoose schemas
middleware.ts             route-level auth guard
scripts/seed.ts           question bank + optional admin seed
legacy/                   the original Express + vanilla-JS prototype
```

## Verifying changes

```bash
npm run typecheck
npm run lint
npm run build
```

## Notes on what changed from the prototype

- AI evaluation is now actually wired up (the old repo had a hardcoded mock score).
- Auth uses email + hashed password + expiring JWT in an httpOnly cookie, not a
  username-only account with a non-expiring token in a custom header.
- The admin panel is real — the old one called an endpoint that didn't exist.
- Resumes are parsed and summarized by Gemini, not just stored as a file.
- Every write route validates input with Zod.
