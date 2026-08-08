# Execution Evidence — Screenshots

Generated from a full green run (**13 passed / 0 failed**).

## UI screenshots

| Test | File |
|------|------|
| UI-01 Home page lists products | [UI/UI_01_Home_page_lists_products_passed.png](./UI/UI_01_Home_page_lists_products_passed.png) |
| UI-02 Register a new customer | [UI/UI_02_Register_a_new_customer_passed.png](./UI/UI_02_Register_a_new_customer_passed.png) |
| UI-03 Login with valid credentials | [UI/UI_03_Login_with_valid_credentials_passed.png](./UI/UI_03_Login_with_valid_credentials_passed.png) |
| UI-04 Invalid login shows an error | [UI/UI_04_Invalid_login_shows_an_error_passed.png](./UI/UI_04_Invalid_login_shows_an_error_passed.png) |
| UI-05 Add product / update quantity | [UI/UI_05_Add_in_stock_product_and_update_quantity_in_cart_passed.png](./UI/UI_05_Add_in_stock_product_and_update_quantity_in_cart_passed.png) |
| UI-06 E2E COD checkout + invoice | [UI/UI_06_E2E_checkout_COD_with_double_confirm_and_invoice_passed.png](./UI/UI_06_E2E_checkout_COD_with_double_confirm_and_invoice_passed.png) |

## API screenshots

API cases render a pass card (tokens redacted) and capture it as PNG.

| Test | File |
|------|------|
| API-01 Register | [API/API_01_Register_a_new_user_passed.png](./API/API_01_Register_a_new_user_passed.png) |
| API-02 Login token | [API/API_02_Login_returns_bearer_token_passed.png](./API/API_02_Login_returns_bearer_token_passed.png) |
| API-03 Create cart | [API/API_03_Create_a_new_cart_passed.png](./API/API_03_Create_a_new_cart_passed.png) |
| API-04 Add to cart | [API/API_04_Add_product_to_cart_and_verify_contents_passed.png](./API/API_04_Add_product_to_cart_and_verify_contents_passed.png) |
| API-05 COD invoice | [API/API_05_Generate_COD_invoice_for_cart_passed.png](./API/API_05_Generate_COD_invoice_for_cart_passed.png) |
| API-06 List invoices | [API/API_06_List_invoices_contains_newly_created_invoice_passed.png](./API/API_06_List_invoices_contains_newly_created_invoice_passed.png) |
| API-07 Negative auth | [API/API_07_Invalid_login_and_unauthorized_invoice_creation_passed.png](./API/API_07_Invalid_login_and_unauthorized_invoice_creation_passed.png) |

## How to regenerate

```bash
cd qa-ai-practical-assessment/PrismStructure
npm test
```

Screenshots are written to this folder on every passed run.
