import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox', // This name must match exactly what you type in the terminal
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  retries: 1 ,
  
  reporter: 'html',

  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    navigationTimeout: 45000,
    
    launchOptions: {
      headless: false,
      slowMo: 500
    },

    
  },

  

});


