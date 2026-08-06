# AI Prompts – Requirements and Planning

## Entry 1 — Understand Toolshop scope
- **Prompt:** Summarize testable flows for practicesoftwaretesting.com focusing on registration, login, cart, COD checkout, and invoices. Call out risks and the “confirm twice for invoice” behavior.
- **AI Response (short summary):** Proposed AC-aligned flows; highlighted stock, address validation, auth token, and double-confirm payment→invoice transition as risks.
- **Human decision:** Limit to AC1/AC2 core; max 5–8 cases per tier; treat double-confirm as mandatory assertion.

## Entry 2 — UI vs API strategy
- **Prompt:** Recommend what belongs in UI smoke/regression vs API lifecycle for Toolshop given a Prism Playwright framework.
- **AI Response (short summary):** Smoke = home, register/login, create cart; Regression = quantity, COD invoice, negatives, invoice list. API owns fast lifecycle; UI owns double-confirm UX.
- **Human decision:** Adopted tagging `@smoke` / `@regression`; API uses Playwright request context.

## Entry 3 — Address validation risk
- **Prompt:** Why would checkout Proceed stay disabled after filling TG address from the assignment sample?
- **AI Response (short summary):** Likely incomplete address (house number) or country/postal mismatch; validate field-level enablement.
- **Human decision:** Confirmed via probe — empty `house_number` disabled `proceed-3`; added to risks and automation.
