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


