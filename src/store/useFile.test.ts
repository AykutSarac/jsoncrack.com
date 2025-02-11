import { FileFormat } from "src/enums/file.enum";
import { contentToJson, jsonToContent } from "src/lib/utils/jsonAdapter";
import { jest } from "@jest/globals";
import useFile from "./useFile";
import useJson from "./useJson";
import { event as gaEvent } from "nextjs-google-analytics";
import useGraph from "src/containers/Editor/components/views/GraphView/stores/useGraph";

test("setFormat clears content on conversion error", async () => {
  /**
   * This test simulates a conversion error in setFormat by forcing contentToJson to reject.
   * It verifies that when the conversion fails, the store's contents are cleared and a warning is logged.
   */
  const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  const initialContent = '{ "key": "value" }';
  useFile.getState().setContents({ contents: initialContent, hasChanges: false });
  contentToJson.mockImplementationOnce(() => Promise.reject(new Error("Conversion error")));
  await useFile.getState().setFormat(FileFormat.JSON);
  expect(useFile.getState().contents).toEqual("");
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    "The content was unable to be converted, so it was cleared instead."
  );
  consoleWarnSpy.mockRestore();
});

test("setFormat converts contents and updates store format", async () => {
  /**
   * This test verifies that the setFormat method correctly converts the store's contents using the conversion functions
   * and updates the store's format accordingly. It ensures that after conversion, both the format and contents
   * match the expected values.
   */
  const initialContent = useFile.getState().contents;
  const newFormat = "dummyFormat" as unknown as FileFormat;
  await useFile.getState().setFormat(newFormat);
  expect(useFile.getState().format).toBe(newFormat);
  const expectedContents = JSON.stringify(JSON.parse(initialContent), null, 2);
  expect(useFile.getState().contents).toEqual(expectedContents);
});

test("setFile updates file data and triggers GA event", async () => {
  /**
   * This test verifies that calling setFile:
   * - Updates the store's fileData, format, and contents with the provided file data.
   * - Triggers a GA event with the correct parameters.
   */
  const gaEventSpy = jest.spyOn(require("nextjs-google-analytics"), "event").mockImplementation(() => {});

  const testFile = {
    id: "123",
    views: 10,
    owner_email: "owner@example.com",
    name: "Test File",
    content: '{ "test": "data" }',
    private: false,
    format: "JSON",
    created_at: "2023-10-10T00:00:00.000Z",
    updated_at: "2023-10-10T00:00:00.000Z",
  };

  useFile.getState().setFile(testFile);
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(useFile.getState().fileData).toEqual(testFile);
  expect(useFile.getState().format).toEqual(testFile.format);
  expect(useFile.getState().contents).toEqual(testFile.content);
  expect(gaEventSpy).toHaveBeenCalledWith("set_content", { label: testFile.format });
  gaEventSpy.mockRestore();
});

test("fetchUrl updates store contents on successful fetch", async () => {
  /**
   * This test verifies that fetchUrl successfully fetches a JSON document,
   * converts it to a pretty-printed string, updates the store's contents, and updates the useJson state accordingly.
   */
  const fakeJson = { test: "data", number: 100 };
  const expectedJsonStr = JSON.stringify(fakeJson, null, 2);
  const fakeResponse = { json: jest.fn().mockResolvedValue(fakeJson) };
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue(fakeResponse);
  const useJsonSetStateSpy = jest.spyOn(useJson, "setState");
  await useFile.getState().fetchUrl("http://dummyurl.com");
  expect(useFile.getState().contents).toEqual(expectedJsonStr);
  expect(useJsonSetStateSpy).toHaveBeenCalledWith({ json: expectedJsonStr, loading: false });
  global.fetch = originalFetch;
  useJsonSetStateSpy.mockRestore();
});

test("checkEditorSession loads sessionStorage content when session exists and widget flag is false, otherwise loads default JSON", () => {
  /**
   * This test validates that checkEditorSession:
   * - Loads the sessionStorage values for content and format when a session exists and widget flag is false.
   * - Otherwise, if no session exists or widget is true, it resets the store with the default JSON.
   */
  sessionStorage.setItem("content", "sessionContent");
  sessionStorage.setItem("format", "sessionFormat");
  useFile.getState().checkEditorSession("not a url", false);
  expect(useFile.getState().contents).toEqual("sessionContent");
  expect(useFile.getState().format).toEqual("sessionFormat");

  sessionStorage.removeItem("content");
  sessionStorage.removeItem("format");

  const expectedDefault = JSON.stringify(
    {
      squadName: "Super hero squad",
      homeTown: "Metro City",
      formed: 2016,
      secretBase: "Super tower",
      active: true,
      members: [
        {
          name: "Molecule Man",
          age: 29,
          secretIdentity: "Dan Jukes",
          powers: ["Radiation resistance", "Turning tiny", "Radiation blast"],
        },
        {
          name: "Madame Uppercut",
          age: 39,
          secretIdentity: "Jane Wilson",
          powers: [
            "Million tonne punch",
            "Damage resistance",
            "Superhuman reflexes",
          ],
        },
        {
          name: "Eternal Flame",
          age: 1000000,
          secretIdentity: "Unknown",
          powers: [
            "Immortality",
            "Heat Immunity",
            "Inferno",
            "Teleportation",
            "Interdimensional travel",
          ],
        },
      ],
    },
    null,
    2
  );

  useFile.getState().checkEditorSession(undefined, true);
  expect(useFile.getState().contents).toEqual(expectedDefault);
  expect(useFile.getState().hasChanges).toEqual(false);
});

test("setContents handles conversion error from contentToJson and sets error accordingly", async () => {
  /**
   * This test verifies that when contentToJson throws an error with a mark.snippet,
   * the setContents method catches the error, sets the error state accordingly,
   * and ensures that both useJson and useGraph loading flags are set to false.
   */
  const errorSnippet = "Snippet error detail";
  const conversionError = new Error("Conversion failed");
  (conversionError as any).mark = { snippet: errorSnippet };
  contentToJson.mockImplementationOnce(() => Promise.reject(conversionError));
  const useJsonSetStateSpy = jest.spyOn(useJson, "setState");
  const useGraphSetStateSpy = jest.spyOn(useGraph, "setState");
  await useFile.getState().setContents({ contents: "invalid content", hasChanges: true });
  expect(useFile.getState().error).toEqual(errorSnippet);
  expect(useJsonSetStateSpy).toHaveBeenCalledWith({ loading: false });
  expect(useGraphSetStateSpy).toHaveBeenCalledWith({ loading: false });
  if (contentToJson.mockRestore) contentToJson.mockRestore();
  useJsonSetStateSpy.mockRestore();
  useGraphSetStateSpy.mockRestore();
});

test("clear resets store contents and calls useJson.clear", () => {
  /**
   * This test verifies that the clear method resets the store's contents to an empty string
   * and calls the clear method of useJson state.
   */
  useFile.getState().setContents({ contents: "non empty content", hasChanges: true });
  const clearSpy = jest.spyOn(useJson.getState(), "clear").mockImplementation(() => {});
  useFile.getState().clear();
  expect(useFile.getState().contents).toEqual("");
  expect(clearSpy).toHaveBeenCalled();
  clearSpy.mockRestore();
});
