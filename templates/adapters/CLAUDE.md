# 👑 Claude Code Instructions — `{{PROJECT_NAME}}` (Agentic-SDD Framework)

This repository is powered by **Agentic-SDD** (*Spec-Driven Development for Autonomous Agentic Teams*).

## 📚 Single Source of Truth
- **Project Engineering Standards:** [`AGENTS.md`](./AGENTS.md)
- **Master Orchestrator & Intent Dispatcher:** [`.agent-roles/00-orchestrator.md`](./.agent-roles/00-orchestrator.md)
- **Role 01 (Planner):** [`.agent-roles/01-planner.md`](./.agent-roles/01-planner.md)
- **Role 02 (Developer):** [`.agent-roles/02-developer.md`](./.agent-roles/02-developer.md)
- **Role 03 (QA Tester):** [`.agent-roles/03-tester.md`](./.agent-roles/03-tester.md)
- **Role 04 (Tech Lead Gatekeeper):** [`.agent-roles/04-reviewer.md`](./.agent-roles/04-reviewer.md)

## 🛠️ Core Commands
- **Build:** `{{BUILD_COMMAND}}`
- **Test:** `{{TEST_COMMAND}}`
- **Health Check:** `npx agentic-sdd doctor`
- **Standards Audit:** `npx agentic-sdd verify`

## 🔄 Mandatory Workflow Rules
1. **Step 0 Clarifications & Spec-First:** Before writing code for any new feature, follow `.agent-roles/01-planner.md` to clarify edge cases and create `tracking/plan/<FEATURE>_PLAN.md`.
2. **Zero Scope Drift:** As Role 02 (Developer), only modify files listed in the Plan's `Impacted Files` table and tick `- [x]` upon completion.
3. **Autonomous Self-Healing Loop:** As Role 03 (Tester), verify all Acceptance Criteria and document findings in `tracking/report/`. Automatically iterate between Developer and Tester (up to 3 cycles) until 100% PASS.
4. **Exclusive Gatekeeper Sign-Off:** Only Role 04 (Tech Lead) may move completed plans from `tracking/plan/` to `tracking/done/` and update `tracking/log/CHANGELOG.md`.
