import { beforeEach, describe, expect, test } from "@jest/globals";
import { waitFor } from "@testing-library/react";

import useFile from "../store/useFile";
import useJson from "../store/useJson";
import { FileFormat } from "../enums/file.enum";
import jsonToGo from "../lib/utils/json2go";        

// Reset the singelton Stores before each test
beforeEach(() => {
  useJson.setState({ json: "{}", loading: true });
  useFile.setState({ contents: "", format: FileFormat.JSON, hasChanges: false, error: null });
  sessionStorage.clear();
});


// Stefan Czepl
describe("useFile integration", () => {
  test("setContents pushes parsed JSON into the useJson store", async () => {
    // Arrange
    const contents = '{"name": "John", "age": 30}';

    // Act
    useFile.getState().setContents({ contents });

    // Assert, we need to wait because we have a debounce of 400ms 
    await waitFor(
      () => {
        expect(useJson.getState().getJson()).toContain("John");
      },
      { timeout: 2000 }
    );
    expect(JSON.parse(useJson.getState().getJson())).toEqual({ name: "John", age: 30 });
  });

  test("setFormat converts the contents from JSON to YAML", async () => {
    // Arrange
    useFile.setState({ contents: '{"name": "John", "age": 30}', format: FileFormat.JSON });

    // Act
    await useFile.getState().setFormat(FileFormat.YAML);

    // Assert
    expect(useFile.getState().getFormat()).toBe(FileFormat.YAML);
    const yaml = useFile.getState().getContents();
    expect(yaml).toContain("name: John");
    expect(yaml).toContain("age: 30");
  });

  test("clear empties both the useFile contents and the useJson store", () => {
    // Arrange
    useFile.setState({ contents: '{"a": 1}' });
    useJson.setState({ json: '{"a": 1}' });

    // Act
    useFile.getState().clear();

    // Assert
    expect(useFile.getState().getContents()).toBe("");
    expect(useJson.getState().json).toBe("");
  });

  test("setCotent with json typgens correct Go types", async () => {
      // Arrange
      await useFile.getState().setContents({ contents: '{"name": "John", "age": 30}' });

      // Act - read from useFile (set synchronously); useJson lags 400ms behind (debounce)
      const result = jsonToGo(useFile.getState().getContents(), "Person");

      // Expect
      expect(result.error).toBeFalsy();
      expect(result.go).toContain("type Person struct");
      expect(result.go).toContain("Name string");
      expect(result.go).toContain("Age int");
  });
});
