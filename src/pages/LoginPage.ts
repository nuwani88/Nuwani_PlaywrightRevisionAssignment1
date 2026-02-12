/* --LoginPage Content --
Locators: email input, password input, login button, error message
Methods: login(email, password), getErrorMessage(), isErrorVisible() */

import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
 
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');
    this.errorMessage = page.locator('[data-test="login-error"]');
  }

  // Method: login(email, password)
  async login(email: string, password: string) {
    await this.page.waitForLoadState('networkidle');
     
    await this.emailInput.waitFor({ state: 'visible'});
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  // Method: getErrorMessage() — returns the text of the error
  async getErrorMessage(): Promise<string | null> {
    return await this.errorMessage.textContent();
  }

  // Method: isErrorVisible() — returns true/false
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}