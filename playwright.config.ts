import { defineConfig, devices } from '@playwright/test';

// Browser tests run against the static export in ./out (npm run build first).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: { command: 'node scripts/serve.mjs 4321', url: 'http://127.0.0.1:4321/', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
