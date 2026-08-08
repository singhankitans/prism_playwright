# AI Prompts – Automation and Debugging

## Entry 1 — Framework shape
- **Prompt:** Fit Toolshop into PrismStructure (POManager, API utilities, shared data) without new frameworks.
- **AI Response Summary:** Suggested page objects for home/login/register/product/checkout/account + ApiClient.
- **Debugging Outcome:** Implemented as designed; kept workers=1 for shared demo stability.

## Entry 2 — `getByTestId` mismatch
- **Prompt:** Locators with getByTestId cannot find `register-link` though data-test exists.
- **AI Response Summary:** Playwright defaults to `data-testid`; set `testIdAttribute: 'data-test'`.
- **Debugging Outcome:** Fixed in `playwright.config.js`; probe then found forms.

## Entry 3 — Disabled proceed-3
- **Prompt:** Analyze failure: proceed-3 resolved but not enabled during checkout.
- **AI Response Summary:** Address incomplete; check house_number and validation messages.
- **Debugging Outcome:** Filling `house_number=12` enabled button; encoded in `CheckoutPage.fillBillingAddress`.

## Entry 4 — Double confirm semantics
- **Prompt:** Network shows payment success after first Confirm but no invoice — explain.
- **AI Response Summary:** First Confirm hits payment check; second Confirm posts `/invoices`.
- **Debugging Outcome:** Automated two clicks; assert `Thanks for your order! ... INV-` then My Invoices.
