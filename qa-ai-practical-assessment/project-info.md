# Project Info — QA AI Practical Assessment (Part B)

**Primary AI Tool(s) Used:** Cursor (Grok) + Playwright tooling  
**Application Under Test:** Practice Software Testing Toolshop – Checkout & Invoice Flow  
**UI:** https://practicesoftwaretesting.com/  
**API:** https://api.practicesoftwaretesting.com  
**Assessment Start Date:** 2026-08-06  
**Submission Date:** 2026-08-06  

## Project Summary

This assessment validates the Toolshop ecommerce lifecycle for a **new customer**: registration/login, product selection, cart quantity updates, Cash-on-Delivery checkout, and invoice verification. A critical UI quirk is documented and automated: **Confirm must be pressed twice** (payment success, then invoice creation). Coverage is intentionally focused (5–8 cases per tier) across manual, UI, and API with `@smoke` / `@regression` tagging.

## Requirement and Risk Analysis

| Area | Risk | Mitigation |
|------|------|------------|
| Auth | Weak/invalid credentials; password complexity / leaked-password rules | Positive + negative login/register cases; unique strong passwords |
| Catalog | Out-of-stock products still visible | Prefer `in_stock=true` via API for purchase paths |
| Address validation | `proceed-3` stays disabled without house number / invalid country-postal combo | Use known-valid TG billing sample; fill house number |
| Payment / Invoice | Single Confirm only shows payment success — invoice needs second Confirm | Explicit double-confirm in manual + UI automation |
| API auth | Invoice creation without bearer token | Negative unauthorized invoice case |
| Data isolation | Shared public demo env | Unique emails per run (`timestamp@mailinator.com`) |

### Traceability (AC → Tests)

| Acceptance Criteria | Manual | UI | API |
|---------------------|--------|----|-----|
| AC1 Registration & Login + profile | M-01, M-02, M-03, M-07 | UI-02, UI-03, UI-04 | API-01, API-02, API-07 |
| AC2 Purchase / cart / COD invoice | M-04, M-05, M-06, M-08 | UI-01, UI-05, UI-06 | API-03–API-06 |

## Tools Used

- Browsers: Chromium (Playwright)
- Automation: Playwright Prism-style Page Objects (`PrismStructure/`)
- API: Playwright `APIRequestContext` + Toolshop REST API
- AI: Cursor for analysis, design, coding, debugging
- Supporting: dotenv, HTML/JSON Playwright reports

## Setup Summary — AI-Assisted QA Workflow

1. **Project/SUT context to AI** — Provide URLs, AC wording, double-confirm note, repo conventions (`data-test` locators, Page Objects), and constraints (5–8 cases/tier).
2. **Requirement analysis** — Ambiguities (house number, stock, address country rules) extracted before scripting.
3. **Test planning** — UI for journeys/UX; API for auth/cart/invoice lifecycle speed; Smoke vs Regression tags.
4. **Manual design** — Functional, negative, edge, E2E cases in `FunctionalTestCase.csv`.
5. **Automation design** — PrismStructure POM + `ApiClient` + shared `testDataFactory`.
6. **Validate AI output** — Probe script confirmed selectors and double-confirm; tests executed; failures fixed (house_number).
7. **Test data** — AI-assisted unique users; assignment TG billing payload; in-stock product discovery via API.
8. **Debugging** — Traces/logs for disabled `proceed-3`; network shows `/payment/check` then `/invoices`.
9. **Avoid sharing** — No real PII, no production secrets, no live bearer tokens in prompts/docs.
10. **Reuse** — Same prompt → plan → curated cases → thin automation → evidence loop on future apps.

## Suite Map

| Tier | Count | Tags | Location |
|------|-------|------|----------|
| Manual | 8 | Smoke / Regression | `FunctionalTestCase.csv` |
| UI automation | 6 | `@smoke` / `@regression` | `PrismStructure/tests/UI` |
| API automation | 7 | `@smoke` / `@regression` | `PrismStructure/tests/API` |

## Repository Layout

Assessment package root: **`qa-ai-practical-assessment/`**

```text
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── PrismStructure/          # UI + API Playwright + execution-reports
├── project-info.md
├── readme.md
├── SUBMISSION_CHECKLIST.md
├── ai-prompts/
├── .cursor/rules/
└── .cursor/skills/
```

See `readme.md` for setup/execution. Prompt history lives in `ai-prompts/`. Cursor guidance in `.cursor/rules/`. Checklist: `SUBMISSION_CHECKLIST.md`.
