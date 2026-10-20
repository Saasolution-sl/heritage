import { defineConfig, devices } from '@playwright/test';

// Browser tests run against the production build (npm run build first).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: { command: 'npx next start -H 127.0.0.1 -p 4321', url: 'http://127.0.0.1:4321/', reuseExistingServer: false },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
