
/* --HomePage Content --
Locators: search input, sort dropdown, product cards, category filters, navigation links
Methods: searchProduct(term), selectSort(option), getProductNames(),getProductPrices(), clickProduct(name), filterByCategory(name),
getProductCount() */

import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  

  readonly searchInput: Locator;
  readonly sortDropdown: Locator;
  readonly productCards: Locator;
  readonly categoryFilters: Locator;
  readonly navigationLinks: Locator;

  constructor(page: Page) {
    super(page); // Requirement: Calls the parent BasePage constructor
    this.searchInput = page.locator('[data-test="search-query"]');
    this.sortDropdown = page.locator('[data-test="sort"]');
    this.productCards = page.locator('.card-title');
    this.categoryFilters = page.locator('.list-group-item');
    this.navigationLinks = page.locator('.nav-link');
  }

  // Method: searchProduct(term)
  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.page.locator('[data-test="search-submit"]').click();
  
  }

  // Method: selectSort(option)
  async selectSort(sortType: string, sortOrder: string) {
    await this.page.waitForLoadState('networkidle');
    const combinedValue = `${sortType.toLowerCase()},${sortOrder.toLowerCase()}`;
    await this.sortDropdown.selectOption({ value: combinedValue });
    
    // Wait for the UI to update the product grid
    await this.page.waitForLoadState('networkidle');
  }

   // Method: getProductNames() — returns array of strings
  async getProductNames(): Promise<string[]> {
    return await this.productCards.allInnerTexts();
  }
  async getFirstProductName(): Promise<string> {
    const names = await this.getProductNames();
    return names[0];
  }

  async getLastProductName(): Promise<string> {
    const names = await this.getProductNames();
    return names[names.length - 1];
  }



  // Method: getProductPrices()
  async getProductPrices(): Promise<string[]> {
    return await this.page.locator('.card-footer span').allInnerTexts();
  }

  // 
  
  async clickProduct(name: string) {
    
    // 2. Click logic must be OUTSIDE the if block
    // Using a more specific locator to avoid strict mode violations
    const productLink = this.page.locator('.card').filter({ hasText: name });
    
    await productLink.scrollIntoViewIfNeeded();
    await productLink.click();
  }

  // Method: filterByCategory(name)
  async filterByCategory(name: string) {
    await this.page.getByRole('checkbox', { name }).check();
  }

  // Method: getProductCount()
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async navigateToCart() {
  // Use the data-test attribute for stability
  const cartIcon = this.page.locator('[data-test="nav-cart"]');
  
  // Wait for the icon to be actionable before clicking
  await cartIcon.waitFor({ state: 'visible' });
  await cartIcon.click();
  
  // Wait for the URL or a specific element on the Cart Page
  await this.page.waitForURL(/.*checkout|.*cart/);
}
}