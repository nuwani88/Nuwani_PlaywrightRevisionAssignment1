import { test, expect } from '@playwright/test';


test('test1_HomePageLoad', async ({ page }) => {
  await page.goto('/');

  // Verify the page title contains "Practice Software Testing"
  await expect(page).toHaveTitle(/Practice Software Testing/);
  
  // Verify the page URL is correct
  await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
  
  // Verify the site logo/header is visible
  await expect(page.getByRole('link', { name: 'Practice Software Testing -' })).toBeVisible();

  if (test.info().errors.length > 0) {
      console.log(`❌ Test finished with issues!`);
    } else {
      console.log(`✅ Home Page loaded successfully!`);
    }
}
);

test('test2_NavigationLinksWork', async ({ page }) => {
  await page.goto('/');

  //Verify navigation elements are visible
  await expect(page.locator('[data-test="nav-home"]')).toBeVisible();
  await expect(page.locator('[data-test="nav-categories"]')).toBeVisible();
  await expect(page.locator('[data-test="nav-contact"]')).toBeVisible();
  await expect(page.locator('[data-test="nav-sign-in"]')).toBeVisible();

  //  Click on "Contact" and verify the URL changes to the contact page
  await page.locator('[data-test="nav-contact"]').click();
  await expect(page).toHaveURL(/.*contact/);

  if (test.info().errors.length > 0) {
      console.log(`❌ Test finished with link navigation issues!`);
    } else {
      console.log(`✅ Navigation links work correctly!`);
    }
});

test('test3_ProductsAreDisplayed', async ({ page }) => {
  await page.goto('/');

  // Verify that at least one product card is displayed
  const productCards = page.locator('.card'); 
  await expect(productCards.first()).toBeVisible();
  console.log(`Atleast one product card is displayed.`);
  
  //3. Verify each visible product has a name and price
  const productNames = page.locator('[data-test="product-name"]');
  await productNames.first().waitFor({ state: 'visible', timeout: 5000 });
   
  const productPrices = page.locator('[data-test="product-price"]');
  const productCount = await productNames.count();
  console.log(`Successfully found ${productCount} products. Starting validation...`);

    for (let i = 0; i < productCount; i++) {
      // Validate Name: Visible and not empty
      const name = productNames.nth(i);
      await expect(name).toBeVisible();
      await expect(name).not.toBeEmpty();

      // Validate Price: Visible and contains currency symbol
      const price = productPrices.nth(i);
      await expect(price).toBeVisible();
      await expect(price).toContainText('$');
      
      // Log progress to terminal (optional)
      const nameText = await name.innerText();
      console.log(`Validated Product ${i + 1}: ${nameText}`);
      
    }
 
   if (test.info().errors.length > 0) {
      console.log(`❌ Test finished with ${test.info().errors.length} products without name/price!`);
    } else {
      console.log(`✅ All ${productCount} products have a name and price!`);
    }
});

test('test4_VerifyLoginPageAccessible', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await expect(page.locator('[data-test="email"]')).toBeVisible();
  await expect(page.locator('[data-test="password"]')).toBeVisible();
  await expect(page.locator('[data-test="login-submit"]')).toBeVisible();

  if (test.info().errors.length > 0) {
      console.log(`❌ Test finished -issues in accessing Login Page!`);
    } else {
      console.log(`✅ Login Page is accessible!`);
    }
});



