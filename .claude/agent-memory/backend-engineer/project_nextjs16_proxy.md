---
name: project-nextjs16-proxy
description: Why WorkGuard AI uses proxy.ts (not middleware.ts) and other Next.js 16 gotchas that shaped the backend
metadata:
  type: project
---

WorkGuard AI runs on Next.js 16.2.9. Middleware protection is implemented in `proxy.ts` at the repo root, NOT `middleware.ts`.

**Why:** In Next.js 16 the `middleware` file convention is deprecated and renamed to `proxy` (it also now defaults to the Node.js runtime). CLAUDE.md's folder list still says `middleware.ts`, but AGENTS.md mandates heeding deprecation notices. Per Next.js guidance, `proxy.ts` does only coarse gating + correlation-id/security headers; authoritative authorization is enforced in every route handler via `withAuthedRoute` + RBAC (`lib/auth/authorization.ts`).

**How to apply:** Do NOT "fix" `proxy.ts` back to `middleware.ts` — that would reintroduce deprecation warnings. Other Next.js 16 facts used here: route `context.params` is a `Promise` (must be awaited); `cookies()` from `next/headers` is async. Prisma migrations were generated via `prisma migrate diff` (fallback) and need a live `DATABASE_URL` to apply — see [[project-provisioning-state]].
