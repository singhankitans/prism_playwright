# AI Prompts – Test Design

## Entry 1 — Manual suite draft
- **Prompt:** Draft ≤8 manual cases for Toolshop covering functional, negative, edge, smoke, and regression mapped to AC1/AC2.
- **AI Response Summary:** Produced register/login/invalid login/browse/qty/checkout/profile/empty-cart set.
- **Validation Notes:** Kept 8 rows; verified against live UI capabilities; empty-cart retained as negative guard.

## Entry 2 — UI automation scenarios
- **Prompt:** Propose 6 Playwright UI tests using `data-test` locators and Page Objects; tag smoke vs regression.
- **AI Response Summary:** Home, register, login, invalid login, cart qty, E2E COD+invoice.
- **Validation Notes:** Matched probe selectors (`proceed-*`, `finish`, `nav-my-invoices`); rejected brittle CSS.

## Entry 3 — API lifecycle scenarios
- **Prompt:** Design API cases for register→login→cart→add product→invoice→list plus unauthorized paths.
- **AI Response Summary:** 7 cases including invalid login 401 and invoice without token 401.
- **Validation Notes:** Verified against live API (201 register, TG invoice body, in-stock product filter).
