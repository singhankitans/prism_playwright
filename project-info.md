# Project Info — AI Workflow Foundation (QA)

## 1. What is this project all about?

**Prism Playwright** is an end-to-end automation framework for validating a web application (system/district management portal) across **UI** and **API** layers.

It is built with **Playwright (JavaScript/Node.js)** and follows a layered structure:

| Layer | Purpose |
|--------|---------|
| `UI/pageobjects` | Locators and page actions (Page Object Model via `POManager`) |
| `UI/utilities` & `commonUtils` | Shared web helpers, logging, DB access, mocks |
| `UI/resources/data` | Login data, system JSON, Xray test-case metadata |
| `API/pageobjects` | Endpoints, headers, and request bodies |
| `API/utilities` | HTTP helpers (GET/POST/PUT/PATCH/DELETE), dynamic data, Excel I/O, CURL logging, response storage |
| `API/testdata` | Common status expectations, tokens, payloads, response fixtures |
| `tests/UI Test` & `tests/API Test` | Spec files with assertions and tags (`@sanity`, `@regression`) |
| `playwright.config.js` | Projects, browsers, timeouts, screenshots, video, traces |
| CI (`Jenkinsfile-UI-Automation`) | Environment-specific runs (QA/UAT), artifact handling, Xray reporting |

**Business coverage today includes:**

- Internal user login (positive and negative paths)
- System creation
- District creation
- PDF content verification
- API auth (access token) and home/API flows

**Quality goals:** maintainable Page Objects, reusable API utilities, environment-driven config (`.env`), traceability to test management (Xray IDs in `testCasesMeta.json`), and CI-ready regression execution (`npm run test:regression`).

This document describes how AI is used as a **partner in the QA process** — for analysis, planning, design, debugging, and refinement — not as a one-click “generate tests” shortcut.

---

## 2. Primary AI tool(s) used

| Tool | Role in the workflow |
|------|----------------------|
| **Cursor** (primary) | In-repo context: explore structure, draft/refine page objects & specs, debug failures against real files, suggest utilities that match existing patterns |
| **ChatGPT / Claude** (secondary) | Requirement brainstorming, risk questions, alternative test ideas, payload/schema reasoning when repo context is not required |
| **Playwright tooling** (codegen, UI mode, traces) | Ground-truth capture of locators and runtime behavior; AI helps interpret and harden what codegen produces |

**Principle:** Prefer Cursor when the answer depends on *this* codebase. Prefer a general LLM when the question is about product risk, strategy, or domain edge cases before code exists.

---

## 3. How project and system-under-test (SUT) context is provided to the tool

AI quality depends on **context quality**. Context is supplied deliberately:

### Project / framework context
- Point the tool at `README.md`, `playwright.config.js`, `package.json`, and folder conventions (`UI/`, `API/`, `tests/`).
- Share existing patterns: Page Object Manager, `commonMethods` API helper, Winston/custom loggers, Xray annotation helpers (`utils.addTestAnnotationsByKeyword`).
- State constraints explicitly: JS (not TS) for specs, Chromium regression project, tags (`@sanity` / `@regression`), no new dependencies without justification.

### SUT context
- Feature under test (e.g., login, create system, create district).
- User roles (e.g., internal admin).
- Environment assumptions (QA vs UAT; `BASE_URL` / `URL` from `.env` — **values not pasted into chats**).
- Known integrations: auth token APIs, PDF flows, optional DB checks.
- Acceptance criteria, ticket IDs (e.g., `PA-12133`), and any open defects.

### Effective prompting pattern
1. **Goal** — what decision or artifact is needed  
2. **SUT facts** — behavior, roles, constraints  
3. **Repo facts** — where similar code lives  
4. **Non-goals** — what not to invent or change  
5. **Output format** — checklist, risk matrix, page object method, etc.

Example:

> “Given our Page Object pattern in `UI/pageobjects/loginPage.js` and login specs tagged `@sanity @regression`, propose negative validation cases for invalid email. Do not invent new locator strategies; reuse existing locators.”

---

## 4. How AI is used for requirement analysis

AI is used to **interrogate requirements**, not to blindly accept them.

### Practices
- Paste (sanitized) user stories / AC and ask for:
  - Ambiguities and missing rules
  - Implicit assumptions (session timeout, field max length, role permissions)
  - Dependencies (auth before district create; API contract vs UI label)
  - Risks and impact if wrong
- Ask for a **requirement checklist**: Given / When / Then, plus “What if…” scenarios
- Map requirements to **testable statements** and **out-of-scope** items
- Cross-check UI AC against API contracts where both exist

