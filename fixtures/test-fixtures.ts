/*fixtures Content --
    - homePage: HomePage instance (navigates to home)
    - loginPage: LoginPage instance (navigates to login)
    - authenticatedPage: HomePage instance (already logged in!)
    - contactPage: ContactPage instance (navigates to contact)
    - cartPage: CartPage instance*/

    
import { readFileSync } from 'fs';
import path from 'path';
import { test as base, expect, type Page } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductPage } from '../src/pages/ProductPage';
import { ContactPage } from '../src/pages/ContactPage';
import { CartPage } from '../src/pages/CartPage';


type UsersData = {
  validCustomer: { email: string; password: string };
};

//const usersDataPath = path.join(__dirname, '..', 'test-data', 'users.json');
//const users = JSON.parse(readFileSync(usersDataPath, 'utf-8')) as UsersData;


type Fixtures = {
 homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  contactPage: ContactPage;

  cartPage: CartPage;
  page: Page;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.navigate('/');
    await use(homePage);

    // --- TEARDOWN ---
    // This code runs AFTER the test finishes
    console.log('Teardown: Cleaning up session or cookies...');
    await page.context().clearCookies();

  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate('/auth/login');
    await use(loginPage);

     // --- TEARDOWN ---
    // This code runs AFTER the test finishes
    console.log('Teardown: Cleaning up session or cookies...');
    await page.context().clearCookies();
  },

  productPage: async ({ page }, use) => {
   
    const productPage = new ProductPage(page); 
    await productPage.navigate('/'); 
    await use(productPage);

    // --- TEARDOWN ---
    console.log('Teardown: Cleaning up session or cookies...');
    await page.context().clearCookies();
},

 cartPage: async ({ page }, use) => {
   
    const cartPage = new CartPage(page); 
    await cartPage.navigate('/'); 
    await use(cartPage);

    // --- TEARDOWN ---
    console.log('Teardown: Cleaning up session or cookies...');
    await page.context().clearCookies();
},
  

  });
  export { expect } from '@playwright/test';
//export { expect,users } from '@playwright/test';