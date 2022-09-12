import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // open home page
  await page.goto('/');
  // verify home page title
  await expect(page).toHaveTitle('JSON Crack - Crack your data into pieces');
});

test('home page test', async ({ page }) => {
  // open JSON Crack goals modals
  const buttonGoals = page.locator('button:has-text("Help JSON Crack\'s Goals")');
  await buttonGoals.click();
  // verify modals title
  const modalsTitle = page.locator('h2:has-text("Help JSON Crack\'s Goals")');
  expect(modalsTitle).toBeVisible();
  // close JSON Crack goals modals
  const buttonClose = page.locator('button:has-text("Close")');
  await buttonClose.click();
});
