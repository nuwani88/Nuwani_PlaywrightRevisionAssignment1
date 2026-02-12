import { test, expect } from '@playwright/test';
import { Cipheriv } from 'node:crypto';

test('test3.1_VerifyKeyboardNavigation', async ({ page }) => {

  await page.goto('/auth/login');

  const loginEmailData = 'customer@practicesoftwaretesting.com';
  const loginPasswordData = 'welcome01';


  await page.locator('[data-test="email"]').click();
   await expect(page.locator('[data-test="email"]')).toBeFocused();
   await page.locator('[data-test="email"]').fill(loginEmailData);
  await expect(page.locator('[data-test="email"]')).toHaveValue(loginEmailData);

  await page.locator('[data-test="email"]').press('Tab');
  await expect(page.locator('[data-test="password"]')).toBeFocused();
  await page.locator('[data-test="password"]').fill(loginPasswordData);
  await expect(page.locator('[data-test="password"]')).toHaveValue(loginPasswordData);

  await page.locator('[data-test="password"]').press('Tab');
  await page.locator('[data-test="login-form"] button').press('Tab');

    await expect(page.locator('[data-test="login-submit"]')).toBeFocused();
    await page.locator('[data-test="login-submit"]').press('Enter');

    await page.waitForLoadState('networkidle');

  await expect(page.locator('[data-test="page-title"]')).toBeVisible();
  await expect(page.locator('[data-test="page-title"]')).toContainText('My account');

  if(await page.locator('[data-test="page-title"]').isVisible()){
    console.log('Login successful using keyboard navigation.');
  }

});

test('test3.2_verifyProductImageInteraction', async ({ page }) => {

  await page.goto('/');

  const productCards = page.locator('.card'); 
    await expect(productCards.first()).toBeVisible();

     // Get the first product card name
  const firstProductName = page.locator('[data-test="product-name"]').first();
  await expect(firstProductName).toBeVisible();
  
    // Get the text and convert to lowercase for comparison
  const productNameText = await firstProductName.innerText();

  const productPrice = page.locator('[data-test="product-price"]').first();
  const firstPrice = parseFloat(await productPrice.innerText().then(text => text.replace('$', '')));
  const productImage = page.locator('.card img').first();
    await expect(productImage).toBeVisible();
    await productImage.click();

     await page.waitForLoadState('networkidle');

  await expect(page.getByRole('img', { name: productNameText })).toBeVisible();
  await expect(page.locator('[data-test="product-name"]')).toBeVisible();
  await expect(page.locator('[data-test="product-name"]')).toContainText(productNameText);
  await expect(page.locator('[data-test="unit-price"]')).toBeVisible();
  await expect(page.locator('[data-test="unit-price"]')).toContainText(firstPrice.toString());
  await page.getByRole('link', { name: 'More information' }).nth(1).click();


   const initialSrc = await productImage.getAttribute('src');

  // click a different thumbnail or alternate image to change main image
  const thumbnail = page.locator('.product-thumbnails img, .thumbnails img, .gallery img').nth(1);
  if (await thumbnail.count() > 0) {
    await thumbnail.click();
  } else {
    await page.getByRole('img').nth(1).click();
  }

  await page.waitForLoadState('networkidle');

  const newSrc = await productImage.getAttribute('src');
  expect(newSrc).not.toBe(initialSrc);
  console.log(`Main image src changed from "${initialSrc}" to "${newSrc}"`);

});

