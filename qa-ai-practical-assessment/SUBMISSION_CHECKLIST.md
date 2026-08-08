# Submission Checklist — qa-ai-practical-assessment

Re-checked against the Part B brief.

## Required folder structure

```text
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── PrismStructure/                 # Playwright UI + API + execution reports
├── project-info.md
├── readme.md
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
├── .cursor/
│   ├── rules/
│   └── skills/
```

| Item | Status |
|------|--------|
| `FunctionalTestCase.csv` (manual suite) | Present — 8 cases (Smoke/Regression) |
| `PrismStructure` UI automation | Present — 6 tests `@smoke`/`@regression` |
| `PrismStructure` API automation | Present — 7 tests `@smoke`/`@regression` |
| Execution reports | `execution-reports/EXECUTION_SUMMARY.md` + `results.json` (13 Passed) |
| `project-info.md` | Present — AC/risks/tools/AI workflow |
| `readme.md` | Present — setup + smoke/regression commands |
| `ai-prompts/*` (5 files) | Present |
| `.cursor/rules` + `.cursor/skills` | Present |
| Confirm-twice invoice behavior | Documented + automated in UI-06 |
| Public git URL | Repo + PR available |

## Common QA requirements map

1. Requirement and risk analysis → `project-info.md`
2. Project info (UI/API, positive/negative, smoke/regression) → `project-info.md`
3. Manual test suite → `FunctionalTestCase.csv`
4. UI automation smoke + E2E/regression → `PrismStructure/tests/UI`
5. API automation lifecycle → `PrismStructure/tests/API`
6. Test data strategy → `project-info.md` + `ai-prompts/test-data.md` + `testDataFactory.js`
7. Execution evidence → `PrismStructure/execution-reports/`
8. README setup/execution → `readme.md`
9. Full prompt history → `ai-prompts/`
10. Planning/design/debug artifacts → folder structure above

## How to re-verify automation

```bash
cd qa-ai-practical-assessment/PrismStructure
npm install
npx playwright install chromium
npm test
npm run test:smoke
npm run test:regression
```
