import { test, expect, Locator } from '@playwright/test';
//

test('test2.1_VerifyLoginFlowFormHandling', async ({ page }) => {
  await page.goto('/auth/login');
    await expect(page.locator('[data-test="email"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-submit"]')).toBeVisible();

  // Fill username and password, then press Enter on the password field
  await page.fill('[data-test="email"]', 'admin@practicesoftwaretesting.com');
  await page.fill('[data-test="password"]', 'welcome01');
  await page.locator('[data-test="password"]').press('Enter');

  // Verify the redirected URL is the account page
  await expect(page).toHaveURL('/account');

  if (test.info().errors.length > 0) {
      console.log(`❌ Test finished -issues in login flow!`);
    } else {
      console.log(`✅ Login Flow works correctly!`);
    }
});

test('test2.2_VerifyInvalidLogin', async ({ page }) => {

  await page.goto('/');

  await page.locator('[data-test="nav-sign-in"]').click()
  await page.goto('/auth/login');

  const InvalidUser = 'invalid@test.com';
  const InvalidPassword = 'wrongpassword';

   await page.waitForLoadState('networkidle');

   //Verify entering invalid username and password shows error message
  await page.locator('[data-test="email"]').click();
  await page.locator('[data-test="email"]').fill(InvalidUser);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(InvalidPassword);
  await page.locator('[data-test="login-submit"]').click();
  await expect.soft(page.getByText('Invalid email or password')).toBeVisible();

  // Optionally, check for specific error text if available
  await expect.soft(page.locator('[data-test="login-error"]')).toContainText((/Invalid|Incorrect/));

 
  if (test.info().errors.length > 0) {
      console.log(`❌ Test finished -issues in negative login flow!`);
    } else {
      console.log(`✅ Invalid Flow works correctly. Error message displayed as expected!`);
    }

});

test('test2.3_VerifySearchFunctionality', async ({ page }) => {

  const searchKeyword = 'pilert';

  await page.goto('/');
  await expect(page.locator('[data-test="search-query"]')).toBeVisible();
  await page.locator('[data-test="search-query"]').click();
  await page.locator('[data-test="search-query"]').fill(searchKeyword);

  // Wait for results to load
  await page.waitForLoadState('networkidle');

  // To see at least one product card is displayed for the search term 
  const productCards = page.locator('.card'); 
  const firstProductName = page.locator('[data-test="product-name"]').first();
   const productNameText = await firstProductName.innerText();

  await expect(productCards.first()).toBeVisible();

  if (await productCards.count() > 0) {
    await expect(firstProductName).toBeVisible();
    console.log(`At least one or more products are displayed for the search term `);
  }


  if (productNameText.toLowerCase().includes(searchKeyword.toLowerCase())) {
  console.log(`First product found: ${productNameText}`);
} else {
  console.log(`No products found for the search term ${searchKeyword}`);
}

if (test.info().errors.length > 0) {
      console.log(`❌ Test finished -issues in search flow!`);
    } else {
      console.log(`✅ Search Flow works correctly. Products displayed for search term ${searchKeyword}!`);
    }
});

