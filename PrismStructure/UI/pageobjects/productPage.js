class ProductPage {
  constructor(page) {
    this.page = page;
    this.name = page.getByTestId("product-name");
    this.quantity = page.getByTestId("quantity");
    this.increase = page.getByTestId("increase-quantity");
    this.decrease = page.getByTestId("decrease-quantity");
    this.addToCart = page.getByTestId("add-to-cart");
    this.cartBadge = page.getByTestId("cart-quantity");
  }

  async setQuantity(target) {
    const current = Number(await this.quantity.inputValue());
    for (let i = current; i < target; i++) {
      await this.increase.click();
    }
  }

  async addCurrentProductToCart() {
    await this.addToCart.click();
  }
}

module.exports = { ProductPage };
