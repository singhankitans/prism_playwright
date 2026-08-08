const { HomePage } = require("./homePage");
const { LoginPage } = require("./loginPage");
const { RegisterPage } = require("./registerPage");
const { ProductPage } = require("./productPage");
const { CheckoutPage } = require("./checkoutPage");
const { AccountPage } = require("./accountPage");

class POManager {
  constructor(page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.registerPage = new RegisterPage(page);
    this.productPage = new ProductPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.accountPage = new AccountPage(page);
  }
}

module.exports = { POManager };
