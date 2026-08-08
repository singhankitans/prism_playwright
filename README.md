# prism_playwright

Public submission repo for the **QA AI Practical Assessment**.

## Assessment package

All required artifacts live under:

**[`qa-ai-practical-assessment/`](./qa-ai-practical-assessment/)**

```text
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── PrismStructure/          # Playwright UI + API + execution reports
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
└── scripts/                 # exploratory probe helpers
```

### Quick start

```bash
cd qa-ai-practical-assessment/PrismStructure
npm install
npx playwright install chromium
npm test
```

See [`qa-ai-practical-assessment/readme.md`](./qa-ai-practical-assessment/readme.md) for smoke/regression commands and report locations.
