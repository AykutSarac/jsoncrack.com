import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import toast from "react-hot-toast";
import { FileFormat } from "../enums/file.enum";
import useJsonQuery from "../hooks/useJsonQuery";
import useFile from "../store/useFile";
import useJson from "../store/useJson";

// mock functions we use
const mockJqJson = jest.fn<(obj: unknown, query: string) => Promise<unknown>>();
const mockTypegenRun = jest.fn<(name: string, value: string, opts: string) => string>();

// replace wasm with a mock
jest.mock("jq-web", () => ({
  __esModule: true,
  default: { promised: { json: mockJqJson } },
  promised: { json: mockJqJson },
}));
// replace wasm with a mock
jest.mock(
  "json_typegen_wasm",
  () => ({ __esModule: true, run: mockTypegenRun, default: { run: mockTypegenRun } }),
  { virtual: true }
);

let toastError: ReturnType<typeof jest.spyOn>;

// reset the mocks, add spy for toastError, reset useJson and useFile and clear the sessionStorage
beforeEach(() => {
  jest.clearAllMocks();
  toastError = jest.spyOn(toast, "error").mockImplementation(() => "toast-id");
  useJson.setState({ json: "{}", loading: true });
  useFile.setState({ contents: "", format: FileFormat.JSON, hasChanges: false, error: null });
  sessionStorage.clear();
});

// reset the toast errors we we start clean for each test
afterEach(() => {
  toastError.mockRestore();
});

// Fabian Eberhardt
describe("useJsonQuery integration tests", () => {
  describe("updateJson tests", () => {
    test("runs a jq query against the useJson store and writes the result into useFile test", async () => {
      // Arrange
      // set valid json
      useJson.setState({ json: '{"a":[1,2,3]}', loading: false });
      // add mock response
      mockJqJson.mockResolvedValue(3);
      const onDone = jest.fn();
      const { result } = renderHook(() => useJsonQuery());

      // Act
      await act(async () => {
        await result.current.updateJson(".a | length", onDone);
      });

      // Assert
      expect(mockJqJson).toHaveBeenCalledWith({ a: [1, 2, 3] }, ".a | length");
      expect(useFile.getState().getContents()).toBe("3");
      expect(onDone).toHaveBeenCalledTimes(1);
    });

    test("shows a toast and skips the callback when the jq query fails test", async () => {
      // Arrange
      // add valid json
      useJson.setState({ json: '{"a":1}', loading: false });
      // mock that it returns error
      mockJqJson.mockRejectedValue(new Error("invalid query"));
      const onDone = jest.fn();
      const { result } = renderHook(() => useJsonQuery());

      // Act
      await act(async () => {
        await result.current.updateJson(".nope |", onDone);
      });

      // Assert
      // error toast shown, callback skipped, useFile not changed
      expect(toastError).toHaveBeenCalledWith("Unable to process the request.");
      expect(onDone).toHaveBeenCalledTimes(0);
      expect(useFile.getState().getContents()).toBe("");
    });

    test("never reaches jq and reports an error when the store holds malformed json test", async () => {
      // Arrange
      // add invalid json
      useJson.setState({ json: "{ not valid json", loading: false });
      const { result } = renderHook(() => useJsonQuery());

      // Act
      await act(async () => {
        await result.current.updateJson(".a");
      });

      // Assert
      // check if we got an error
      expect(mockJqJson).toHaveBeenCalledTimes(0);
      expect(toastError).toHaveBeenCalledWith("Unable to process the request.");
    });
  });

  describe("getJsonType tests", () => {
    test("generates types from the current useJson contents via json_typegen_wasm test", async () => {
      // Arrange
      // add json
      useJson.setState({ json: '{"id":1,"name":"x"}', loading: false });
      // set mock return value
      mockTypegenRun.mockReturnValue("export type Root = { id: number; name: string };");
      // call useJsonQuery hook
      const { result } = renderHook(() => useJsonQuery());

      // Act
      let types: string | undefined;
      await act(async () => {
        types = await result.current.getJsonType();
      });

      // Assert
      // should have been called with the following things:
      expect(mockTypegenRun).toHaveBeenCalledWith(
        "Root",
        '{"id":1,"name":"x"}',
        JSON.stringify({ output_mode: "typescript/typealias" })
      );
      // check result
      expect(types).toContain("Root");
    });
  });
});