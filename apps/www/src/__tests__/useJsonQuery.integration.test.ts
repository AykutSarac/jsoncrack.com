import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import toast from "react-hot-toast";
import { FileFormat } from "../enums/file.enum";
import useJsonQuery from "../hooks/useJsonQuery";
import useFile from "../store/useFile";
import useJson from "../store/useJson";


const mockJqJson = jest.fn<(obj: unknown, query: string) => Promise<unknown>>();
const mockTypegenRun = jest.fn<(name: string, value: string, opts: string) => string>();

jest.mock("jq-web", () => ({
  __esModule: true,
  default: { promised: { json: mockJqJson } },
  promised: { json: mockJqJson },
}));

jest.mock(
  "json_typegen_wasm",
  () => ({ __esModule: true, run: mockTypegenRun, default: { run: mockTypegenRun } }),
  { virtual: true }
);

// `toast` is the real react-hot-toast singleton (same instance the hook imports);
// we spy on `.error` so failures are observable without rendering a <Toaster/>.
let toastError: ReturnType<typeof jest.spyOn>;

// Reset the singleton stores and the boundary mocks before each test.
beforeEach(() => {
  jest.clearAllMocks();
  toastError = jest.spyOn(toast, "error").mockImplementation(() => "toast-id");
  useJson.setState({ json: "{}", loading: true });
  useFile.setState({ contents: "", format: FileFormat.JSON, hasChanges: false, error: null });
  sessionStorage.clear();
});

// reset the mock for each test
afterEach(() => {
  toastError.mockRestore();
});

// Fabian Eberhardt
describe("useJsonQuery integration", () => {
  describe("updateJson", () => {
    test("runs a jq query against the useJson store and writes the result into useFile", async () => {
      // Arrange
      useJson.setState({ json: '{"a":[1,2,3]}', loading: false });
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

    test("shows a toast and skips the callback when the jq query rejects", async () => {
      // Arrange
      useJson.setState({ json: '{"a":1}', loading: false });
      mockJqJson.mockRejectedValue(new Error("invalid query"));
      const onDone = jest.fn();
      const { result } = renderHook(() => useJsonQuery());

      // Act
      await act(async () => {
        await result.current.updateJson(".nope |", onDone);
      });

      // Assert
      expect(toastError).toHaveBeenCalledWith("Unable to process the request.");
      expect(onDone).toHaveBeenCalledTimes(0);
      expect(useFile.getState().getContents()).toBe("");
    });

    test("never reaches jq and reports an error when the store holds malformed JSON", async () => {
      // Arrange
      useJson.setState({ json: "{ not valid json", loading: false });
      const { result } = renderHook(() => useJsonQuery());

      // Act
      await act(async () => {
        await result.current.updateJson(".a");
      });

      // Assert — JSON.parse throws before the jq call is made
      expect(mockJqJson).toHaveBeenCalledTimes(0);
      expect(toastError).toHaveBeenCalledWith("Unable to process the request.");
    });
  });

  describe("getJsonType", () => {
    test("generates types from the current useJson contents via json_typegen_wasm", async () => {
      // Arrange
      useJson.setState({ json: '{"id":1,"name":"x"}', loading: false });
      mockTypegenRun.mockReturnValue("export type Root = { id: number; name: string };");
      const { result } = renderHook(() => useJsonQuery());

      // Act
      let types: string | undefined;
      await act(async () => {
        types = await result.current.getJsonType();
      });

      // Assert — the hook forwards the live JSON string and the typealias option,
      // and passes the module's output straight through.
      expect(mockTypegenRun).toHaveBeenCalledWith(
        "Root",
        '{"id":1,"name":"x"}',
        JSON.stringify({ output_mode: "typescript/typealias" })
      );
      expect(types).toContain("Root");
    });
  });
});
