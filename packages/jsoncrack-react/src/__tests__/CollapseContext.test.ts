import { describe, expect, it } from "vitest";
import { isNodeHidden, pathKey, prunePaths } from "../components/CollapseContext";

describe("pathKey", () => {
  it("serializes a JSONPath to a stable JSON string", () => {
    expect(pathKey([])).toBe("[]");
    expect(pathKey(["users"])).toBe('["users"]');
    expect(pathKey(["users", 0, "address"])).toBe('["users",0,"address"]');
  });

  it("round-trips through JSON.parse", () => {
    const path = ["a", 1, "b"];
    expect(JSON.parse(pathKey(path))).toEqual(path);
  });
});

describe("isNodeHidden", () => {
  it("returns false when no prefixes are collapsed", () => {
    expect(isNodeHidden([], ["users"])).toBe(false);
  });

  it("returns false when nodePath is undefined", () => {
    expect(isNodeHidden([["users"]], undefined)).toBe(false);
  });

  it("hides the node whose path exactly matches a collapsed prefix", () => {
    expect(isNodeHidden([["users"]], ["users"])).toBe(true);
  });

  it("hides descendant nodes", () => {
    expect(isNodeHidden([["users"]], ["users", 0])).toBe(true);
    expect(isNodeHidden([["users"]], ["users", 0, "address"])).toBe(true);
  });

  it("does not hide sibling paths", () => {
    expect(isNodeHidden([["users"]], ["posts"])).toBe(false);
    expect(isNodeHidden([["users"]], ["usersOther"])).toBe(false);
  });

  it("does not hide ancestors of a collapsed path", () => {
    expect(isNodeHidden([["users", 0, "address"]], ["users", 0])).toBe(false);
    expect(isNodeHidden([["users", 0, "address"]], [])).toBe(false);
  });

  it("respects multiple prefixes (OR semantics)", () => {
    const prefixes = [["users"], ["config", "theme"]];
    expect(isNodeHidden(prefixes, ["users", 1])).toBe(true);
    expect(isNodeHidden(prefixes, ["config", "theme", "dark"])).toBe(true);
    expect(isNodeHidden(prefixes, ["config", "locale"])).toBe(false);
  });

  it("distinguishes numeric from string segments at the same position", () => {
    expect(isNodeHidden([[0]], ["0"])).toBe(false);
    expect(isNodeHidden([["0"]], [0])).toBe(false);
  });

  it("never hides the root", () => {
    expect(isNodeHidden([["users"]], [])).toBe(false);
  });
});

describe("prunePaths", () => {
  const json = JSON.stringify({
    users: [{ name: "Alice" }, { name: "Bob" }],
    config: { theme: { mode: "dark" } },
    count: 2,
  });

  it("returns the input verbatim when empty", () => {
    const input: string[] = [];
    expect(prunePaths(json, input)).toEqual([]);
  });

  it("keeps paths resolving to objects", () => {
    const input = [pathKey(["config"]), pathKey(["config", "theme"])];
    expect(prunePaths(json, input)).toEqual(input);
  });

  it("keeps paths resolving to arrays", () => {
    expect(prunePaths(json, [pathKey(["users"])])).toEqual([pathKey(["users"])]);
  });

  it("drops paths resolving to primitives", () => {
    expect(prunePaths(json, [pathKey(["count"])])).toEqual([]);
  });

  it("drops paths resolving to missing keys", () => {
    expect(prunePaths(json, [pathKey(["missing"])])).toEqual([]);
    expect(prunePaths(json, [pathKey(["users", 99, "name"])])).toEqual([]);
  });

  it("drops malformed serialized entries", () => {
    expect(prunePaths(json, ["not-json"])).toEqual([]);
  });

  it("returns input verbatim when JSON is invalid (preserves intent through transient errors)", () => {
    const input = [pathKey(["config"])];
    expect(prunePaths("{ broken", input)).toEqual(input);
  });

  it("keeps only still-valid paths when mixed", () => {
    const input = [pathKey(["config"]), pathKey(["count"]), pathKey(["missing"])];
    expect(prunePaths(json, input)).toEqual([pathKey(["config"])]);
  });
});
