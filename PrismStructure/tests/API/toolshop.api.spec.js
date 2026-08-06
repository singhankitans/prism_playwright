const { test, expect } = require("@playwright/test");
const { ApiClient } = require("../../API/utilities/apiClient");
const { buildUniqueUser, billingAddress } = require("../../commonUtils/testDataFactory");

test.describe("Toolshop API – Smoke", () => {
  test("API-01 Register a new user @smoke", async ({ request }) => {
    const api = new ApiClient(request);
    const user = buildUniqueUser("api.reg");
    const response = await api.register(user);
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.email).toBe(user.email);
    expect(body.id).toBeTruthy();
  });

  test("API-02 Login returns bearer token @smoke", async ({ request }) => {
    const api = new ApiClient(request);
    const user = buildUniqueUser("api.login");
    expect((await api.register(user)).status()).toBe(201);
    const response = await api.login(user.email, user.password);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.access_token).toBeTruthy();
    expect(body.token_type).toBe("bearer");
  });

  test("API-03 Create a new cart @smoke", async ({ request }) => {
    const api = new ApiClient(request);
    const response = await api.createCart();
    expect([200, 201]).toContain(response.status());
    const body = await response.json();
    expect(body.id).toBeTruthy();
  });
});

test.describe("Toolshop API – Regression", () => {
  test("API-04 Add product to cart and verify contents @regression", async ({ request }) => {
    const api = new ApiClient(request);
    const user = buildUniqueUser("api.cart");
    expect((await api.register(user)).status()).toBe(201);
    expect((await api.login(user.email, user.password)).ok()).toBeTruthy();

    const product = await api.firstInStockProduct();
    expect(product?.id).toBeTruthy();

    const cartRes = await api.createCart();
    const cartId = (await cartRes.json()).id;
    const addRes = await api.addToCart(cartId, product.id, 2);
    expect(addRes.status()).toBe(200);
    expect((await addRes.json()).result).toMatch(/item added/i);

    const cart = await (await api.getCart(cartId)).json();
    expect(cart.cart_items.length).toBeGreaterThan(0);
    expect(cart.cart_items[0].product_id).toBe(product.id);
    expect(cart.cart_items[0].quantity).toBe(2);
  });

  test("API-05 Generate COD invoice for cart @regression", async ({ request }) => {
    const api = new ApiClient(request);
    const user = buildUniqueUser("api.inv");
    expect((await api.register(user)).status()).toBe(201);
    expect((await api.login(user.email, user.password)).ok()).toBeTruthy();

    const product = await api.firstInStockProduct();
    const cartId = (await (await api.createCart()).json()).id;
    expect((await api.addToCart(cartId, product.id, 1)).status()).toBe(200);

    const invoiceRes = await api.createInvoice({ ...billingAddress, cart_id: cartId });
    expect(invoiceRes.status()).toBe(201);
    const invoice = await invoiceRes.json();
    expect(invoice.invoice_number).toMatch(/^INV-/);
    expect(invoice.billing_country).toBe("TG");
  });

  test("API-06 List invoices contains newly created invoice @regression", async ({ request }) => {
    const api = new ApiClient(request);
    const user = buildUniqueUser("api.list");
    expect((await api.register(user)).status()).toBe(201);
    expect((await api.login(user.email, user.password)).ok()).toBeTruthy();

    const product = await api.firstInStockProduct();
    const cartId = (await (await api.createCart()).json()).id;
    await api.addToCart(cartId, product.id, 1);
    const created = await (await api.createInvoice({ ...billingAddress, cart_id: cartId })).json();

    const listRes = await api.listInvoices(1);
    expect(listRes.status()).toBe(200);
    const list = await listRes.json();
    const found = (list.data || []).some((i) => i.invoice_number === created.invoice_number);
    expect(found).toBeTruthy();
  });

  test("API-07 Invalid login and unauthorized invoice creation @regression", async ({
    request,
  }) => {
    const api = new ApiClient(request);
    const badLogin = await api.login("nouser@example.com", "BadPass1!");
    expect(badLogin.status()).toBe(401);

    const unauth = new ApiClient(request);
    const cartId = (await (await unauth.createCart()).json()).id;
    const product = await unauth.firstInStockProduct();
    await unauth.addToCart(cartId, product.id, 1);
    const invoiceRes = await unauth.createInvoice({ ...billingAddress, cart_id: cartId });
    expect(invoiceRes.status()).toBe(401);
  });
});
