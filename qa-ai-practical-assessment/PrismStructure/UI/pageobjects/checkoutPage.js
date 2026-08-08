class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.proceed1 = page.getByTestId("proceed-1");
    this.proceed2 = page.getByTestId("proceed-2");
    this.proceed3 = page.getByTestId("proceed-3");
    this.country = page.getByTestId("country");
    this.postalCode = page.getByTestId("postal_code");
    this.houseNumber = page.getByTestId("house_number");
    this.street = page.getByTestId("street");
    this.city = page.getByTestId("city");
    this.state = page.getByTestId("state");
    this.paymentMethod = page.getByTestId("payment-method");
    this.finish = page.getByTestId("finish");
    this.paymentSuccess = page.getByTestId("payment-success-message");
  }

  async openCart() {
    await this.page.getByTestId("nav-cart").click();
    await this.proceed1.waitFor({ state: "visible" });
  }

  async proceedSignedInCheckout() {
    await this.proceed1.click();
    await this.proceed2.waitFor({ state: "visible" });
    await this.proceed2.click();
  }

  async fillBillingAddress(address) {
    await this.country.selectOption(address.country);
    await this.postalCode.fill(address.postal_code);
    await this.houseNumber.fill(address.house_number || "12");
    await this.street.fill(address.street);
    await this.city.fill(address.city);
    await this.state.fill(address.state);
    await this.houseNumber.blur();
    await this.proceed3.waitFor({ state: "visible" });
    await this.page.waitForFunction(() => {
      const btn = document.querySelector('[data-test="proceed-3"]');
      return btn && !btn.disabled;
    });
    await this.proceed3.click();
  }

  async payCashOnDeliveryWithDoubleConfirm() {
    await this.paymentMethod.selectOption("cash-on-delivery");
    await this.finish.click();
    await this.paymentSuccess.waitFor({ state: "visible" });
    await this.finish.click();
  }
}

module.exports = { CheckoutPage };
