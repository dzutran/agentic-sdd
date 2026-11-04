# 📐 Engineering & Agentic-SDD Standards — `{{PROJECT_NAME}}` (Web Frontend Preset)

> **Framework:** `Agentic-SDD v1.0.0` (Spec-Driven Development for Autonomous Agentic Teams)  
> **Project:** `{{PROJECT_NAME}}`  
> **Tech Stack:** `{{TECH_STACK}}`  
> **Build Command:** `{{BUILD_COMMAND}}` | **Test Command:** `{{TEST_COMMAND}}`

---

## 1. 🏛️ Multi-Agent Operating Model (4-Role SOP Lifecycle)

All engineering work in `{{PROJECT_NAME}}` follows the strict 4-Role Spec-Driven lifecycle defined in `.agent-roles/`:

1. **Role 00 — Master Orchestrator (`.agent-roles/00-orchestrator.md`):** Routes user requests, enforces RBAC tool whitelisting, and manages the Autonomous Self-Healing Loop (max 3 iterations).
2. **Role 01 — System Architect & Planner (`.agent-roles/01-planner.md`):** Probes edge cases (Step 0 Clarifications) and authors specs in `tracking/plan/<FEATURE>_PLAN.md`. **Read-only on `src/`.**
3. **Role 02 — Software Engineer / Developer (`.agent-roles/02-developer.md`):** Implements code strictly within the approved `Impacted Files`, runs `{{BUILD_COMMAND}}`, and ticks `- [x]` items.
4. **Role 03 — QA & Verification Engineer (`.agent-roles/03-tester.md`):** Audits functional boundaries, 4 viewports, and accessibility; publishes reports in `tracking/report/`. **Read-only on `src/`.**
5. **Role 04 — Tech Lead Gatekeeper (`.agent-roles/04-reviewer.md`):** Audits `git diff`, signs off releases in `tracking/report/`, moves completed plans to `tracking/done/`, and updates `tracking/log/CHANGELOG.md`.

---

## 2. 📱 Four Standard Responsive Viewports

Every page, modal, and interactive component must render cleanly without horizontal overflow (`overflow-x: hidden`) or button text wrapping (`whitespace-nowrap shrink-0`) across 4 viewports:

1. **Mobile (`430 x 932 px` — iPhone Pro Max):** Single/2-column layout, minimum `44px–48px` touch targets, `16px` (`text-base`) form inputs to prevent iOS Safari auto-zoom.
2. **Tablet Portrait (`768 x 1024 px` — iPad Mini):** Collapsible drawer or compact navigation, 2–3 column balanced grid.
3. **Tablet Landscape / Compact Laptop (`1024 x 1366 px` — iPad Pro):** 3–4 column grid, clean sidebar/filter layout.
4. **Desktop (`1440 x 900 px` & `1920 x 1080 px`):** Centered `max-w-7xl` container, full navigation bar, 60 FPS interactive hover states.

---

## 3. ⚡ Core Web Vitals, Accessibility & Web Interface Guidelines

1. **Zero Catch-All Transitions:**
   - Never use generic catch-all transition classes on DOM elements. Always specify exact properties: `transition-colors duration-150`, `transition-transform duration-200`, or `transition-[opacity,transform] duration-200`.
2. **Typographic Standards:**
   - Always use the Unicode ellipsis `…` (`&hellip;`) for loading states and truncated labels (`Loading…`, `Searching…`).
   - Apply `font-variant-numeric: tabular-nums` (`tabular-nums`) on prices, counters, and data tables to prevent layout jitter.
3. **Zero Layout Shift (CLS = 0.000):**
   - Every `<img>` and `<svg>` must declare explicit `width` and `height` attributes.
   - Use `loading="eager" fetchpriority="high"` exclusively on the single First-Fold LCP hero image; apply `loading="lazy" decoding="async"` to all below-the-fold media.
4. **WCAG 2.2 AA Accessibility (100/100 Target):**
   - Maintain text contrast ratio $\ge 4.5:1$.
   - Add `overscroll-contain` to all modals, drawers, and scrollable popups.
   - Include `autocomplete` attributes on standard form fields and explicit `aria-label` on icon-only buttons.

---

## 4. 📂 Persistent Markdown State (`tracking/`)

- `tracking/plan/`: Active technical specifications (`_TEMPLATE.md`).
- `tracking/report/`: QA audit reports (`_TEMPLATE.md`) and Gatekeeper sign-offs (`_GATEKEEPING_TEMPLATE.md`).
- `tracking/task/DAILY_TASKS.md`: Live sprint board (`[Completed Today]`, `[In Progress]`, `[Next Up]`).
- `tracking/log/`: Daily engineering logs (`YYYY-MM-DD.md`) and `CHANGELOG.md`.
- `tracking/done/`: Archived specifications approved by Role 04.