### Human ownership
- Product/BA confirmation for unclear rules
- Severity/priority judgment stays with QA
- AI suggestions that invent business rules are rejected unless confirmed

**Outcome:** clearer scope, earlier defect prevention, and a shared understanding of what “done” means before writing cases or automation.

---

## 5. How AI is used for test planning and strategy

AI helps structure **where and how deep** to test; QA owns the final strategy.

### Decision areas AI supports
| Dimension | How AI helps |
|-----------|----------------|
| **UI vs API** | Suggest layer: business rules → API first; UX/workflows/PDF → UI; prefer API for volume/data setup |
| **Smoke vs Sanity vs Regression** | Propose minimal smoke (login + critical navigation), sanity for build confidence, full regression for release |
| **Priority / risk** | Rank flows by user impact, change frequency, past defect density |
| **Environments** | Call out QA vs UAT differences, data isolation, feature flags |
| **Automation ROI** | Flag flaky UI candidates vs stable API candidates |

### Example strategy for this project
- **Smoke:** Login success + nav visible  
- **Sanity:** Login + create system / district happy paths  
- **Regression:** Full UI suite + API token/home flows; tagged `@regression`, run via CI  
- **API:** Auth and contract checks; reuse tokens/dynamic data for chained calls  
- **UI:** End-to-end journeys, validations, PDF verification  

AI drafts matrices and coverage gaps; QA adjusts for release risk and sprint capacity.

---

## 6. How AI is used for manual test case design

AI is prompted for **breadth and adversarial thinking**, then cases are curated.

### Coverage types requested
- **Functional** — happy paths aligned to AC (e.g., valid login → nav tabs visible)
- **Edge** — boundary lengths, whitespace, special characters, concurrent actions
- **Negative** — invalid email, wrong password, empty fields, unauthorized access (matches patterns like `verifyErrorwithInvalidEmail`)
- **Non-functional** — basic usability, responsiveness notes, timeouts, clear error messaging (not full performance suites unless scoped)

### Prompting approach
- Ask for cases in a consistent template: ID, precondition, steps, expected result, priority, type  
- Request **traceability** to requirement / ticket IDs (`PA-*`)  
- Ask “what would a malicious or confused user try?” for negative/security-minded cases  
- Ask for **exclusion list** (cases that need product confirmation or are out of scope)

### Curation rules
- Remove duplicates and fantasy features  
- Merge overlapping cases  
- Align expected results to actual UI messages/API codes  
- Keep manual depth for exploratory; automate the stable, high-value subset  

---

## 7. How AI is used for automation design

AI assists design **within existing framework conventions**.

### Framework choice
Playwright is already selected — AI is used to justify and extend usage (APIRequestContext + UI, traces, projects), not to propose a greenfield stack unless asked.

### Structure AI is guided to respect
- Page Objects + `POManager` for UI  
- `commonMethods` for HTTP verbs; store responses (`storeFullAPIResponse`); dynamic data (`createDynamicData`)  
- Externalized data (`loginData.json`, API JSON fixtures)  
- Tags and Xray metadata (`testCasesMeta.json`)  
- Logging and CURL capture for debug (`requestToCurlLogger`)  

### Typical AI asks
- “Add a page object method for X following `loginPage.js` style.”  
- “Design a data-driven approach for district creation without new libraries.”  
- “Propose reusable wait/assertion helpers that match `webUtils`.”  
- “Outline fixture flow: get token → store → call home API.”  

### What AI must not do unchecked
- Introduce new frameworks or heavy dependencies  
- Hardcode credentials or environment URLs  
- Bypass Page Objects with brittle one-off locators in specs  
- Over-abstract prematurely  

---

## 8. How AI-generated test cases and scripts are validated and refined

**AI output is a draft, never a merge-ready artifact.**

### Validation checklist
1. **Correctness** — Matches real AC and current UI/API behavior  
2. **Stability** — Locators prefer roles/labels/test-ids over fragile CSS where possible; waits are intentional  
3. **Assertions** — Meaningful (status, body fields, UI state), not only “no error”  
4. **Style** — Matches repo naming, imports, describe/test structure, tags  
5. **Isolation** — Tests don’t depend on undeclared order; shared state (`storeBrowserState.json`, tokens) is intentional and documented  
6. **Safety** — No secrets in code, logs, or committed fixtures  
7. **Execution** — Run locally (`npx playwright test`, headed/UI mode); review HTML report, screenshots, video, traces  
8. **Peer/self review** — Diff against similar specs (e.g., `01_loginPageTest.spec.js`)  

### Refinement loop
Generate → review against SUT → run → fix flaky waits/locators → tighten assertions → re-run → only then commit.

