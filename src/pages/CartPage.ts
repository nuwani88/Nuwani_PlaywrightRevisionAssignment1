/* --CartPage Content --
Locators: cart items, item names, item quantities, item prices, total, proceed button
Methods: getCartItemCount(), getItemNames(), getTotal(), removeItem(name),
proceedToCheckout() */

import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {

  readonly cartItems: Locator;
  readonly cartProductName: Locator;
  readonly cartQuantityInput: Locator;
  readonly itemPrices: Locator;
  readonly cartTotal: Locator;
  readonly proceedButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('tr.row');
    this.cartProductName = page.locator('[data-test="product-title"]');
    this.cartQuantityInput = page.locator('[data-test="product-quantity"]');
    this.itemPrices = page.locator('[data-test="product-price"]');
    this.cartTotal = page.locator('[data-test="cart-total"]');
    this.proceedButton = page.locator('[data-test="proceed-1"]');
  }

  // Method: getCartItemCount()
  async getCartItemCount(): Promise<number> {
    return await this.cartProductName.count();
  }

  // Method: getItemNames() — returns array of strings
  async getItemNames(): Promise<string[]> {
    return await this.cartProductName.allInnerTexts();
  }

  // Method: getTotal() — returns the total amount as a string
  async getTotal(): Promise<string | null> {
    return await this.cartTotal.textContent();
  }

  
  // Method: proceedToCheckout()
  async proceedToCheckout() {
    await this.proceedButton.click();
  }
}