test('test2.4_VerifyProductSorting', async ({ page }) => {

    const productCards = page.locator('.card'); 
    const firstProductName = page.locator('[data-test="product-name"]').first();
    const lastProductName = page.locator('[data-test="product-name"]').last();
    const firstProductPrice = page.locator('[data-test="product-price"]').first();
    const lastProductPrice = page.locator('[data-test="product-price"]').last();

  await page.goto('/');
  await expect(productCards.first()).toBeVisible();

  // Verify the first product comes alphabetically before the last product -  name sorting (ascending)
  await page.locator('[data-test="sort"]').selectOption('name,asc');
  const firstProductVisibleName = await firstProductName.innerText();
  const lastProductVisibleName = await lastProductName.innerText();
  
  expect(firstProductVisibleName.toLowerCase() < lastProductVisibleName.toLowerCase()).toBeTruthy();
  console.log(` ✅ Products sorted by name ascending: "${firstProductVisibleName}" comes before "${lastProductVisibleName}"`);

  if (firstProductVisibleName.toLowerCase() > lastProductVisibleName.toLowerCase()) {
    throw new Error(` ❌Products are not sorted correctly by name: "${firstProductVisibleName}" should come before "${lastProductVisibleName}"`);
  }

  // Test price sorting (descending)
  await page.locator('[data-test="sort"]').selectOption('price,desc');
  
  const firstPrice = parseFloat(await firstProductPrice.innerText().then(text => text.replace('$', '')));
  const lastPrice = parseFloat(await lastProductPrice.innerText().then(text => text.replace('$', '')));
  
  expect(firstPrice > lastPrice).toBeTruthy();
  console.log(` ✅ Products sorted by price descending: $${firstPrice} is greater than $${lastPrice}`);
 if (firstPrice < lastPrice) {
    throw new Error(`❌Products are not sorted correctly by price: $${firstPrice} should be greater than $${lastPrice}`);
  }
});

test('2.5 — Category Filtering', async ({ page }) => {
    //Below code is AI generated 
    await page.goto('/');
    
    const category = 'Power Tools';
    const checkbox = page.getByRole('checkbox', { name: new RegExp(category, 'i') }).first();
  await expect(checkbox).toBeVisible({ timeout: 5000 });

  if (!(await checkbox.isChecked())) await checkbox.check();
  await expect(checkbox).toBeChecked();

  // wait for filter to apply
  await page.waitForLoadState('networkidle');

  const cards = page.locator('.card, [data-test="product-card"]');
  await expect(cards.first()).toBeVisible({ timeout: 5000 });

  const cardCount = await cards.count();
  for (let i = 0; i < cardCount; i++) {
    const card = cards.nth(i);
    const catLabel = card.locator('[data-test="product-category"], .card-category, .category, .badge-category');
    if ((await catLabel.count()) > 0) {
      await expect(catLabel).toContainText(new RegExp(category, 'i'));
    } else {
      // fallback: ensure product name or visible content exists (no category label available)
      const nameLocator = card.locator('[data-test="product-name"], .card-title, h4').first();
      await expect(nameLocator).toBeVisible();
    }
  }
  console.log(`✅ Category "${category}" selected and ${cardCount} product(s) visible.`);
    });
  
    
test('test2.6_VerifyContactForm', async ({ page }) => {

  await page.goto('/contact');
  await page.waitForLoadState('networkidle');

    const FirstNameInput = "Nuwani";
    const LastNameInput = "Nishadhi";
    const EmailInput = "nuwani@gmail.com";
    const SubjectInput = "customer-service";
    const MessageInput = "I am writing to request more information regarding the specific technical specifications of the product I viewed online. I would appreciate it if you could clarify the warranty terms and the estimated delivery timeline for my current location";


  await expect(page.locator('[data-test="first-name"]')).toBeVisible();
  await page.locator('[data-test="first-name"]').fill(FirstNameInput);

  await expect(page.locator('[data-test="last-name"]')).toBeVisible();
  await page.locator('[data-test="last-name"]').fill(LastNameInput);
 
  await expect(page.locator('[data-test="email"]')).toBeVisible();
  await page.locator('[data-test="email"]').fill(EmailInput);

  await expect(page.locator('[data-test="subject"]')).toBeVisible();
  await page.locator('[data-test="subject"]').selectOption(SubjectInput);
 
  await expect(page.locator('[data-test="message"]')).toBeVisible();
  await page.locator('[data-test="message"]').fill(MessageInput);
  await page.locator('[data-test="contact-submit"]').click();

    await page.waitForLoadState('networkidle');
    await expect.soft(page.getByText('Thanks for your message! We')).toHaveText(/Thanks for your message! We will contact you shortly./);
    console.log(`Contact form submitted successfully `);
});

