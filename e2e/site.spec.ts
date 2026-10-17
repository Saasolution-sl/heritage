import { test, expect, type Page } from '@playwright/test';

const confirmAge = async (page: Page) => page.addInitScript(() => localStorage.setItem('ec-age-confirmed', String(Date.now())));

test('age gate blocks until confirmed, then remembers', async ({ page }) => {
  await page.goto('/');
  const gate = page.getByRole('dialog', { name: /legal smoking age/i });
  await expect(gate).toBeVisible();
  await expect(page.getByRole('button', { name: /I am 21 or over/i })).toBeFocused();
  await page.getByRole('button', { name: /I am 21 or over/i }).click();
  await expect(gate).toBeHidden();
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('declining the age gate keeps the site closed', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'No' }).click();
  await expect(page.getByRole('heading', { name: /cannot enter/i })).toBeVisible();
});

test.describe('with age confirmed', () => {
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
    await page.getByRole('link', { name: /View the Belicoso/ }).click();
    await expect(page).toHaveURL(/\/cigars\/saadian-belicoso\/$/);
    await expect(page.getByRole('table')).toContainText('To be confirmed by the manufacturer');
    await expect(page.getByText('Design concept. Not yet produced or offered for sale.')).toBeVisible();
  });

  test('product gallery switches images', async ({ page }) => {
    await page.goto('/cigars/caesar-toro/');
    const stage = page.locator('.gallery__stage img');
    await expect(stage).toHaveAttribute('src', /caesar-toro\.svg$/);
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
    await expect(page.getByText(/age confirmation stored/)).toBeVisible();
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
    for (const path of ['/', '/collections/', '/collections/saadian/', '/cigars/imperator-double-corona/', '/brand/', '/journal/understanding-vitolas/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
