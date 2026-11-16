require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');
const baseURL = (process.env.BASE_URL || 'https://ebaa.com').replace(/\/$/, '');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [ ['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }], ['json', { outputFile: 'test-results/results.json' }] ],
  use: {
    baseURL,
    ignoreHTTPSErrors: false,
    navigationTimeout: 30000,
    actionTimeout: 10000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testMatch: /responsive\.spec\.js/, use: { ...devices['iPhone 13'] } }
  ]
});
