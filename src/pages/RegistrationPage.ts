/*--RegistrationPage Content --
Locators: first name, last name, DOB, address, city, state, country, postcode, phone, email, password,
register button
Methods: fillRegistrationForm(data), submitRegistration()*/

import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dobInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countryDropdown: Locator;
  readonly postcodeInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dobInput = page.locator('[data-test="dob"]');
    this.addressInput = page.locator('[data-test="address"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countryDropdown = page.locator('[data-test="country"]');
    this.postcodeInput = page.locator('[data-test="postcode"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.registerButton = page.locator('[data-test="register-submit"]');
  }

  /**
   * Method: fillRegistrationForm(data) -Object used*/
  async fillRegistrationForm(data: any) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.dobInput.fill(data.dob);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.countryDropdown.selectOption({ label: data.country });
    await this.postcodeInput.fill(data.postcode);
    await this.phoneInput.fill(data.phone);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
  }

  // Method: submitRegistration()
  async submitRegistration() {
    await this.registerButton.click();
  }
}