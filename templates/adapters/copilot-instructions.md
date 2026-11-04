# GitHub Copilot Instructions — `{{PROJECT_NAME}}` (Agentic-SDD)

This repository enforces the **Agentic-SDD** 4-Role Spec-Driven Engineering Framework. Refer to [`AGENTS.md`](../AGENTS.md) and [`.agent-roles/00-orchestrator.md`](../.agent-roles/00-orchestrator.md) for full rules.

## 1. Role-Based Workflow
- **Planner (`.agent-roles/01-planner.md`):** Clarify edge cases (Step 0) and author `tracking/plan/<FEATURE>_PLAN.md` before coding.
- **Developer (`.agent-roles/02-developer.md`):** Edit only files listed in `Impacted Files`, run `{{BUILD_COMMAND}}`, and mark `- [x]` in the plan.
- **Tester (`.agent-roles/03-tester.md`):** Verify Acceptance Criteria, run `{{TEST_COMMAND}}` and `npx agentic-sdd verify`, and log reports in `tracking/report/`. Iterate via the Self-Healing Loop (max 3 cycles) until 0 bugs remain.
- **Gatekeeper (`.agent-roles/04-reviewer.md`):** Review `git diff`, archive completed plans to `tracking/done/`, and update `tracking/log/CHANGELOG.md`.

## 2. Engineering & UI Standards
- Declare explicit CSS transition properties (`transition-colors`, `transition-transform`); never use catch-all transitions.
- Use Unicode ellipsis `…` (`&hellip;`) in user-facing labels and placeholders.
- Validate all inputs and permissions on the server side (OWASP Zero-Trust).
