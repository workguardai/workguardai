<div align="center">

# 🏗️ WorkGuard AI

### See real progress on every construction site.

**WorkGuard AI turns your construction drawings into a live model of the site, then tracks actual progress against plan — automatically. It catches delays before they cost you.**
 
_From groundwork to dashboard._

[![Made with Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2d3748)](https://www.prisma.io)
[![AI](https://img.shields.io/badge/AI-Google_Gemini-e0531e)](https://ai.google.dev)

</div>

---

## The problem

Construction is one of the largest industries on earth, and it still runs million-euro projects on **spreadsheets, phone calls, and site visits**. Managers lose hours chasing updates that are stale the moment they arrive, and small slips go unseen until they turn into expensive delays.

> **77%** of projects face costly delays · **€3.3M** lost every day globally · **80%** of sites run below plan

## The solution

Upload a drawing once. WorkGuard AI does the rest:

1. **Reads the plan** — parses zones, dimensions, and milestones from your DWG.
2. **Models the site** — builds a live digital twin of what should get built.
3. **Tracks against plan** — compares real progress to expected, continuously.
4. **Flags what matters** — surfaces delays, deviations, and risk in one dashboard.

No manual data entry. No status meetings. No guesswork.

---

## ✨ What's inside

| | |
|---|---|
| 📐 **DWG plan parsing** | Upload any plan file; the AI reads it mathematically. |
| 📊 **Real-time progress tracking** | Live comparison of actual vs. planned, per site. |
| 🔔 **Smart AI alerts** | Delay prediction, deviation detection, risk scoring — with confidence. |
| 🗂️ **Multi-site dashboard** | Every project in one always-current view. |
| 📡 **IoT connectivity** _(coming soon)_ | Sensors and cameras feeding the same dashboard. |
| 🔐 **Enterprise auth & RBAC** | Email + Google sign-in, roles, audit logging. |

---

## 🧱 Tech stack

A single **Next.js** application — no separate backend.

- **Framework:** Next.js 16 (App Router) · React 19 · **strict** TypeScript
- **Backend:** Next.js Route Handlers · **Zod**-validated request/response on every endpoint
- **Database:** PostgreSQL + **Prisma**
- **Auth:** Supabase Auth (JWT, secure cookies, refresh) + capability-based RBAC
- **AI:** Google Gemini via a reusable wrapper (retries, backoff, JSON enforcement, cost/token hooks)
- **State / data:** Redux Toolkit + RTK Query (native `fetch`)
- **UI:** Tailwind v4 design-token system · Motion · self-hosted fonts

---

## 🚀 Getting started

```bash
# 1. Install (Prisma client is generated automatically)
npm install

# 2. Configure your environment
cp .env.example .env.local   # then fill in real values (see below)

# 3. Set up the database (once you have a real DATABASE_URL)
npx prisma migrate deploy

# 4. Run it
npm run dev                  # http://localhost:3000
```

### Environment

| Variable | What it is |
|---|---|
| `DATABASE_URL` | PostgreSQL connection (Supabase pooled string) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `JWT_SECRET` | ≥16-char random string |
| `UPLOAD_BUCKET` | Supabase Storage bucket name |

### 🧪 Try it without any credentials

No Supabase project yet? Set `AUTH_MODE="dev"` in `.env` and sign in with the built-in test account:

```
dev@workguard.local  /  devpassword
```

The dev bypass **turns itself off automatically** the moment a real Supabase URL is present — so production is always Supabase-only.

---

## 📜 Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server (regenerates Prisma client first) |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest suite |

---

## 💶 Pricing

| Pilot | Pro | Enterprise |
|---|---|---|
| **Free** | **€550/mo** | **Custom** |
| One site, dashboard, basic alerts, personal onboarding | Unlimited sites, full AI monitoring, delay prediction, priority support | IoT bundle, integrations, dedicated manager, SLA |

---

## 🗺️ Status

Working MVP, first pilot underway with **ANK Construction**. Backed by LUT University, Helsinki incubators, and Interreg EU. Selected by the Cities of Helsinki, Espoo & Vantaa; winner of the Sisu Factory pitch.

**Next:** commercial rollout across Finland, then the IoT connectivity layer.

---

<div align="center">

**AI monitoring for smarter site management.** Dream, innovate, thrive.

Founded by Endrit Kola · Helsinki, Finland · [ek@workguardai.com](mailto:ek@workguardai.com)

[Website](https://workguardai.com) · [LinkedIn](https://www.linkedin.com/company/workguardai) · [Instagram](https://www.instagram.com/workguardai/)

</div>
