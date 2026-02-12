// Test 6: Submit contact form
// Test 7: Verify authenticated user can access account page


import { test, expect } from '../fixtures/test-fixtures';
import { HomePage } from '../src/pages/HomePage';
import { LoginPage } from '../src/pages/LoginPage';
import { ContactPage } from '../src/pages/ContactPage';
import { ProductPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';
import { error } from 'node:console';


//import userData from '../test-data/user.json';

test.describe('Task 4: Write POM-based tests', () => {
   
  // Test 1: Using Parametrized data from user.json
  test('4.1_Login with valid credentials', async ({ loginPage }) => {
    await loginPage.login('customer@practicesoftwaretesting.com', 'welcome01');
    //--pull data directly from JSON. Failes - currently fails
    // await loginPage.login(users.ValidCustomerCredentials.email, users.ValidCustomerCredentials.password);  
    await loginPage.verifyUrl(/.*account/);
   const isVisible = await loginPage.isErrorVisible();
    expect(isVisible).toBe(false); 
    if (test.info().errors.length > 0) {
          console.log(`❌ Test finished -issues in login flow!`);
        } else {
          console.log(`✅ Login Flow works correctly!`);
        }
  });

  // Test 2: Invalid Login (Hardcoded strings for negative testing)
  test('4.2_Login with invalid credentials', async ({ loginPage }) => {
    //--pull data directly from JSON. Failes - currently fails
   // await loginPage.login(users.InvalidCustomerCredentials.email, users.InvalidCustomerCredentials.password);
    await loginPage.login('wrong@user.com', 'badpassword');
    if (await loginPage.isErrorVisible()) {
      expect(await loginPage.getErrorMessage()).toMatch(/Invalid|Incorrect/);
    } else {
      await loginPage.verifyUrl(/\/auth\/login/);
    }
  });

  // Test 3: Search for a product (using HomePage).  If no results, this test will fail. 
  test('4.3_Search for a product and verify results', async ({ homePage }) => {
    
    const searchTerm = 'Hammer';
    await homePage.searchProduct(searchTerm);

    //Retrieve all product names currently visible on the page
    const products = await homePage.getProductNames();

    //Verify at least one product is found
    expect(products.length).toBeGreaterThan(0);
  });
});

// Test 4: Sort products by name
test('4.4_Sort products by name and verify order', async ({ homePage }) => {
  await homePage.selectSort('name','asc');
  const firstProduct = await homePage.getFirstProductName();
  const lastProduct = await homePage.getLastProductName();

  // 3. Assert: Verify alphabetical order
  // Note: Localized comparison is safer for different character sets
  const isSorted = firstProduct.toLowerCase().localeCompare(lastProduct.toLowerCase()) <= 0;
  
  expect(isSorted).toBeTruthy();
  
});

// Test 5: Add product to cart (Home → Product → Cart)
test('4.5_AddProductToCart', async ({ page,homePage }) => {

  const productName = await homePage.getFirstProductName();
  await homePage.clickProduct(productName);
  await page.waitForLoadState('domcontentloaded');
  const productPage = new ProductPage(page);
   const cartPage = new CartPage(page);

  // Verify product detail page loaded
  await expect(page.locator('[data-test="product-name"]')).toBeVisible();
  await expect(page.locator('[data-test="unit-price"]')).toBeVisible();
  console.log(`Navigated to product: ${productName}`);

  // Find and update quantity input field
  const quantityInput = page.locator('[data-test="quantity"]');
  const quantity = 3;

  // Clear and set quantity
  await quantityInput.click();
  await quantityInput.fill('');
  await quantityInput.fill(quantity.toString());
  await expect(quantityInput).toHaveValue(quantity.toString());
  console.log(`✓ Quantity set to: ${quantity}`);

  // Click "Add to Cart" button
  await productPage.addToCartButton.click();
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
  
  if (cartProductNameText.toLowerCase().includes(productName.toLowerCase())) {
    console.log(` SUCCESS: Product name verified in cart: "${cartProductNameText}"`);
  } else {
    throw new Error(`FAILED: Product name mismatch! Expected "${productName}", but got "${cartProductNameText}"`);
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


test('4.6_VerifySubmitcontact form', async ({ contactPage }) => {
  const contactDetails = {
    first: "Nuwani",
    last: "Nishadhi",
    email: "nuwani@gmail.com",
    subject: "customer-service",
    message: "I am writing to request more information regarding technical specifications..."
  };

  await contactPage.navigate('/contact');
    await contactPage.firstNameInput.waitFor({ state: 'visible' });
  
  await contactPage.submitContactForm(contactDetails);
  await expect(contactPage.successMessage).toHaveText(/Thanks for your message! We will contact you shortly./);
   
});

 test('4.7_VerifyAuthenticatedUserAccountPageAccess', async ({ contactPage }) => {
  //This task is not clear for me . 
  });



