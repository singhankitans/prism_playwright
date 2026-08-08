const { chromium } = require("@playwright/test");

async function collectValidationText(page) {
  const texts = await page.evaluate(() => {
    const nodes = [
      ...document.querySelectorAll(
        ".invalid-feedback, .alert, .alert-danger, .text-danger, [class*='error']"
      ),
    ];
    return nodes
      .map((n) => (n.innerText || n.textContent || "").trim())
      .filter(Boolean)
      .slice(0, 20);
  });
  return [...new Set(texts)];
}

async function dumpAddressFields(page) {
  return page.evaluate(() => {
    const keys = [
      "country",
      "postal_code",
      "house_number",
      "street",
      "city",
      "state",
      "proceed-3",
    ];
    const out = {};
    for (const k of keys) {
      const el = document.querySelector(`[data-test="${k}"]`);
      if (!el) {
        out[k] = null;
        continue;
      }
      out[k] = {
        tag: el.tagName,
        value: el.value ?? null,
        disabled: !!el.disabled,
        text: (el.innerText || "").trim().slice(0, 80),
      };
    }
    return out;
  });
}

async function fillAddress(page, addr) {
  console.log("trying address", addr.label);

  const country = page.locator('[data-test="country"]');
  if (await country.count()) {
    await country.selectOption(addr.country);
    await country.blur();
    await page.waitForTimeout(300);
  }

  const postal = page.locator('[data-test="postal_code"]');
  if (await postal.count()) {
    await postal.fill("");
    await postal.fill(addr.postal_code);
    await postal.press("Tab");
    await page.waitForTimeout(300);
  }

  const house = page.locator('[data-test="house_number"]');
  if (await house.count()) {
    await house.fill("");
    await house.fill(addr.house_number || "12");
    await house.press("Tab");
    await page.waitForTimeout(300);
  }

  for (const [key, value] of [
    ["street", addr.street],
    ["city", addr.city],
    ["state", addr.state],
  ]) {
    const loc = page.locator(`[data-test="${key}"]`);
    if (await loc.count()) {
      await loc.fill("");
      await loc.fill(value);
      await loc.press("Tab");
      await page.waitForTimeout(200);
    }
  }

  for (const key of ["postal_code", "house_number", "street", "city", "state", "country"]) {
    const loc = page.locator(`[data-test="${key}"]`);
    if (await loc.count()) {
      try {
        await loc.blur();
      } catch (_) {}
    }
  }
  await page.keyboard.press("Tab");
  await page.waitForTimeout(800);

  const fields = await dumpAddressFields(page);
  console.log("address fields after fill", JSON.stringify(fields, null, 2));
  console.log("validation texts", await collectValidationText(page));

  const proceed3 = page.locator('[data-test="proceed-3"]');
  if (!(await proceed3.count())) {
    console.log("proceed-3 missing");
    return false;
  }

  try {
    await page.waitForFunction(
      () => {
        const btn = document.querySelector('[data-test="proceed-3"]');
        return btn && !btn.disabled;
      },
      { timeout: 10000 }
    );
    console.log("proceed-3 enabled: true");
    await proceed3.click();
    await page.waitForTimeout(1500);
    return true;
  } catch (e) {
    console.log("proceed-3 enabled: false");
    console.log("proceed-3 wait error", e.message);
    console.log("validation texts after wait", await collectValidationText(page));
    console.log(
      "address fields after wait",
      JSON.stringify(await dumpAddressFields(page), null, 2)
    );
    return false;
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const email = `qa.ui.${Date.now()}@mailinator.com`;
  const pass = "Sup3rSecur3!Qa#2026";

  let invoiceFromNet = null;
  page.on("response", async (res) => {
    try {
      const url = res.url();
      if (url.includes("/payment/check") || url.includes("/invoices")) {
        const text = await res.text();
        console.log("NET", res.status(), url, text.slice(0, 280));
        if (url.includes("/invoices") && res.status() === 201) {
          const m = text.match(/INV-[\w-]+/);
          if (m) invoiceFromNet = m[0];
        }
      }
    } catch (_) {}
  });

  const reg = await fetch("https://api.practicesoftwaretesting.com/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: "Qa",
      last_name: "Ui",
      dob: "1990-01-01",
      address: {
        street: "Zoey Shore",
        city: "Hesselbury",
        state: "Florida",
        country: "TG",
        postal_code: "1234AA",
      },
      phone: "5551234567",
      email,
      password: pass,
    }),
  });
  console.log("register", reg.status, email);

  await page.goto("https://practicesoftwaretesting.com/auth/login", {
    waitUntil: "domcontentloaded",
  });
  await page.locator('[data-test="email"]').fill(email);
  await page.locator('[data-test="password"]').fill(pass);
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForTimeout(2000);
  console.log("after login", page.url());

  const prods = await (
    await fetch("https://api.practicesoftwaretesting.com/products?page=1")
  ).json();
  const inStock = prods.data.find((p) => p.in_stock);
  console.log("using", inStock.name, inStock.id);

  await page.goto("https://practicesoftwaretesting.com/", {
    waitUntil: "domcontentloaded",
  });
  await page.locator(`[data-test="product-${inStock.id}"]`).click();
  await page.waitForTimeout(1000);
  await page.locator('[data-test="increase-quantity"]').click();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.waitForTimeout(1000);
  await page.locator('[data-test="nav-cart"]').click();
  await page.waitForTimeout(1500);
  console.log(
    "cart tests",
    await page
      .locator("[data-test]")
      .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("data-test")))])
  );

  await page.locator('[data-test="proceed-1"]').click();
  await page.waitForTimeout(1000);
  if (await page.locator('[data-test="proceed-2"]').count()) {
    await page.locator('[data-test="proceed-2"]').click();
    await page.waitForTimeout(1500);
  }

  console.log("prefilled address", JSON.stringify(await dumpAddressFields(page), null, 2));

  const attempts = [
    {
      label: "TG assignment example",
      country: "TG",
      postal_code: "1234AA",
      house_number: "12",
      street: "Zoey Shore",
      city: "Hesselbury",
      state: "Florida",
    },
    {
      label: "NL Amsterdam",
      country: "NL",
      postal_code: "1012AB",
      house_number: "1",
      street: "Damrak 1",
      city: "Amsterdam",
      state: "NH",
    },
    {
      label: "US Austin",
      country: "US",
      postal_code: "78701",
      house_number: "100",
      street: "Congress Ave",
      city: "Austin",
      state: "Texas",
    },
  ];

  let advanced = false;
  for (const addr of attempts) {
    advanced = await fillAddress(page, addr);
    if (advanced) break;
    console.log("retrying next address attempt...");
  }

  if (!advanced) {
    console.log("FAILED to enable/click proceed-3");
    console.log("body snippet", (await page.locator("body").innerText()).slice(0, 800));
    await browser.close();
    process.exit(1);
  }

  console.log(
    "payment tests",
    await page
      .locator("[data-test]")
      .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("data-test")))])
  );

  await page.locator('[data-test="payment-method"]').selectOption("cash-on-delivery");
  await page.waitForTimeout(500);
  console.log("selected cash-on-delivery");

  const finish = page.locator('[data-test="finish"]');
  console.log("finish count", await finish.count());

  console.log("finish click 1");
  await finish.click();
  await page
    .locator('[data-test="payment-success-message"]')
    .waitFor({ state: "visible", timeout: 15000 })
    .catch(() => {});
  const success1 = await page
    .locator('[data-test="payment-success-message"]')
    .innerText()
    .catch(() => null);
  console.log("after finish1 success message", success1);
  console.log("after finish1 body", (await page.locator("body").innerText()).slice(0, 500));

  console.log("finish click 2");
  const invoiceRespPromise = page.waitForResponse(
    (r) => r.url().includes("/invoices") && r.request().method() === "POST",
    { timeout: 20000 }
  );
  await finish.click();
  let invoiceBody = null;
  try {
    const invoiceResp = await invoiceRespPromise;
    invoiceBody = await invoiceResp.text();
    console.log("invoice POST status", invoiceResp.status());
    console.log("invoice POST body", invoiceBody.slice(0, 500));
  } catch (e) {
    console.log("invoice POST wait error", e.message);
  }
  await page.waitForTimeout(1500);

  console.log("done url", page.url());
  const bodyText = await page.locator("body").innerText();
  console.log("body after finish2", bodyText.slice(0, 1000));
  const invoiceMatch =
    (invoiceBody && invoiceBody.match(/INV-[\w-]+/)) ||
    bodyText.match(/INV-[\w-]+/) ||
    (invoiceFromNet && [invoiceFromNet]);
  console.log("invoice number", invoiceMatch && invoiceMatch[0]);
  console.log(
    "payment-success-message present?",
    await page.locator('[data-test="payment-success-message"]').count()
  );

  if (await page.locator('[data-test="nav-menu"]').count()) {
    await page.locator('[data-test="nav-menu"]').click();
    await page.waitForTimeout(500);
  }
  if (await page.locator('[data-test="nav-my-invoices"]').count()) {
    await page.locator('[data-test="nav-my-invoices"]').click();
    await page.waitForTimeout(2500);
    console.log("invoices url", page.url());
    console.log("invoices body", (await page.locator("body").innerText()).slice(0, 1000));
    const table = page.locator("table");
    if (await table.count()) {
      console.log("invoice table", (await table.first().innerText()).slice(0, 800));
    }
  }

  await browser.close();
  console.log("PROBE OK");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