If AI invents endpoints, fields, or messages, they are verified against the app or API docs before use.

---

## 9. How AI is used for test data generation, environment assumptions, and API payloads

### Test data
- Ask AI for **schemas and varieties** of data (valid, invalid, boundary), then generate values with controlled tools (`@faker-js/faker` where already in the project) or curated JSON fixtures.  
- Prefer **deterministic** data for regression assertions; use dynamic data for uniqueness (names, emails) where the SUT requires it.  
- Keep PII synthetic; never use production customer data.

### Environment assumptions (made explicit in prompts)
- Base URLs and credentials come from `.env` / CI secrets (S3-backed env files in Jenkins) — AI only sees **placeholder names** (`BASE_URL`, `URL`).  
- Feature availability may differ QA vs UAT.  
- HTTPS quirks may exist (`ignoreHttpsErrors` in config) — called out as env-specific, not ignored blindly in analysis.

### API payloads
- Start from existing page object bodies (`API/pageobjects/loginPage`) and recorded CURL logs.  
- Ask AI to propose **variants** (missing field, wrong type, expired token) and expected status codes.  
- Validate proposals against real responses; store sanitized fixtures via project utilities when useful.  
- Never paste live access tokens or production payloads into AI chats.

---

## 10. How AI is used for debugging failing tests and interpreting logs

### Inputs shared with AI (sanitized)
- Failure message and stack from Playwright  
- Relevant snippet of the spec / page object  
- Excerpt of custom logger output  
- CURL from `api_request.log` (secrets redacted)  
- Trace/screenshot observations described in words; avoid uploading sensitive screens when possible  

### Typical debug questions
- Is this a product bug, env issue, data issue, or automation flake?  
- Locator/timing: race vs wrong selector vs app change?  
- API: wrong status expectation, schema drift, auth expiry?  
- How to harden the wait/assertion without masking a real bug?  

### Workflow
1. Reproduce locally with headed mode / trace  
2. Classify failure with AI as a **hypothesis generator**  
3. Confirm hypothesis against app or Network tab  
4. Fix product bug (ticket) or harden test intentionally  
5. Re-run to confirm; add a regression guard if needed  

AI accelerates root-cause brainstorming; **evidence from the SUT decides**.

---

## 11. What information is avoided sharing unnecessarily with AI tools

| Avoid / minimize | Why |
|------------------|-----|
| Passwords, API keys, tokens, cookies, `.env` contents | Credential leakage |
| Production PII / real customer records | Privacy & compliance |
| Full production database dumps | Data exposure |
| Internal security findings / unpatched vuln details beyond need | Risk of exposure |
| Proprietary legal/financial docs not required for the task | Need-to-know |
| Entire private codebases when a small snippet suffices | Reduce attack surface & noise |

### Safe alternatives
- Redact: `Authorization: Bearer <REDACTED>`  
- Use synthetic users and fake emails  
- Describe UI text instead of uploading screenshots with sensitive data  
- Reference file paths and patterns rather than dumping secrets from config  

Team rules and company policy always override convenience.

---

## 12. How this QA AI workflow would be reused in a real project

This workflow is **portable** as a lightweight playbook:

1. **Onboard AI to the repo** — README, architecture, Page Object / API helper conventions, CI tags.  
2. **Analyze requirements** with AI for gaps and risks; confirm with stakeholders.  
3. **Draft strategy** — layer (UI/API), suite type (smoke/sanity/regression), automation ROI.  
4. **Design manual cases** with AI for breadth; curate for truth and priority.  
5. **Automate** only stable, high-value paths using existing framework patterns.  
6. **Generate data/payloads** safely; keep secrets in env/CI.  
7. **Validate everything** by execution, traces, and review — never merge raw AI output.  
8. **Debug** with sanitized logs and clear bug-vs-flake classification.  
9. **Codify prompts** — save team prompt templates (requirement analysis, case design, page object, API negative matrix).  
10. **Retrospective** — track where AI saved time vs where it hallucinated; tighten prompts and guardrails.

### Success criteria for reuse
- Faster coverage of edge/negative ideas without losing human judgment  
- Automation that looks like the rest of the repo  
- No secrets in chats or commits  
- Clear ownership: AI proposes; QA decides; CI proves  

---

## Summary

For **Prism Playwright**, AI (primarily **Cursor**, supported by general LLMs) is embedded across the QA lifecycle: context-rich analysis, risk-based planning, thorough case design, framework-aligned automation, safe data/payload work, and evidence-based debugging. The constant is human validation against the real SUT, existing code conventions, and security hygiene — so AI amplifies quality engineering rather than replacing it.
