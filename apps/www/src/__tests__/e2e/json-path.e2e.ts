import { test, expect, type Page } from "@playwright/test";
import { JSON_PATH_EXPECTED, JSON_PATH_INPUT, JSON_PATH_QUERY } from "./fixtures/jsonPath";

// helper function for getting all graph nodes
const graphNodes = (page: Page) => page.locator('[data-id^="node-"]');

// types for the monaco editor
type MonacoModel = { getValue: (eol?: number) => string; setValue: (value: string) => void };
type MonacoGlobal = { editor: { getModels: () => MonacoModel[] } };

// helper function for getting the content of the editor
const editorContents = (page: Page) =>
  page.evaluate(() => {
    const model = (window as unknown as { monaco?: MonacoGlobal }).monaco?.editor.getModels()[0];
    return model ? model.getValue(1) : null;
  });

// helper function for setting the content of the editor
const setEditorContents = (page: Page, value: string) =>
  page.evaluate(
    ({ value }) => {
      const model = (window as unknown as { monaco?: MonacoGlobal }).monaco?.editor.getModels()[0];
      model?.setValue(value);
    },
    { value }
  );
const waitForEditor = (page: Page) =>
  expect.poll(() => editorContents(page), { timeout: 15_000 }).not.toBeNull();

async function dismissIntroModals(page: Page) {
  const overlays = page.locator(".mantine-Modal-overlay");
  await overlays
    .first()
    .waitFor({ timeout: 20_000 })
    .catch(() => {});
  await expect(async () => {
    await page
      .getByRole("button", { name: "Stay on JSON Crack" })
      .click({ timeout: 1_000 })
      .catch(() => {});
    await page.keyboard.press("Escape");
    await expect(overlays).toHaveCount(0, { timeout: 1_000 });
  }).toPass({ timeout: 20_000 });
}

test("runs a JSON Path query from the Tools menu and updates the editor and graph", async ({
  page,
}) => {
  await page.goto("/editor");
  await dismissIntroModals(page);

  await waitForEditor(page);
  await setEditorContents(page, JSON_PATH_INPUT);

  await expect(graphNodes(page).filter({ hasText: "Iron Man" }).first()).toBeVisible();

  await page.getByRole("button", { name: "Tools", exact: true }).click();
  await page.getByRole("menuitem", { name: "JSON Path" }).click();
  await page.getByRole("textbox", { name: "Enter JSON Path..." }).fill(JSON_PATH_QUERY);
  await page.getByRole("button", { name: "Run" }).click();

  await expect.poll(() => editorContents(page), { timeout: 10_000 }).toBe(JSON_PATH_EXPECTED);

  await expect(graphNodes(page).filter({ hasText: "Iron Man" })).toHaveCount(0);
  await expect(graphNodes(page).filter({ hasText: "members" })).toHaveCount(0);
  for (const name of ["Tony", "Steve", "Natasha"]) {
    await expect(graphNodes(page).filter({ hasText: name }).first()).toBeVisible();
  }
});

test("applying a conflicting JSON Schema marks the document invalid", async ({ page }) => {
  await page.goto("/editor");
  await dismissIntroModals(page);

  await expect(page.getByRole("button", { name: "Valid", exact: true })).toBeVisible({
    timeout: 15_000,
  });

  await page.getByRole("button", { name: "Tools", exact: true }).click();
  await page.getByRole("menuitem", { name: "JSON Schema" }).click();
  await page.getByRole("button", { name: "Apply" }).click();

  await expect(page.getByRole("button", { name: "Invalid", exact: true })).toBeVisible({
    timeout: 20_000,
  });
});
