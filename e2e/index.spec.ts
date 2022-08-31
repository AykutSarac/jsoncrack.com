import { test, expect } from '@playwright/test';

test('homepage test', async ({ page }) => {

  // open homepage
  await page.goto('/');
  //verify homepage title
  await expect(page).toHaveTitle('JSON Crack - Crack your data into pieces');

  // open JSON Crack goals modals
  const buttonGoals = page.locator('button:has-text("Help JSON Crack\'s Goals")');
  await buttonGoals.click();
  // verify modals title
  expect(page.locator('h2:has-text("Help JSON Crack\'s Goals")')).toBeVisible();
  // close JSON Crack goals modals
  const buttonClose = page.locator('button:has-text("Close")');
  await buttonClose.click();

});
