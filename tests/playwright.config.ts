/// <reference types="node" />
import { defineConfig } from '@playwright/test';
import * as path from 'path';

export default defineConfig({
  testDir: './e2e',

  // Run tests in parallel — each test file runs in its own worker
  fullyParallel: true,

  // Fail the CI pipeline immediately if any test.only was accidentally committed
  forbidOnly: !!process.env.CI,

  // Retry failed tests once in CI (flakiness buffer), never locally
  retries: process.env.CI ? 1 : 0,

  // One worker in CI to avoid race conditions on the shared database
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // Automatically start backend and frontend before running tests.
  // In local dev, reuses already-running servers (so you don't need to restart).
  // In CI, always starts fresh.
  webServer: [
    {
      command: 'npm run dev',
      cwd: path.join(__dirname, '../backend'),
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      cwd: path.join(__dirname, '../frontend'),
      port: 5173,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