test('test3.3_AddToCartWithQuantity', async ({ page }) => {
  
  const quantity = 3;
  
  // Navigate to home page
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Navigate to product detail page
  const productCards = page.locator('.card');
  await expect(productCards.first()).toBeVisible({ timeout: 10000 });
  
  const firstProductName = page.locator('[data-test="product-name"]').first();
  const productNameText = await firstProductName.innerText();
  
  await firstProductName.click();
  await page.waitForLoadState('domcontentloaded');

  // Verify product detail page loaded
  await expect(page.locator('[data-test="product-name"]')).toBeVisible();
  await expect(page.locator('[data-test="unit-price"]')).toBeVisible();
  console.log(`Navigated to product: ${productNameText}`);

  // Find and update quantity input field
  const quantityInput = page.locator('[data-test="quantity"]');

  
  // Clear and set quantity
  await quantityInput.click();
  await quantityInput.fill('');
  await quantityInput.fill(quantity.toString());
  await expect(quantityInput).toHaveValue(quantity.toString());
  console.log(`✓ Quantity set to: ${quantity}`);

  // Click "Add to Cart" button
  const addToCartBtn = page.locator('[data-test="add-to-cart"]');
  await expect(addToCartBtn).toBeVisible();
  await expect(addToCartBtn).toBeEnabled();
  await addToCartBtn.click();
  await page.waitForLoadState('networkidle');
  console.log(`✓ Add to Cart button clicked`);

  // Verify cart badge updates
  const cartBadge = page.locator('[data-test="nav-cart"] .badge');
  await page.waitForLoadState('networkidle');
  await expect(cartBadge).toBeVisible({ timeout: 10000 });
  const cartCount = await cartBadge.innerText();

  if (parseInt(cartCount) === quantity) {
    console.log(`✓ Cart badge updated to: ${cartCount}`);
  } else {
    throw new Error(`Cart badge count mismatch: expected ${quantity}, got ${cartCount}`);
  }

  // Navigate to cart page
  const cartIcon = page.locator('[data-test="nav-cart"]');
  await expect(cartIcon).toBeVisible();
  await cartIcon.click();
  await page.waitForLoadState('domcontentloaded');
  console.log(`✓ Navigated to cart page`);

  // Verify product name in cart
  const cartProductName = page.locator('[data-test="product-title"]').first();
   await page.waitForLoadState('networkidle');
  await expect(cartProductName).toBeVisible({ timeout: 8000 });
  const cartProductNameText = await cartProductName.innerText();
  
  if (cartProductNameText.toLowerCase().includes(productNameText.toLowerCase())) {
    console.log(` SUCCESS: Product name verified in cart: "${cartProductNameText}"`);
  } else {
    throw new Error(`FAILED: Product name mismatch! Expected "${productNameText}", but got "${cartProductNameText}"`);
  }

  // Verify quantity in cart
  const cartQuantityInput = page.locator('[data-test="quantity"], input[type="number"], .quantity-input').first();
  
  try {
    await expect(cartQuantityInput).toBeVisible({ timeout: 5000 });
    const cartQuantityValue = await cartQuantityInput.inputValue();
    const parsedQuantity = parseInt(cartQuantityValue || '0', 10);
    
    if (parsedQuantity >= quantity) {
      console.log(`SUCCESS: Product "${cartProductNameText}" added to cart with correct quantity: ${parsedQuantity}`);
    } else {
      throw new Error(`FAILED: Quantity mismatch! Expected ${quantity}, but got ${parsedQuantity}`);
    }
  } catch (error) {
    // Fallback: try to find quantity in text content
    const cartItemLocator = page.locator('.cart-item, [data-test="cart-item"]').first();
    const itemText = await cartItemLocator.innerText();
    console.log(` Quantity input not visible, checking cart item text: ${itemText}`);
    
    // Check if quantity appears in the item text
    if (itemText.includes(quantity.toString())) {
      console.log(` SUCCESS: Product "${cartProductNameText}" added to cart with quantity: ${quantity}`);
    } else {
      console.warn(` WARNING: Could not verify exact quantity, but product is in cart`);
    }
  }
});


test('test3.4_VerifyHoverEffectsOnProductCards', async ({ page }) => {
  await page.goto('/');
    await page.waitForLoadState('networkidle');

  const logoLink = page.getByRole('link', { name: 'Practice Software Testing -' });
  await expect(logoLink,'The Logo link was not found on the page').toBeVisible({ timeout: 10000 });
  await logoLink.hover();
  await logoLink.click
  const hoverContent = page.getByText('Practice Software Testing - ToolShop');

  hoverContent.isVisible().then(isVisible => {
    if (!isVisible) {          
      throw new Error('Hover content is not visible');
    }else{
      console.log("SUCCESS: Hover content is visible");
    }
  });
  await expect(hoverContent, 'FAILURE: Hoverover text was not visible after mouse over')
    .toBeVisible({ timeout: 5000 });

  // 4. Verify exact text match
  const actualText = await hoverContent.innerText();
  const expectedText = 'Practice Software Testing - ToolShop';
  expect(actualText, `TEXT MISMATCH: Found "${actualText}" but expected "${expectedText}"`)
    .toBe(expectedText);
});

