// @ts-check
const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config({ path: require("path").join(__dirname, ".env") });

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 1,
  workers: 1,
  timeout: 120000,
  expect: { timeout: 20000 },
  reporter: [
    ["list"],
    ["html", { outputFolder: "execution-reports/html", open: "never" }],
    ["json", { outputFile: "execution-reports/results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "https://practicesoftwaretesting.com",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    testIdAttribute: "data-test",
    ignoreHTTPSErrors: true,
    ...devices["Desktop Chrome"],
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
