import { test, expect } from '../fixtures/test-fixtures';
//import { users } from '../fixtures/test-fixtures';

test.describe('E2E: Product Purchase Flow', () => {
  
  test('Complete shopping journey from search to authenticated cart', async ({ 
    homePage, 
    productPage, 
    cartPage, 
    loginPage, 
    page 
  }) => {
    const productSearch = 'Pliers';
    const targetQty = 2;

    // Step 1: Navigate and verify products loaded
    await homePage.navigate('/');
    await expect(homePage.productCards.first()).toBeVisible();

    // Step 2-4: Search and navigate to product detail
    await homePage.searchProduct(productSearch);
    const productName = await homePage.getFirstProductName();
    await homePage.clickProduct(productName);
    
    // Step 5-6: Set quantity and Add to Cart
    await productPage.setQuantity(targetQty);
    await productPage.addToCart();

    // Step 7: Verify Cart content
    await homePage
    expect(await cartPage.getItemNames()).toContain(productName);
    expect(await cartPage.getCartItemCount()).toBe(targetQty);

    // Step 8-10: Authentication
    await homePage.navigate('/auth/login');
    await loginPage.login('customer@practicesoftwaretesting.com', 'welcome01');
    //--pull data directly from JSON. Failes - currently fails
    // await loginPage.login(users.ValidCustomerCredentials.email, users.ValidCustomerCredentials.password);  
    await expect(page).toHaveURL(/.*account/);

    // // Step 11: Verify persistence (Cart item still there)
    await homePage.navigateToCart();
    expect(await cartPage.cartItems).toBe(targetQty);

    // Step 12: Browser Navigation verification
    await page.goBack();
    await expect(page).toHaveURL(/.*account/);
    await page.goForward();
    await expect(page).toHaveURL(/.*checkout|.*cart/);
  });
});