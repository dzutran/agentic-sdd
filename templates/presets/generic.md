# 📐 Engineering & Agentic-SDD Standards — `{{PROJECT_NAME}}` (Generic / Universal Preset)

> **Framework:** `Agentic-SDD v1.0.0` (Spec-Driven Development for Autonomous Agentic Teams)  
> **Project:** `{{PROJECT_NAME}}`  
> **Tech Stack:** `{{TECH_STACK}}`  
> **Build Command:** `{{BUILD_COMMAND}}` | **Test Command:** `{{TEST_COMMAND}}`

---

## 1. 🏛️ Multi-Agent Operating Model (4-Role SOP Lifecycle)

All development in `{{PROJECT_NAME}}` follows the disciplined 4-Role Spec-Driven workflow defined in `.agent-roles/`:

1. **Role 00 — Master Orchestrator (`.agent-roles/00-orchestrator.md`):** Dispatches user intents, enforces RBAC tool whitelisting, and coordinates the Autonomous Self-Healing Loop (max 3 iterations).
2. **Role 01 — System Architect & Planner (`.agent-roles/01-planner.md`):** Clarifies ambiguous requirements (Step 0) and creates `tracking/plan/<FEATURE>_PLAN.md`. **Read-only on production code.**
3. **Role 02 — Software Engineer / Developer (`.agent-roles/02-developer.md`):** Implements changes strictly within the approved `Impacted Files`, runs `{{BUILD_COMMAND}}` & `{{TEST_COMMAND}}`, and updates `- [x]` items.
4. **Role 03 — QA & Verification Engineer (`.agent-roles/03-tester.md`):** Verifies acceptance criteria and boundary conditions; publishes `tracking/report/<REPORT>.md`. **Read-only on production code.**
5. **Role 04 — Tech Lead Gatekeeper (`.agent-roles/04-reviewer.md`):** Audits `git diff`, signs off releases, moves completed plans to `tracking/done/`, and updates `tracking/log/CHANGELOG.md`.

---

## 2. 🛠️ Core Software Engineering Principles

1. **Spec-First, Code-Second:**
   - Never implement complex features or architectural changes without an approved specification in `tracking/plan/`.
2. **Zero Scope Drift:**
   - Modify only the files explicitly listed in the Plan's `Impacted Files` table. Unrelated refactoring must be proposed as a separate task.
3. **Defensive Coding & Error Handling:**
   - Handle boundary conditions, null/empty inputs, and external failures gracefully with clear error messages.
   - Never hardcode secrets, credentials, or environment-specific keys in tracked source files.
4. **Automated Verification:**
   - Every change must pass `{{BUILD_COMMAND}}`, `{{TEST_COMMAND}}`, and `npx agentic-sdd verify` before completion.

---

## 3. 📂 Persistent Markdown State (`tracking/`)

- `tracking/plan/`: Active specifications (`_TEMPLATE.md`).
- `tracking/report/`: QA audit reports (`_TEMPLATE.md`) and Gatekeeper sign-offs (`_GATEKEEPING_TEMPLATE.md`).
- `tracking/task/DAILY_TASKS.md`: Daily task board (`[Completed Today]`, `[In Progress]`, `[Next Up]`).
- `tracking/log/`: Daily logs (`YYYY-MM-DD.md`) and `CHANGELOG.md`.
- `tracking/done/`: Archived specifications approved by Role 04.
