# 🧠 Trajectory Bank & Incident Patterns (Institutional Memory)

> **Purpose:** Persistent memory bank of architectural traps, platform quirks, and recurring regression anti-patterns discovered during development.  
> **Mandatory Rule:** All agents MUST consult this file before proposing architectural refactoring or dead-code elimination.

---

## 🚫 1. CLI, Tooling & Shell Quirks

### 1.1. Windows PowerShell Statement Separators
- **Problem:** PowerShell does not reliably support `&&` chaining in standard installations, causing `ParserError: The token '&&' is not a valid statement separator`.
- **Solution:** Always use `;` as the statement separator, or run commands sequentially.

### 1.2. Git Index Lock in Sandboxed Environments
- **Problem:** Concurrent or interrupted commands may leave `.git/index.lock` behind, causing `fatal: Unable to create '.git/index.lock': Permission denied`.
- **Solution:** Verify and remove stale `.git/index.lock` before executing automated git operations, and run unsandboxed git write operations when required.

---

## 🛡️ 2. Architectural & Dead-Code Elimination Traps

### 2.1. The "Clean Dispatcher" Route Dropping Trap (CRITICAL)
- **Problem:** When refactoring a monolithic router (e.g. reducing a 4,000-line worker into modular routers), background or async endpoints (such as cron triggers, webhooks, or internal SSR fallbacks) can be mistakenly deleted as "dead code" because they lack storefront UI call sites.
- **Solution:**
  1. **Route Inventory Parity Check:** Before deleting any legacy handler, author a 1-to-1 table of all active routes.
  2. **Automated Route Contract Tests:** Every endpoint invoked by a cron job or webhook MUST have an automated test asserting it returns a valid response (non-404).

### 2.2. Zero-Trust Server Price Recalculation
- **Problem:** Relying on client-submitted order totals allows price tampering and coupon fraud.
- **Solution:** The server MUST re-calculate subtotal, discounts, shipping fees, and final totals using the canonical database catalog as the single source of truth.

---

## 🔒 3. Security, Privacy & Search Engine Hygiene

### 3.1. API & Admin Route Crawl Prevention
- **Problem:** Search engine crawlers (Googlebot, GPTBot, Perplexity) may crawl and index `/api/` or `/admin/` endpoints if not explicitly blocked.
- **Solution:** Always disallow `/api/` and `/admin/` in `robots.txt` and attach `X-Robots-Tag: noindex, nofollow, noarchive` to all API responses.

### 3.2. PII Protection (GDPR / Privacy Compliance)
- **Problem:** Public tracking or lookup endpoints exposing raw customer phone numbers, full names, or home addresses.
- **Solution:** Implement rate limiting (max 5 failed attempts/15 min) + 2-factor verification (e.g., last 4 phone digits) + one-way masking (`T***`, `090***123`, `Khu vực Phường X, Quận Y`).

### 3.3. Zero Secret Leaks in Client Bundles
- **Problem:** Accidentally importing server-side service keys into frontend components bundles secrets into production static assets.
- **Solution:** Use separate service layers. Never reference `SERVICE_ROLE`, `RESEND_API_KEY`, or `ADMIN_PASSWORD` in files built by Vite/Rollup for the browser.
