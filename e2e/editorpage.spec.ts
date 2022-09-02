import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // open editor page
  await page.goto('/editor');
  // verify editor page title
  await expect(page).toHaveTitle('Editor | JSON Crack');
  // verify editor page url
  await expect(page).toHaveURL('/editor');
});

test('editor page test: search data', async ({ page }) => {
  // search data
  const searchBar = page.locator('[placeholder="Search Node"]');
  await searchBar.fill('madame');
  // verify search result
  const searchData = page.locator("(//*[name()='rect'][@class='Node-module_rect__1Eal3'])[8]");
  await searchData.click();
  const searchResult = page.locator('.sc-olbas.hrCqnL');
  await expect(searchResult).toContainText('Madame Uppercut');
  // close modals
  const buttonClose = page.locator('button:has-text("Close")');
  await buttonClose.click();
});
