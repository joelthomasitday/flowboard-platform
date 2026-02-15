# FlowBoard Production Readiness & Deployment Guide

This document outlines the architecture, deployment strategy, and launch checklist for the FlowBoard production environment.

## 1. Production Architecture Diagram

```text
[ Users ]
    |
    v (HTTPS / WebSockets)
[ Vercel Edge / Node.js ] <---> [ Upstash Redis ] (Rate Limiting & Cache)
    |          |
    |          +--------------> [ Sentry ] (Monitoring)
    |          |
    |          +--------------> [ Axiom/Pino ] (Logs)
    v          v
[ Supabase ] [ OpenAI / Anthropic ]
(Postgres)     (AI Orchestration)
    ^
    |
[ Stripe ] (Webhooks & Billing)
```

## 2. Infrastructure Stack

- **Frontend/API**: Vercel (Production & Preview branches)
- **Database**: Supabase PostgreSQL (with PITR - Point In Time Recovery enabled)
- **Cache & Rate Limit**: Upstash Redis (Global replication)
- **Observability**:
  - **Errors**: Sentry
  - **Logs**: Pino + Axiom
  - **Metrics**: PostHog (Product analytics)
- **Payments**: Stripe Production Mode

## 3. Environment Variable Strategy

### Required Production Secrets

| Variable                   | Description                   | Source   |
| -------------------------- | ----------------------------- | -------- |
| `DATABASE_URL`             | Transaction Mode URL          | Supabase |
| `DIRECT_URL`               | Session Mode URL (Migrations) | Supabase |
| `STRIPE_SECRET_KEY`        | Live Secret Key               | Stripe   |
| `STRIPE_WEBHOOK_SECRET`    | Live Webhook Secret           | Stripe   |
| `UPSTASH_REDIS_REST_URL`   | Production Redis URL          | Upstash  |
| `UPSTASH_REDIS_REST_TOKEN` | Production Redis Token        | Upstash  |
| `NEXT_PUBLIC_SENTRY_DSN`   | Sentry Project DSN            | Sentry   |
| `OPENAI_API_KEY`           | Live AI Key                   | OpenAI   |

## 4. CI/CD & Migration Strategy

### Pipeline (GitHub Actions)

1. **Lint & Test**: Run `next lint` and `vitest`.
2. **Build**: Run `next build` to verify types and build integrity.
3. **Database Migration**:
   - Use `npx prisma migrate deploy` on the production database.
   - **Rule**: Never use `migrate dev` on production.
4. **Deploy**: Vercel handles the atomic deployment.

### Rollback Strategy

- **Application**: Vercel "Rollback" feature for instant revert of the frontend/API.
- **Database**: Use Supabase snapshots or PITR if a migration was destructive (highly recommended to use non-destructive migrations only).

## 5. Launch Readiness Checklist

### ✅ Billing & Monetization

- [ ] Stripe Webhook endpoint verified in dashboard (All events active).
- [ ] Test upgrade to `Architect` plan with real card (Test Mode).
- [ ] Verify `trialEndsAt` is correctly set in Prisma upon signup.
- [ ] Verify AI token overage blocks requests on `Starter` plan.

### ✅ Security & Reliability

- [ ] Rate limits verified (Try spamming `/api/ai` endpoints).
- [ ] RBAC check: Ensure `MEMBER` cannot delete a workspace.
- [ ] Webhook replay test: Send the same checkout event twice, verify idempotency.
- [ ] Audit logs: Check if `ROLE_CHANGE` is recorded in `ActivityLog`.

### ✅ Performance

- [ ] DB Index Heatmap: Verify `@@index([workspaceId])` is hit during dashboard load.
- [ ] Cache Hit: Verify AI insights load from Redis on second request.
- [ ] Lighthouse Scores: Performance > 90, SEO > 100.

### ✅ Observability

- [ ] Sentry Test: Manually trigger an error and verify it appears in the dashboard.
- [ ] Logs: Verify `pino` structured logs are visible in Vercel log stream.

---

**Signed By:**
_Antigravity — Senior SaaS Reliability Engineer_
