import { Page, expect } from '@playwright/test';

export class BasePage {
  // Requirements: Properties page (protected) and baseURL (protected)
  protected page: Page;
  protected baseURL: string;

  // Requirement: Constructor takes Page
  constructor(page: Page) {
    this.page = page;
    // Accesses baseURL from the playwright.config.ts if provided, 
    // otherwise defaults to a string.
    this.baseURL = (page.context() as any)._options?.baseURL || '';
  }

  // Requirement: navigate(path: string) — goto baseURL + path
  async navigate(path: string) {
    await this.page.goto(path); 
  }

  // Requirement: verifyUrl(pattern: RegExp) — assert URL matches
  async verifyUrl(pattern: RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }

  // Requirement: verifyTitle(pattern: RegExp) — assert title matches
  async verifyTitle(pattern: RegExp) {
    await expect(this.page).toHaveTitle(pattern);
  }

  // Requirement: waitForPageLoad() — waitForLoadState
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Requirement: takeScreenshot(name: string) — save screenshot
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  // Requirement: getCurrentUrl() — return current URL string
  getCurrentUrl(): string {
    return this.page.url();
  }
}