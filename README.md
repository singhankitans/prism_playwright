# QA AI Practical Assessment — Toolshop

AI-assisted QA delivery for **Practice Software Testing Toolshop** (UI + API), built with a **Prism-style Playwright** framework.

## Project Information

| Item | Value |
|------|--------|
| Framework | Playwright (JavaScript) – PrismStructure Page Objects + API client |
| UI SUT | https://practicesoftwaretesting.com/ |
| API SUT | https://api.practicesoftwaretesting.com |
| Manual cases | `FunctionalTestCase.csv` |
| Automation | `PrismStructure/` |
| AI prompt history | `ai-prompts/` |
| Reports | `PrismStructure/execution-reports/` |

## Prerequisites

1. Node.js 18+
2. npm
3. From `PrismStructure/`:
   ```bash
   npm install
   npx playwright install chromium
   ```

Environment defaults are in `PrismStructure/.env` (public demo URLs only — no secrets).

## How to Run Automation

All commands run from **`PrismStructure/`**:

```bash
cd PrismStructure
npm install
npx playwright install chromium

# All tests
npm test

# Smoke only
npm run test:smoke

# Regression only
npm run test:regression

# UI only / API only
npm run test:ui
npm run test:api
```

### Important UI note

On checkout payment step, click **Confirm twice**:
1. First confirm → payment success  
2. Second confirm → invoice `INV-*` created  

Automation encodes this in `CheckoutPage.payCashOnDeliveryWithDoubleConfirm()`.

## Test Data

- Factory: `PrismStructure/commonUtils/testDataFactory.js`
- Unique email per run; strong password; TG billing sample from assignment
- Products: first `in_stock` item from `GET /products`

## Manual Tests

Open `FunctionalTestCase.csv` (Excel/Google Sheets). Execute Smoke rows for build confidence; Regression for release depth. Update `Status` column after execution.

## Reports / Evidence

After a run:

- HTML: `PrismStructure/execution-reports/html/index.html` → `npm run report`
- JSON: `PrismStructure/execution-reports/results.json`
- Failures retain screenshots/traces under `PrismStructure/test-results/`

## Cursor Rules

Project rules for AI-assisted QA live under `.cursor/rules/` (if present). Prefer `data-test` locators and iterative prompting documented in `ai-prompts/`.
