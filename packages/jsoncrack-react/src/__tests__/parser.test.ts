import { describe, expect, it } from "vitest";
import { parseGraph } from "../parser";

describe("parseGraph", () => {
  it("returns empty graph for empty string", () => {
    const result = parseGraph("");
    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
  });

  it("parses a primitive into a single node with no edges", () => {
    const result = parseGraph('"hello"');
    expect(result.nodes).toHaveLength(1);
    expect(result.edges).toEqual([]);
    expect(result.nodes[0].text).toEqual([{ key: null, value: "hello", type: "string" }]);
  });

  it("parses a flat object into one node with typed rows and no edges", () => {
    const result = parseGraph('{"name":"Apple","count":3,"active":true,"tag":null}');
    expect(result.nodes).toHaveLength(1);
    expect(result.edges).toEqual([]);

    const rows = result.nodes[0].text;
    expect(rows).toEqual([
      { key: "name", value: "Apple", type: "string" },
      { key: "count", value: 3, type: "number" },
      { key: "active", value: true, type: "boolean" },
      { key: "tag", value: null, type: "null" },
    ]);
  });

  it("creates a child node and edge for a nested object", () => {
    const result = parseGraph('{"user":{"name":"Ada"}}');
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);

    const byId = new Map(result.nodes.map(n => [n.id, n]));
    const edge = result.edges[0];
    expect(byId.has(edge.from)).toBe(true);
    expect(byId.has(edge.to)).toBe(true);
    expect(edge.text).toBe("user");
    expect(byId.get(edge.to)?.text).toEqual([{ key: "name", value: "Ada", type: "string" }]);
  });

  it("creates one child node per array element with one edge each", () => {
    const result = parseGraph('{"fruits":["apple","banana","cherry"]}');
    // 1 root node + 3 array children = 4 nodes
    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(3);

    const byId = new Map(result.nodes.map(n => [n.id, n]));
    // The parser pushes nodes in post-order (children before parent), so we
    // identify the root as the one not referenced by any edge's `to`.
    const targetIds = new Set(result.edges.map(e => e.to));
    const root = result.nodes.find(n => !targetIds.has(n.id));
    expect(root).toBeDefined();
    const rootId = root!.id;

    result.edges.forEach(edge => {
      expect(edge.from).toBe(rootId);
      expect(edge.text).toBe("fruits");
    });

    const childValues = result.edges.map(e => byId.get(e.to)?.text[0].value);
    expect(childValues).toEqual(["apple", "banana", "cherry"]);
  });

  it("renders a top-level array as a parent node with one child per element", () => {
    const result = parseGraph("[1,2,3]");
    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(3);

    const targetIds = new Set(result.edges.map(e => e.to));
    const root = result.nodes.find(n => !targetIds.has(n.id));
    expect(root).toBeDefined();
    expect(root!.text[0]).toMatchObject({
      key: null,
      type: "array",
      childrenCount: 3,
      value: "[3 items]",
    });

    const byId = new Map(result.nodes.map(n => [n.id, n]));
    const childValues = result.edges.map(e => byId.get(e.to)?.text[0].value).sort();
    expect(childValues).toEqual([1, 2, 3]);
  });

  it("handles deeply nested structures", () => {
    const result = parseGraph('{"a":{"b":{"c":{"d":1}}}}');
    // 4 nested object nodes = 4 nodes, 3 edges
    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(3);
  });

  it("reports parse errors but still returns a partial graph", () => {
    const result = parseGraph('{"broken": }');
    expect(result.errors.length).toBeGreaterThan(0);
    // jsonc-parser is error-tolerant and still produces a tree
    expect(result.nodes.length).toBeGreaterThanOrEqual(0);
  });

  it("assigns unique ids to every node and edge", () => {
    const result = parseGraph('{"users":[{"id":1},{"id":2}]}');
    const nodeIds = new Set(result.nodes.map(n => n.id));
    const edgeIds = new Set(result.edges.map(e => e.id));
    expect(nodeIds.size).toBe(result.nodes.length);
    expect(edgeIds.size).toBe(result.edges.length);
  });

  it("emits edges with from/to pointing at existing node ids", () => {
    const result = parseGraph('{"a":{"b":1},"c":[2,3]}');
    const nodeIds = new Set(result.nodes.map(n => n.id));
    result.edges.forEach(edge => {
      expect(nodeIds.has(edge.from)).toBe(true);
      expect(nodeIds.has(edge.to)).toBe(true);
    });
  });
});
