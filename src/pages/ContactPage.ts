/*Contact Content --
Locators: first name, last name, email, subject dropdown, message textarea, submit button, success
message
Methods: fillContactForm(data), submitForm(), getSuccessMessage(),
isSuccessVisible()*/

import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectSelect: Locator;
  readonly messageInput: Locator;
  readonly submitBtn: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.subjectSelect = page.locator('[data-test="subject"]');
    this.messageInput = page.locator('[data-test="message"]');
    this.submitBtn = page.locator('[data-test="contact-submit"]');
    this.successMessage = page.locator('.alert-success'); // Or the specific text locator
  }

  async submitContactForm(details: { first: string, last: string, email: string, subject: string, message: string }) {
    await this.firstNameInput.fill(details.first);
    await this.lastNameInput.fill(details.last);
    await this.emailInput.fill(details.email);
    await this.subjectSelect.selectOption(details.subject);
    await this.messageInput.fill(details.message);
    await this.submitBtn.click();
  }
}