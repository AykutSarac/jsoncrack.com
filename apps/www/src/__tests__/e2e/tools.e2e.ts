import { test, expect, type Page } from "@playwright/test";
import { JSON_PATH_EXPECTED, JSON_PATH_INPUT, JSON_PATH_QUERY } from "./fixtures/jsonPath";
import { CONFLICTING_SCHEMA, SCHEMA_INPUT } from "./fixtures/jsonSchema";

// helper function for getting all graph nodes
const graphNodes = (page: Page) => page.locator('[data-id^="node-"]');

// helper function for getting the content from the editor
const editorContents = (page: Page) =>
  page.evaluate(() => {
    const model = (window as any).monaco?.editor.getModels()[0];
    return model ? model.getValue(1) : null;
  });

// helper for setting the content of the editor
const setEditorContents = async (page: Page, value: string) => {
  await expect.poll(() => editorContents(page), { timeout: 10_000 }).not.toBeNull();
  await page.evaluate(value => {
    const model = (window as any).monaco.editor.getModels()[0];
    model.setValue(value);
  }, value);
};

// start at the /editor page and skip the default dialog
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/editor");
  await page.getByRole("button", { name: "Stay on JSON Crack" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mantine-Modal-overlay")).toHaveCount(0);
});

test("run a json path that update the editor and also the graph test", async ({ page }) => {
  // add our own json to the editor
  await setEditorContents(page, JSON_PATH_INPUT);

  // check if our json is also displayed in the graph view
  await expect(graphNodes(page).filter({ hasText: "Iron Man" }).first()).toBeVisible();

  // navigate to the json path dialog
  await page.getByRole("button", { name: "Tools", exact: true }).click();
  await page.getByRole("menuitem", { name: "JSON Path" }).click();

  // enter the json path and apply
  await page.getByRole("textbox", { name: "Enter JSON Path..." }).fill(JSON_PATH_QUERY);
  await page.getByRole("button", { name: "Run" }).click();

  // the editor content should have been updated
  await expect.poll(() => editorContents(page), { timeout: 10_000 }).toBe(JSON_PATH_EXPECTED);

  // the old json content should no longer be in the graph view
  await expect(graphNodes(page).filter({ hasText: "Iron Man" })).toHaveCount(0);
  await expect(graphNodes(page).filter({ hasText: "members" })).toHaveCount(0);

  // the names should be in the graph view
  await expect(graphNodes(page).filter({ hasText: "Tony" }).first()).toBeVisible();
  await expect(graphNodes(page).filter({ hasText: "Steve" }).first()).toBeVisible();
  await expect(graphNodes(page).filter({ hasText: "Natasha" }).first()).toBeVisible();
});

test("applying json schema that makes the json in the editor invalid test", async ({ page }) => {
  // add our own json to the editor
  await setEditorContents(page, SCHEMA_INPUT);

  // check that the current json is valid
  await expect(page.getByRole("button", { name: "Valid", exact: true })).toBeVisible({
    timeout: 10_000,
  });

  // navigate to the json schema dialog
  await page.getByRole("button", { name: "Tools", exact: true }).click();
  await page.getByRole("menuitem", { name: "JSON Schema" }).click();

  // in the dialog should be another monaco editor, so there should no be 2
  await expect
    .poll(() => page.evaluate(() => (window as any).monaco?.editor.getModels().length ?? 0))
    .toBe(2);

  // set text of the editor to a new json schema
  await page.evaluate(schema => {
    const models = (window as any).monaco?.editor.getModels() ?? [];
    models[models.length - 1]?.setValue(schema);
  }, CONFLICTING_SCHEMA);

  // apply the json schema
  await page.getByRole("button", { name: "Apply" }).click();

  // now the json in the main editor should be invalid
  await expect(page.getByRole("button", { name: "Invalid", exact: true })).toBeVisible({
    timeout: 10_000,
  });
});
