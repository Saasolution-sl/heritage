import { test, expect, type Page } from '@playwright/test';

const confirmAge = async (page: Page) =>
  page.addInitScript(() => localStorage.setItem('hc-access', JSON.stringify({ at: Date.now(), country: null })));

test.describe('trade gate without a detected country', () => {
  test('applies the default minimum age and remembers the confirmation', async ({ page }) => {
    await page.goto('/');
    const gate = page.getByRole('dialog', { name: /for the tobacco trade/i });
    await expect(gate).toBeVisible();
    await expect(gate.getByText('Minimum age applied: 21')).toBeVisible();
    const confirm = page.getByRole('button', { name: 'I am 21+ and work in the trade' });
    await expect(confirm).toBeFocused();
    await confirm.click();
    await expect(gate).toBeHidden();
    await page.reload();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('the visitor can choose their country', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Country').selectOption('PY');
    await expect(page.getByText('Minimum age in Paraguay: 18')).toBeVisible();
    await expect(page.getByRole('button', { name: 'I am 18+ and work in the trade' })).toBeVisible();
  });

  test('declining keeps the site closed', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'I am not' }).click();
    await expect(page.getByRole('heading', { name: /website is for the trade/i })).toBeVisible();
  });
});

test.describe('trade gate in Spain', () => {
  test.use({ extraHTTPHeaders: { 'x-vercel-ip-country': 'ES' } });

  test('detects the country and applies its minimum age', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('Country')).toHaveValue('ES');
    await expect(page.getByText('Minimum age in Spain: 18')).toBeVisible();
    await page.getByRole('button', { name: 'I am 18+ and work in the trade' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('trade gate in the United States', () => {
  test.use({ extraHTTPHeaders: { 'cf-ipcountry': 'US' } });

  test('asks again when the visitor confirmed for another country', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('hc-access', JSON.stringify({ at: Date.now(), country: 'ES' })));
    await page.goto('/');
    await expect(page.getByText('Minimum age in United States: 21')).toBeVisible();
  });
});

test.describe('with trade access confirmed', () => {
  test.beforeEach(async ({ page }) => confirmAge(page));

  test('homepage hero, CTAs and twelve collection cards', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/A Collection of Empires/);
    await expect(page.getByRole('link', { name: 'Explore the Collection' })).toHaveAttribute('href', '/collections/');
    await expect(page.getByRole('link', { name: 'Discover Our Heritage' })).toHaveAttribute('href', '/heritage/');
    await expect(page.locator('#collections .card')).toHaveCount(12);
    expect(errors).toEqual([]);
  });

  test('every collection card opens its collection, and on to the product', async ({ page }) => {
    await page.goto('/collections/');
    await page.locator('.card', { hasText: 'Saadian' }).click();
    await expect(page).toHaveURL(/\/collections\/saadian\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Saadian');
    await page.getByRole('link', { name: /View the Robusto/ }).click();
    await expect(page).toHaveURL(/\/cigars\/saadian-robusto\/$/);
    await expect(page.getByRole('table')).toContainText('Latin American');
    await expect(page.getByText('In development. Not yet available for trade orders.')).toBeVisible();
    await expect(page.getByRole('table')).toContainText('Parejo, box-pressed');
  });

  test('collections page shows all twelve formats to scale', async ({ page }) => {
    await page.goto('/collections/');
    await expect(page.locator('.formats li')).toHaveCount(12);
    await expect(page.locator('.formats')).toContainText('Salomón');
  });

  test('product gallery switches images', async ({ page }) => {
    await page.goto('/cigars/caesar-robusto/');
    const stage = page.locator('.gallery__stage img');
    await expect(stage).toHaveAttribute('src', /caesar-robusto\.svg$/);
    await page.getByRole('button', { name: /band artwork/i }).click();
    await expect(stage).toHaveAttribute('src', /caesar-band\.svg$/);
    await expect(page.getByRole('button', { name: /band artwork/i })).toHaveAttribute('aria-pressed', 'true');
  });

  test('search finds collections and journal entries', async ({ page }) => {
    await page.goto('/search/?q=zellige');
    const results = page.locator('.search-results');
    await expect(results.getByRole('link', { name: /Saadian collection/ })).toBeVisible();
    await page.getByLabel('Search collections and journal').fill('humidity');
    await expect(results.getByRole('link', { name: /Storing cigars/ })).toBeVisible();
  });

  test('cookie page shows and clears stored preference', async ({ page }) => {
    await page.goto('/legal/cookies/');
    await expect(page.getByText(/trade-access confirmation stored/)).toBeVisible();
    await page.getByRole('button', { name: 'Clear stored preferences' }).click();
    await expect(page.getByText('nothing is stored.')).toBeVisible();
  });

  test('unknown routes show the branded 404', async ({ page }) => {
    const res = await page.goto('/no-such-empire/');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /lost to history/i })).toBeVisible();
  });

  test('main navigation works on this viewport', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.locator('#mobile-menu').getByRole('link', { name: 'Craftsmanship' }).click();
    } else {
      await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Craftsmanship' }).click();
    }
    await expect(page).toHaveURL(/\/craftsmanship\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('no horizontal overflow on key pages', async ({ page }) => {
    for (const path of ['/', '/collections/', '/collections/saadian/', '/cigars/imperator-salomon/', '/brand/', '/journal/understanding-vitolas/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
