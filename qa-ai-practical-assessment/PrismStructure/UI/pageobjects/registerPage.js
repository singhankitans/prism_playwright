class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.getByTestId("first-name");
    this.lastName = page.getByTestId("last-name");
    this.dob = page.getByTestId("dob");
    this.street = page.getByTestId("street");
    this.postalCode = page.getByTestId("postal_code");
    this.city = page.getByTestId("city");
    this.state = page.getByTestId("state");
    this.country = page.getByTestId("country");
    this.phone = page.getByTestId("phone");
    this.email = page.getByTestId("email");
    this.password = page.getByTestId("password");
    this.houseNumber = page.getByTestId("house_number");
    this.submit = page.getByTestId("register-submit");
  }

  async goto() {
    await this.page.goto("/auth/register");
    await this.firstName.waitFor({ state: "visible" });
  }

  async register(user) {
    await this.firstName.fill(user.first_name);
    await this.lastName.fill(user.last_name);
    await this.dob.fill(user.dob);
    await this.country.selectOption(user.address.country);
    await this.postalCode.fill(user.address.postal_code);
    if (await this.houseNumber.count()) {
      await this.houseNumber.fill(user.address.house_number || "12");
    }
    await this.street.fill(user.address.street);
    await this.city.fill(user.address.city);
    await this.state.fill(user.address.state);
    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}

module.exports = { RegisterPage };
