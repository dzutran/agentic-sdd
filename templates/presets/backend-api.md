# 📐 Engineering & Agentic-SDD Standards — `{{PROJECT_NAME}}` (Backend API & Microservices Preset)

> **Framework:** `Agentic-SDD v1.0.0` (Spec-Driven Development for Autonomous Agentic Teams)  
> **Project:** `{{PROJECT_NAME}}`  
> **Tech Stack:** `{{TECH_STACK}}`  
> **Build Command:** `{{BUILD_COMMAND}}` | **Test Command:** `{{TEST_COMMAND}}`

---

## 1. 🏛️ Multi-Agent Operating Model (4-Role SOP Lifecycle)

All backend and service engineering in `{{PROJECT_NAME}}` follows the 4-Role Spec-Driven lifecycle in `.agent-roles/`:

1. **Role 00 — Master Orchestrator (`.agent-roles/00-orchestrator.md`):** Routes tasks, enforces RBAC tool whitelisting, and runs the Autonomous Self-Healing Loop (max 3 iterations).
2. **Role 01 — System Architect & Planner (`.agent-roles/01-planner.md`):** Probes API contract edge cases, data concurrency, and failure modes (Step 0) and authors `tracking/plan/<FEATURE>_PLAN.md`. **Read-only on `src/`.**
3. **Role 02 — Software Engineer / Developer (`.agent-roles/02-developer.md`):** Implements services, migrations, and unit/integration tests strictly within `Impacted Files`, runs `{{BUILD_COMMAND}}` & `{{TEST_COMMAND}}`, and ticks `- [x]`.
4. **Role 03 — QA & Verification Engineer (`.agent-roles/03-tester.md`):** Executes boundary, concurrency, security, and regression tests; publishes `tracking/report/<REPORT>.md`. **Read-only on `src/`.**
5. **Role 04 — Tech Lead Gatekeeper (`.agent-roles/04-reviewer.md`):** Reviews `git diff`, database migrations, and security posture; archives plans to `tracking/done/` and updates `tracking/log/CHANGELOG.md`.

---

## 2. 🔐 API Design, Security & Reliability Standards

1. **Strict Schema Validation & Contracts:**
   - Validate all incoming request bodies, query parameters, and headers using strict schema validators at the controller/router boundary.
   - Return consistent, structured HTTP status codes and error envelopes (`{ error: { code, message, requestId } }`).
2. **Zero-Trust Security & Data Protection (OWASP):**
   - Enforce authentication and resource-level authorization (RBAC/ABAC) on every private endpoint.
   - Use parameterized queries / prepared statements exclusively; never interpolate raw user strings into SQL/NoSQL queries.
   - Redact PII, tokens, and credentials from all application logs and error traces.
3. **Idempotency, Concurrency & Resilience:**
   - Design state-mutating endpoints (`POST`, `PUT`, `PATCH`) to handle retries safely via idempotency keys or atomic database transactions.
   - Enforce explicit timeouts, circuit breakers, and bounded retries on all outbound network calls.
4. **Database Migration Hygiene:**
   - Every schema change must be accompanied by an idempotent, backward-compatible migration script and rollback strategy.

---

## 3. 📂 Persistent Markdown State (`tracking/`)

- `tracking/plan/`: Active technical specifications (`_TEMPLATE.md`).
- `tracking/report/`: QA audit reports (`_TEMPLATE.md`) and Gatekeeper sign-offs (`_GATEKEEPING_TEMPLATE.md`).
- `tracking/task/DAILY_TASKS.md`: Sprint tracking board.
- `tracking/log/`: Daily engineering logs and `CHANGELOG.md`.
- `tracking/done/`: Completed and archived specifications.
