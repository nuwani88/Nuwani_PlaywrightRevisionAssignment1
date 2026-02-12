/* --ProductPage Content --
Locators: product name, price, quantity input, add-to-cart button, product image
Methods: getProductName(), getProductPrice(), setQuantity(qty), addToCart(),
getImageSrc() */

import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {

  readonly productName: Locator;
  readonly price: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page); 
    this.productName = page.locator('[data-test="product-name"]');
    this.price = page.locator('[data-test="unit-price"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
  }

  // Method: getProductName()
  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }

  // Method: getProductPrice()
  async getProductPrice(): Promise<string | null> {
    return await this.price.textContent();
  }

  // Method: setQuantity(qty)
    async setQuantity(qty: number) {
    await this.quantityInput.waitFor({ state: 'visible' });
    await this.quantityInput.fill(qty.toString());
    await expect(this.quantityInput).toHaveValue(qty.toString());
  }

  // Method: addToCart()
  async addToCart() {
    await this.addToCartButton.click();
  }

}

