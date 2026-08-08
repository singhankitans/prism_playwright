class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByTestId("email");
    this.password = page.getByTestId("password");
    this.submit = page.getByTestId("login-submit");
    this.registerLink = page.getByTestId("register-link");
    this.error = page.locator(".help-block, .alert, [data-test='login-error']").first();
  }

  async goto() {
    await this.page.goto("/auth/login");
    await this.email.waitFor({ state: "visible" });
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
    // Success redirects to /account (nav-menu); failure stays with an error message
    await Promise.race([
      this.page.getByTestId("nav-menu").waitFor({ state: "visible" }),
      this.page.getByText(/invalid|incorrect|unauthorized|failed/i).waitFor({ state: "visible" }),
    ]);
  }
}

module.exports = { LoginPage };