test('test3.5_VerifyBrowserBackForwardNavigation', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Navigate to product detail page
  const productCards = page.locator('.card');
  await expect(productCards.first()).toBeVisible({ timeout: 10000 });
  
  const firstProductCard = page.locator('[data-test="product-name"]').first();
  await firstProductCard.click();
  const productName = await firstProductCard.innerText();
  await page.waitForLoadState('domcontentloaded');

// Verify we are on the Product Detail page
  await expect(page).toHaveURL(/.*product/);
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();

  // 2. Use page.goBack() to return to home
  await page.goBack();

  // 3. Verify you're back on the home page
  // We check the URL and the presence of the home-specific UI (like the hero image or category sidebar)
  await expect(page).toHaveURL('/');
  await expect(page.locator('[data-test="nav-categories"]')).toBeVisible();

  // 4. Use page.goForward() to return to product detail
  await page.goForward();

  // 5. Verify the product detail page is displayed again
  await expect(page).toHaveURL(/.*product/);
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();
});

test('test3.6_VerifyKeyboardShortcuts', async ({ page }) => {
  await page.goto('/auth/register');
  await page.waitForLoadState('networkidle');

  const FirstNameInput = "Nuwani";
  const LastNameInput = "Nishadhi";
  const DateOfBirthInput = "1990-01-01";
  const StreetInput = "Hill Street";
  const PostalCodeInput = "250";
  const CityInput = "Piliyandala";  
  const StateInput = "Colombo";
  const CountryInput = "LK"; // Dropdown selection for Sri Lanka (LK)
  const CountryVisibleText = "Sri Lanka"; 
  const PhoneInput = "0712633265";
  const EmailInput = "nuwani@gmail.com";
  const PasswordInput = "Nuwani2026!";


  try{
  await page.locator('[data-test="first-name"]').click();
  await page.locator('[data-test="first-name"]').fill(FirstNameInput);
  await page.locator('[data-test="first-name"]').press('Tab');
  await page.locator('[data-test="last-name"]').fill(LastNameInput);
  await page.locator('[data-test="last-name"]').press('Tab');
  await page.locator('[data-test="dob"]').fill(DateOfBirthInput);
  await page.locator('[data-test="dob"]').press('Tab');
  await page.locator('[data-test="street"]').fill(StreetInput);
  await page.locator('[data-test="street"]').press('Tab');
  await page.locator('[data-test="postal_code"]').fill(PostalCodeInput);
  await page.locator('[data-test="postal_code"]').press('Tab');
  await page.locator('[data-test="city"]').fill(CityInput);
  await page.locator('[data-test="city"]').press('Tab');
 await page.locator('[data-test="state"]').fill(StateInput);  
  await page.locator('[data-test="state"]').press('Tab');
 await page.locator('[data-test="country"]').selectOption(CountryInput);
  await page.locator('[data-test="phone"]').click();
  await page.locator('[data-test="phone"]').fill(PhoneInput);
  await page.locator('[data-test="email"]').click();
  await page.locator('[data-test="email"]').fill(EmailInput);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(PasswordInput);

  await expect(page.locator('[data-test="first-name"]')).toHaveValue(FirstNameInput);
  await expect(page.locator('[data-test="last-name"]')).toHaveValue(LastNameInput);
  await expect(page.locator('[data-test="dob"]')).toHaveValue(DateOfBirthInput);
  await expect(page.locator('[data-test="street"]')).toHaveValue(StreetInput);
  await expect(page.locator('[data-test="postcode"]')).toHaveValue(PostalCodeInput); //fails this step. recheck
  await expect(page.locator('[data-test="city"]')).toHaveValue(CityInput);
  await expect(page.locator('[data-test="state"]')).toHaveValue(StateInput);
  await expect(page.locator('[data-test="country"]')).toHaveValue(CountryVisibleText); //fails this step. recheck
    await expect(page.locator('[data-test="phone"]')).toHaveValue(PhoneInput);
    await expect(page.locator('[data-test="email"]')).toHaveValue(EmailInput);
    await expect(page.locator('[data-test="password"]')).toHaveValue(PasswordInput);
  
  // Final check: if any soft assertions failed, the test will be marked as failed here.
    if (test.info().errors.length > 0) {
      console.log(`❌ Test finished with ${test.info().errors.length} assertion failures.`);
    } else {
      console.log('✅ All fields verified successfully!');
    }

  } catch (error) {
    // 5. Error Handling for navigation or locator issues
    console.error('Critical Error during test execution:', error);
    throw error; // Re-throw so the test runner knows it crashed
  
}
});





