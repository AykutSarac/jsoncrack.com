import { expect, test } from "@playwright/test";

import { SAMPLE_JSON } from "./fixtures/sampleJson";


// Stefan Czepl
test.describe("Editor Page center first Item", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await page.getByRole('link', { name: 'Go to Editor' }).click();
    await page.getByRole('button', { name: 'Stay on JSON Crack' }).click();
    await page.locator('.mantine-focus-auto.mantine-active.m_220c80f2').click();
  });




  test("goes to the editor page and centers the first item", async ({ page }) => {
    await page.getByRole('button', { name: 'center first item' }).click();
    // only the first node should be within the viewport
    await expect(page.locator('#ref-1-node-1 > ._rect_1b6xi_1')).toBeInViewport();
    await expect(page.locator('#ref-1-node-2 > ._rect_1b6xi_1')).not.toBeInViewport();
  });

  test("paste sample JSON and show whole tree", async ({ page }) => {
    // set the sample json as the clipboard content
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(text => navigator.clipboard.writeText(text), SAMPLE_JSON);

    await page.locator('.monaco-editor').first().click();
    // replace the whole content
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+V');

    // root node holds the top-level primitive key/values
    const rootNode = page.locator('#ref-1-node-1');
    await expect(rootNode).toContainText('transactionId: tx_9876543210_alpha');
    await expect(rootNode).toContainText('version: 2.4');
    await expect(rootNode).toContainText('isActive: true');

    // a few representative nested values rendered across the graph
    await expect(page.getByText('username: johndoe_dev')).toBeVisible();
    await expect(page.getByText('john.doe@company.com')).toBeVisible();
    await expect(page.getByText('status: Partially_Shipped')).toBeVisible();
    await expect(page.getByText('name: QuantumBook Pro 15')).toBeVisible();

    // collapsed/summary labels for object & array branches
    await expect(page.getByText('metadata: {3 keys}')).toBeVisible();
    await expect(page.getByText('allowedRoles: [3 items]')).toBeVisible();
  });

  test("collapses a node and hides its children", async ({ page }) => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.evaluate(text => navigator.clipboard.writeText(text), SAMPLE_JSON);
    await page.locator('.monaco-editor').first().click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+V');

    // a nested value is visible while expanded
    await expect(page.getByText('username: johndoe_dev')).toBeVisible();

    // collapse the first branch
    const firstCollapse = page.getByRole('button', { name: 'Collapse' }).first();
    await firstCollapse.click();

    // children are now removed from the graph
    await expect(page.getByText('username: johndoe_dev')).toHaveCount(0);

    // expand again restores them (button label/state toggles)
    await page.getByRole('button', { name: /expand/i }).first().click();
    await expect(page.getByText('username: johndoe_dev')).toBeVisible();
  });


});
