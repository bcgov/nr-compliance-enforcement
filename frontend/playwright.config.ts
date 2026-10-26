/// <reference types="node" />
import { defineConfig, devices, Project } from "@playwright/test";
import dotenv from "dotenv";
import { randomInt } from "node:crypto";

dotenv.config();
const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";

/* Device projects the tests can run against. Each run uses one of them (see below). */
const deviceProjects: Record<string, Project> = {
  safari: {
    name: "safari",
    use: {
      ...devices["Desktop Safari"],
      baseURL: baseURL,
    },
    dependencies: ["setup"],
    testMatch: /.{0,5}\.(spec|test)\.ts/,
  },
  ipad: {
    name: "ipad",
    use: {
      ...devices["iPad Pro 11"],
      baseURL: baseURL,
    },
    dependencies: ["setup"],
    testMatch: /.{0,5}\.(spec|test)\.ts/,
  },
  chrome: {
    name: "Google Chrome",
    use: {
      ...devices["Desktop Chrome"],
      channel: "chrome",
      baseURL: baseURL,
    },
    dependencies: ["setup"],
    testMatch: /.{0,5}\.(spec|test)\.ts/,
  },
};

/*
 * Pick the device for this run: E2E_DEVICE if set (e.g. to reproduce a failure), otherwise a random one.
 * The choice is stored back in E2E_DEVICE so the worker processes, which reload this config,
 * use the same device as the main process.
 */
if (!process.env.E2E_DEVICE) {
  const deviceNames = Object.keys(deviceProjects);
  process.env.E2E_DEVICE = deviceNames[randomInt(deviceNames.length)];
  console.log(`E2E device for this run: ${process.env.E2E_DEVICE}`);
}

const selectedDeviceProject = deviceProjects[process.env.E2E_DEVICE];
if (!selectedDeviceProject) {
  throw new Error(
    `Unknown E2E_DEVICE "${process.env.E2E_DEVICE}". Expected one of: ${Object.keys(deviceProjects).join(", ")}`,
  );
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  workers: 6,
  timeout: 300000, // 5 minutes for a test (longest ones run 2.5 minutes normally)
  expect: {
    timeout: 30000, // 30 seconds for an expect statement to resolve.
  },
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["line"], ["list", { printSteps: true }], ["html", { open: "always" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /.{0,5}\.setup\.ts/,
      /* Proxy HTTPS traffic through the BC Gov proxy for auth */
      use: {
        ...(process.env.E2E_HTTPS_PROXY && {
          proxy: {
            server: process.env.E2E_HTTPS_PROXY,
            bypass: "localhost,127.0.0.1,*loginproxy*,*natsuite*",
          },
        }),
      },
    },
    // {
    //   name: "chromium",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     baseURL: baseURL,
    //   },
    //   dependencies: ["setup"],
    //   testMatch: /.{0,5}\.(spec|test)\.ts/,
    // },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     baseURL: baseURL,
    //   },
    //   dependencies: ['setup'],
    //   testMatch: /.{0,5}\.(spec|test)\.ts/,
    // },
    selectedDeviceProject,
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //     baseURL: baseURL,
    //   },
    //   dependencies: ['setup'],
    //   testMatch: /.{0,5}\.(spec|test)\.ts/,
    // },
  ],
});
