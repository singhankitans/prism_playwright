class AccountPage {
  constructor(page) {
    this.page = page;
    this.navMenu = page.getByTestId("nav-menu");
    this.myProfile = page.getByTestId("nav-my-profile");
    this.myInvoices = page.getByTestId("nav-my-invoices");
  }

  async openMyInvoices() {
    await this.navMenu.click();
    await this.myInvoices.click();
    await this.page.waitForURL(/account\/invoices/);
  }

  async openMyProfile() {
    await this.navMenu.click();
    await this.myProfile.click();
  }
}

module.exports = { AccountPage };
