# AI Prompts – Test Data

## Entry 1 — Unique user factory
- **Prompt:** Generate safe unique registration payloads that satisfy Toolshop password rules (avoid leaked common passwords).
- **AI Response Summary:** Suggested timestamp emails + strong mixed password; DOB adult range; address object.
- **Validation Notes:** `Welcome01!` rejected (leaked). Final: `Sup3rSecur3!Qa#2026` + `mailinator.com` emails.

## Entry 2 — Invoice billing payload
- **Prompt:** Validate assignment invoice JSON (`TG`, `Hesselbury`, `1234AA`, COD) against API.
- **AI Response Summary:** Confirmed sample is accepted; other country/city combos often 422.
- **Validation Notes:** Live POST `/invoices` returned 201 with `INV-*`. Reused in UI billing step + API tests.

## Entry 3 — Product selection
- **Prompt:** How should automation pick products so add-to-cart does not fail on out-of-stock items?
- **AI Response Summary:** Query products and select first `in_stock: true`.
- **Validation Notes:** Implemented in `ApiClient.firstInStockProduct()`; UI opens that product by `data-test`.
