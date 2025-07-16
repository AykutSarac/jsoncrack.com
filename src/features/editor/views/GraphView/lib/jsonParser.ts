/**
 * Copyright (c) JSON Crack
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { parseTree, getNodePath, type Node } from "jsonc-parser";
import type { EdgeData, NodeData, NodeRow } from "../../../../../types/graph";
import { calculateNodeSize } from "./utils/calculateNodeSize";

export type Graph = {
  nodes: NodeData[];
  edges: EdgeData[];
};

export const parser = (json: string): Graph => {
  const jsonTree = parseTree(json);
  if (!jsonTree) return { nodes: [], edges: [] };

  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];
  let nodeId = 1;
  let edgeId = 1;

  function traverse(node: Node, parentId?: string) {
    const id = String(nodeId++);
    const text: NodeRow[] = [];

    // If parentId is provided, create an edge from parentId to the current node id
    if (parentId !== undefined && node.parent?.type === "array") {
      edges.push({
        id: String(edgeId++),
        from: parentId,
        to: id,
        text: "",
      });
    }

    const isArray = node.type === "array";
    const isRootArray = !node.parent || node.parent.type === "array";
    if (isArray && isRootArray) {
      const { width, height } = calculateNodeSize(`[${node.children?.length ?? "0"} items]`);
      nodes.push({
        id,
        text: [
          {
            key: null,
            value: `[${node.children?.length ?? 0} items]`,
            type: "array",
            childrenCount: node.children?.length,
          },
        ],
        width,
        height,
        path: [],
      });

      node.children?.forEach(child => {
        traverse(child, id);
      });

      return id;
    }

    node.children?.forEach(child => {
      if (!child.children || !child.children[1]) return traverse(child, id);

      const key = child.children[0].value ?? null;
      const valueNode = child.children[1];
      const type = valueNode.type;

      if (type === "array") {
        const targetIds: string[] = [];

        valueNode.children?.forEach(arrayChild => {
          const arrayChildId = traverse(arrayChild, undefined);
          if (arrayChildId) targetIds.push(arrayChildId);
        });

        text.push({
          key,
          value: valueNode.value,
          type,
          to: targetIds.length > 0 ? targetIds : undefined,
          childrenCount: valueNode.children?.length,
        });

        targetIds.forEach(targetId => {
          edges.push({
            id: String(edgeId++),
            from: id,
            to: targetId,
            text: key ?? null,
          });
        });
      } else if (type === "object") {
        const objectNodeId = traverse(valueNode, id);
        text.push({
          key,
          value: valueNode.value,
          type,
          childrenCount: Object.keys(valueNode.children ?? {}).length,
          ...(objectNodeId && { to: [objectNodeId] }),
        });

        if (objectNodeId) {
          edges.push({
            id: String(edgeId++),
            from: id,
            to: objectNodeId,
            text: key ?? null,
          });
        }
      } else {
        text.push({
          key,
          value: valueNode.value,
          type,
        });
      }
    });

    // to handle case where empty object inside array [{}]
    if (node.parent?.type === "array" && node.type === "object" && node.children?.length === 0) {
      text.push({
        key: null,
        value: "{0 keys}",
        type: "object",
        childrenCount: 0,
      });
    }

    const appendParentKey = () => {
      const getParentKey = (targetNode: any) => {
        const path = getNodePath(targetNode);
        return path?.pop()?.toString();
      };

      if (!node.parent) {
        return { parentKey: getParentKey(node), parentType: node.type };
      }

      if (node.parent.type === "array") {
        return { parentKey: getParentKey(node.parent), parentType: "array" };
      }

      if (node.parent.type === "property") {
        return { parentKey: getParentKey(node), parentType: "object" };
      }

      return {
        parentKey: getParentKey(node),
        parentType: node.parent.type.replace("property", "object"),
      };
    };

    // its for singular text like string, number, boolean, null
    if (text.length === 0) {
      if (typeof node.value === "undefined") return;
      const { width, height } = calculateNodeSize(node.value);

      nodes.push({
        id,
        text: [
          {
            key: null,
            value: node.value,
            type: node.type,
          },
        ],
        width,
        height,
        path: getNodePath(node),
        ...appendParentKey(),
      });
    } else {
      let t: string | [string, string][] = "";

      if (text.some(t => t.key !== null)) {
        t = text.map(t => {
          const keyStr = t.key === null ? "" : t.key;
          if (t.type === "object") return [keyStr, `{${t.childrenCount ?? 0} keys}`];
          if (t.type === "array") return [keyStr, `[${t.childrenCount ?? 0} items]`];
          if (t.value === null) return [keyStr, "null"];

          return [keyStr, `${t.value}`];
        });
      } else {
        t = `${text[0].value}`;
      }

      const { width, height } = calculateNodeSize(t);
      nodes.push({
        id,
        text,
        width,
        height,
        path: getNodePath(node),
        ...appendParentKey(),
      });
    }

    return id; // Return the current id for referencing in the parent node
  }

  traverse(jsonTree);
  return { nodes, edges };
};
