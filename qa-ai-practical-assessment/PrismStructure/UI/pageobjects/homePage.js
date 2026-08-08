class HomePage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('[data-test^="product-"]:not([data-test="product-name"]):not([data-test="product-price"])');
    this.searchInput = page.getByTestId("search-query");
    this.searchSubmit = page.getByTestId("search-submit");
    this.navSignIn = page.getByTestId("nav-sign-in");
    this.navCart = page.getByTestId("nav-cart");
  }

  async goto() {
    await this.page.goto("/");
    await this.productCards.first().waitFor({ state: "visible" });
  }

  async openProductById(productId) {
    await this.page.getByTestId(`product-${productId}`).click();
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchSubmit.click();
  }
}

module.exports = { HomePage };
