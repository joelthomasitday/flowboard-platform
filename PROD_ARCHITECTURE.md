# FlowBoard: Production-Ready SaaS Backend Architecture

This document outlines the transition of FlowBoard from a high-fidelity simulator to a scalable, production-ready AI-first SaaS platform.

## PART 1 — Backend Architecture Design

### Technology Stack

- **API Framework**: Next.js API Routes (Edge Runtime for AI/Auth, Node.js for heavy DB ops).
- **Database**: PostgreSQL (Managed via Supabase or AWS RDS).
- **ORM**: Prisma for type-safe database access.
- **Cache/Real-time**: Redis (Upstash) for presence and rate-limiting.
- **Messaging**: WebSockets (Pusher or Supabase Realtime).

### ER Diagram & Schema Design

#### Table Relationships

- **User**: Core identity. `User 1:N Membership`.
- **Workspace**: Root tenant unit. `Workspace 1:N Membership`, `Workspace 1:N Project`.
- **Membership**: Links Users to Workspaces with specific `Role` IDs.
- **Role & Permission**: Granular RBAC (Owner, Admin, Member, Guest).
- **Project**: Nested under Workspace. `Project 1:N Task`.
- **Task**: The core work unit. Linked to `User` (Assignee) and `Activity Logs`.
- **ActivityLog**: Immutable audit trail for all workspace actions.
- **AIUsage**: Tracking `tokensUsed`, `modelName`, and `purpose` per Workspace.
- **Billing**: Linked to Workspace. Tracks `stripeId`, `planType`, and `status`.

#### Text-based ER Visualization

```
[User] 1 --- N [Membership] N --- 1 [Workspace]
                                        |
      +---------------------------------+---------------------------------+
      |                                 |                                 |
[Projects] 1---N [Tasks]          [AIUsage]                         [Billing]
      |                                 |                                 |
[ActivityLogs] <-----------------------+-------------------------- [AutomationRules]
```

#### Multi-tenant Isolation Logic

- **Row-Level Security (RLS)**: Every table (except `User`) contains a `workspaceId`.
- **Query Filtering**: All Prisma queries _must_ include the `workspaceId` context, extracted from the session.
- **Schema Separation**: For extreme isolation, use Citus (Postgres extension) or logical database per tenant (high cost).

#### Indexing Strategy

- `workspaceId` on all multi-tenant tables.
- `userId` on `Membership` and `ActivityLogs`.
- `projectId` on `Tasks`.
- Composite index on `(workspaceId, createdAt)` for performance in activity feeds.

---

## PART 2 — Authentication & Security

### Auth Architecture

- **JWT-based Auth**: Using `next-auth` (Auth.js v5) with PostgreSQL adapter.
- **Session Handling**: Database-backed sessions for easy revocation; JWT for Edge-side performance.

### Security Implementation

- **Role Enforcement Middleware**:
  ```typescript
  // Example Middleware Logic
  async function checkPermission(req, requiredRole) {
    const session = await getSession(req);
    const userRole = await db.membership.findFirst({
      where: { userId: session.user.id, workspaceId: req.workspaceId },
    });
    if (userRole.level < requiredRole.level) throw new Error("Unauthorized");
  }
  ```
- **Workspace Isolation Guard**: Middleware that validates the requested `workspaceId` against the user's active memberships before any data is returned.
- **API Rate Limiting**: Redis-based sliding window algorithm (upstash/ratelimit) per `userId`.

### Security Hardening Checklist

- [ ] Implement CSRF protection.
- [ ] Set `Strict-Transport-Security` headers.
- [ ] Use `zod` for strict input validation on all API routes.
- [ ] Database Connection Pooling via Prisma Accelerate or Supabase Pooling.
- [ ] Rotate JWT secrets every 30 days.

---

## PART 3 — AI Integration Layer

### LLM Orchestration

- **Provider**: OpenAI (GPT-4o) + Anthropic (Claude 3.5 Sonnet) via a unified `AIService`.
- **Token Tracking**: Middleware that intercepts AI calls and updates `AIUsage` table in real-time.
- **Usage Limits**: Soft and Hard limits per workspace plan (e.g., Free: 100k tokens/mo, Pro: 5M).

### Optimization Strategies

- **Prompt Versioning**: Store prompts in code or a CMS (Edge Config) to iterate without redeploying.
- **Response Caching**: Redis cache for non-deterministic but repetitive queries (e.g., "Analyze this project structure").
- **Streaming**: SSR (Server-Sent Events) for real-time AI response generation in the UI.

---

## PART 4 — Real-Time System

### WebSocket Architecture

- **Event Structure**:
  ```json
  {
    "event": "task:updated",
    "data": { "taskId": "123", "status": "done" },
    "workspaceId": "ws_1"
  }
  ```
- **Presence Channel**: Tracks active users in a workspace via `presence:workspace_id`.
- **Activity Broadcast**: Every DB mutation triggers a broadcast to the specific workspace channel.

### Reliability

- **Event Queue**: BullMQ (with Redis) for background processing of heavy events (AI rescheduling).
- **Fallback**: 30s polling logic if WebSocket connection is lost.

---

## PART 5 — Deployment Architecture

### Strategy: The "Modern SaaS Stack"

- **Frontend/Backend**: Vercel (Edge Functions enabled).
- **Database**: Supabase (PostgreSQL + Auth + RLS).
- **Cache**: Upstash (Serverless Redis).
- **CI/CD**: GitHub Actions (Lint -> Test -> Preview -> Prod).

### Monitoring & Logging

- **Logging**: Axiom or BetterStack for structured log aggregation.
- **Error Tracking**: Sentry (Client + Server side).
- **Analytics**: PostHog for feature tracking and session recording.

### Cost Estimation (Initial Phase)

- **Database**: $25/mo (Supabase Pro).
- **Compute**: $20/mo (Vercel Pro).
- **AI**: $0.01 - $0.10 per 1k tokens (Usage-based).
- **Redis**: $0 (Upstash Free Tier -> $28 Pro).

---

## Scalability Roadmap

1.  **Phase 1 (Month 1)**: Core migrations, Auth integration, RLS implementation.
2.  **Phase 2 (Month 2)**: Real-time presence, AI usage tracking, Billing (Stripe).
3.  **Phase 3 (Month 3)**: Infrastructure hardening, Geo-distributed DB read-replicas.

---

**Blueprint Signed By:**
_Antigravity — Senior Backend Architect & SaaS Infrastructure Engineer_
