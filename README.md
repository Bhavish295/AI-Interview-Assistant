# Interview Portal

Practice job interviews in the browser: pick a topic, answer out loud or by typing,
and get a score plus short tips. This is a rewrite of the original Express + vanilla-JS
prototype (kept in [`legacy/`](./legacy) for reference).

## Stack

- **Next.js 15** (App Router) + **TypeScript** — UI and API in one app
- **Tailwind CSS** — dark navy + cyan “interview portal” look (see [`DESIGN.md`](./DESIGN.md))
- **MongoDB + Mongoose** (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- **JWT sessions in httpOnly cookies** (not localStorage), **Zod** on write APIs
- **Google Gemini** (`@google/genai`) for scoring answers and summarizing resumes. If the key is missing, answers still save; scoring shows that AI is unavailable
- **pdf-parse** for resume PDFs
- **Recharts** for the results trend chart
- Native **Web Speech API** for voice answers and spoken questions (Chrome works best)

## Getting started

```bash
npm install
cp .env.example .env
```

On Windows PowerShell you can use `copy .env.example .env` instead of `cp`.

Fill in `.env` (`MONGO_URI`, `JWT_SECRET`; `GEMINI_API_KEY` is optional), then:

```bash
npm run seed
npm run dev
```

Open http://localhost:3000 — you should see **Popular Interviews** cards. Sign up, then start an interview.

Use **Software Engineering + Easy** if you want a guaranteed question set after seeding.

### Environment variables

See [`.env.example`](./.env.example). You need at least:

| Variable | What it is |
|----------|------------|
| `MONGO_URI` | Atlas `mongodb+srv://...` or local `mongodb://127.0.0.1:27017/interview-assistant` |
| `JWT_SECRET` | A long random string you create (not downloaded) |
| `GEMINI_API_KEY` | From [Google AI Studio](https://aistudio.google.com/apikey). Optional |

If a database password contains `@`, encode it as `%40` in `MONGO_URI`.

### Admin account (optional)

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, then run `npm run seed` again. That user can open `/admin` to add or delete questions.

## What you can practice

Questions are stored by **track** (not “category”) and **difficulty** (`Easy`, `Medium`, `Hard`):

- Software Engineering
- Data Structures & Algorithms
- System Design
- Product & Business
- Data Science
- Behavioral / HR

`npm run seed` loads 30 questions across those tracks. **Custom Role** is listed in code but is not seeded — the home page does not offer it.

## Project structure

```
app/
  page.tsx                landing (Popular Interviews, About, Features)
  (auth)/login, signup/   auth screens
  (app)/                  signed-in app (middleware-protected)
    setup/                topic, difficulty, optional resume
    interview/[id]/       live Q&A
    results/[id]/         session summary
    dashboard/            history + trend chart
    admin/                question bank (admin only)
    settings/             change password
  api/                    auth, interview, resume, admin
components/
  brand/                  Interview Portal logo
  marketing/              landing nav, cards, footer
  app/                    setup, interview, dashboard
  auth/                   login/signup shell
lib/                      db, auth, validators, Gemini, tracks
models/                   User, Question, Result
middleware.ts             auth guard for app routes
instrumentation.ts        warms the MongoDB connection on server start
scripts/seed.ts           question bank + optional admin
legacy/                   original prototype
```

Put secrets only in the **root** `.env` (next to `package.json`). Ignore `.env.example` and any leftover `backend/.env`.

## Verifying changes

```bash
npm run typecheck
npm run lint
npm run build
```

## Notes vs the original prototype

- Gemini scoring is wired up (the old app used a fake score).
- Auth is email + hashed password + an expiring JWT cookie, not a username-only token in a header.
- `/admin` is a real question-bank editor.
- Resumes are parsed and summarized, not only stored as files.
- Writes are validated with Zod.
- The UI is a dark **Interview Portal** (topic cards, cyan CTAs), not the old studio / “On Air” look.
