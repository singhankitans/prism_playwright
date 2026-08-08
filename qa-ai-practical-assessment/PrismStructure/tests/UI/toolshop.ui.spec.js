const { test, expect } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const { buildUniqueUser } = require("../../commonUtils/testDataFactory");
const { ApiClient } = require("../../API/utilities/apiClient");

test.describe("Toolshop UI – Smoke", () => {
  test("UI-01 Home page lists products @smoke", async ({ page }) => {
    const po = new POManager(page);
    await po.homePage.goto();
    await expect(po.homePage.productCards.first()).toBeVisible();
    expect(await po.homePage.productCards.count()).toBeGreaterThan(0);
  });

  test("UI-02 Register a new customer @smoke", async ({ page }) => {
    const po = new POManager(page);
    const user = buildUniqueUser("ui.reg");
    await po.registerPage.goto();
    await po.registerPage.register(user);
    await expect(page).toHaveURL(/auth\/login|account/);
  });

  test("UI-03 Login with valid credentials @smoke", async ({ page, request }) => {
    const user = buildUniqueUser("ui.login");
    const api = new ApiClient(request);
    expect((await api.register(user)).status()).toBe(201);

    const po = new POManager(page);
    await po.loginPage.goto();
    await po.loginPage.login(user.email, user.password);
    await expect(page.getByTestId("nav-menu")).toBeVisible();
  });
});

test.describe("Toolshop UI – Regression", () => {
  test("UI-04 Invalid login shows an error @regression", async ({ page }) => {
    const po = new POManager(page);
    await po.loginPage.goto();
    await po.loginPage.login("invalid.user@example.com", "WrongPass1!");
    await expect(page.getByText(/invalid|incorrect|unauthorized|failed/i)).toBeVisible();
  });

  test("UI-05 Add in-stock product and update quantity in cart @regression", async ({
    page,
    request,
  }) => {
    const user = buildUniqueUser("ui.cart");
    const api = new ApiClient(request);
    expect((await api.register(user)).status()).toBe(201);
    const product = await api.firstInStockProduct();

    const po = new POManager(page);
    await po.loginPage.goto();
    await po.loginPage.login(user.email, user.password);
    await po.homePage.goto();
    await po.homePage.openProductById(product.id);
    await po.productPage.setQuantity(2);
    await po.productPage.addCurrentProductToCart();
    await expect(po.productPage.cartBadge).toContainText("2");
    await po.checkoutPage.openCart();
    await expect(page.getByTestId("product-title")).toContainText(product.name);
  });

  test("UI-06 E2E checkout COD with double confirm and invoice @regression", async ({
    page,
    request,
  }) => {
    const user = buildUniqueUser("ui.e2e");
    const api = new ApiClient(request);
    expect((await api.register(user)).status()).toBe(201);
    const product = await api.firstInStockProduct();

    const po = new POManager(page);
    await po.loginPage.goto();
    await po.loginPage.login(user.email, user.password);
    await po.homePage.goto();
    await po.homePage.openProductById(product.id);
    await po.productPage.setQuantity(2);
    await po.productPage.addCurrentProductToCart();
    await po.checkoutPage.openCart();
    await po.checkoutPage.proceedSignedInCheckout();
    await po.checkoutPage.fillBillingAddress(user.address);
    await po.checkoutPage.payCashOnDeliveryWithDoubleConfirm();
    await expect(page.getByText(/Thanks for your order! Your invoice number is INV-/i)).toBeVisible();

    const invoiceText = await page.locator("body").innerText();
    const match = invoiceText.match(/INV-\d+/);
    expect(match).toBeTruthy();

    await po.accountPage.openMyInvoices();
    await expect(page.getByText(match[0])).toBeVisible();
  });
});
