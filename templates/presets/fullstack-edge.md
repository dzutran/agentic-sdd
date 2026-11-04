# 📐 Engineering & Agentic-SDD Standards — `{{PROJECT_NAME}}` (Fullstack & Edge Preset)

> **Framework:** `Agentic-SDD v1.0.0` (Spec-Driven Development for Autonomous Agentic Teams)  
> **Project:** `{{PROJECT_NAME}}`  
> **Tech Stack:** `{{TECH_STACK}}`  
> **Build Command:** `{{BUILD_COMMAND}}` | **Test Command:** `{{TEST_COMMAND}}`

---

## 1. 🏛️ Multi-Agent Operating Model (4-Role SOP Lifecycle)

All engineering work in `{{PROJECT_NAME}}` is governed by the 4-Role Spec-Driven lifecycle in `.agent-roles/`:

1. **Role 00 — Master Orchestrator (`.agent-roles/00-orchestrator.md`):** Dispatches tasks, enforces strict RBAC tool whitelisting, and coordinates the Autonomous Self-Healing Loop (max 3 iterations).
2. **Role 01 — System Architect & Planner (`.agent-roles/01-planner.md`):** Clarifies edge cases (Step 0) and writes `tracking/plan/<FEATURE>_PLAN.md`. **Read-only on `src/`.**
3. **Role 02 — Software Engineer / Developer (`.agent-roles/02-developer.md`):** Implements frontend/backend code within `Impacted Files`, verifies `{{BUILD_COMMAND}}`, and updates `- [x]` checklists.
4. **Role 03 — QA & Verification Engineer (`.agent-roles/03-tester.md`):** Tests API contracts, edge cases, and 4 responsive viewports; writes `tracking/report/<REPORT>.md`. **Read-only on `src/`.**
5. **Role 04 — Tech Lead Gatekeeper (`.agent-roles/04-reviewer.md`):** Audits `git diff`, signs off releases, archives plans to `tracking/done/`, and updates `tracking/log/CHANGELOG.md`.

---

## 2. 🛡️ Fullstack & Edge Serverless Architecture Rules

1. **Zero-Trust Server-Side Validation (OWASP):**
   - Never trust client-supplied prices, discounts, user roles, or tenant IDs. Always recompute totals and authorize permissions on the server/edge runtime.
   - Enforce rate limiting, bot verification (e.g., Turnstile/CAPTCHA), and parameterized database queries / Row-Level Security (RLS).
2. **Edge Runtime Performance & Caching:**
   - Keep edge bundles lightweight: lazy-load heavy SDKs via dynamic `import()` only when needed.
   - Normalize URL paths (handle trailing slashes consistently across frontend links and API routers).
   - Bypass CDN cache for `/api/*` and authenticated routes while caching immutable static assets (`/_astro/*`, `/_next/static/*`, `/assets/*`) with long TTLs.
3. **Resilient Error Handling:**
   - Wrap all external I/O (database queries, third-party webhooks, AI inference calls) in `try/catch` blocks with structured error responses and graceful fallbacks.

---

## 3. 📱 Responsive Viewports & Web Interface Guidelines

1. **4 Standard Viewports:** Mobile (`430px`), Tablet Portrait (`768px`), Tablet Landscape (`1024px`), and Desktop (`1440px+`).
2. **Explicit 60 FPS Animations:** Never use generic catch-all transition classes; declare explicit properties (`transition-colors duration-150`, `transition-transform duration-200`).
3. **Typographic & Input Hygiene:** Use Unicode ellipsis `…` (`&hellip;`), `tabular-nums` for numbers, `overscroll-contain` on modals, `whitespace-nowrap shrink-0` on action buttons, and `16px` (`text-base`) mobile inputs.

---

## 4. 📂 Persistent Markdown State (`tracking/`)

- `tracking/plan/`: Active specifications (`_TEMPLATE.md`).
- `tracking/report/`: QA audit reports (`_TEMPLATE.md`) and Gatekeeper sign-offs (`_GATEKEEPING_TEMPLATE.md`).
- `tracking/task/DAILY_TASKS.md`: Sprint tracking board.
- `tracking/log/`: Daily engineering logs and `CHANGELOG.md`.
- `tracking/done/`: Completed and archived specifications.
