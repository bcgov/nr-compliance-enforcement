/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:5173'
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 120000,
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['line'],
    ['list', { printSteps: true }],
    ['html', { open: 'always' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: baseURL,
      },
      dependencies: ['setup'],
      testMatch: /.*\.(spec|test)\.ts/,
    },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //     baseURL: baseURL,
    //   },
    //   dependencies: ['setup'],
    //   testMatch: /.*\.(spec|test)\.ts/,
    // },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     baseURL: baseURL,
    //   },
    //   dependencies: ['setup'],
    //   testMatch: /.*\.(spec|test)\.ts/,
    // },

    {
      name: 'safari',
      use: {
        ...devices['Desktop Safari'],
        baseURL: baseURL,
      },
      dependencies: ['setup'],
      testMatch: /.*\.(spec|test)\.ts/,
    },
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //     baseURL: baseURL,
    //   },
    //   dependencies: ['setup'],
    //   testMatch: /.*\.(spec|test)\.ts/,
    // },
  ],
})
