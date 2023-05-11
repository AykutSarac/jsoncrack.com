export function getNodePath(nodes: NodeData[], edges: EdgeData[], nodeId: string) {
  const { getParentsForNodeId } = require("reaflow");

  let resolvedPath = "";
  const parentIds = getParentsForNodeId(nodes, edges, nodeId).map(n => n.id);
  const path = parentIds.reverse().concat(nodeId);
  const rootArrayElementIds = ["1"];
  const edgesMap = new Map();

  for (const edge of edges) {
    if (!edgesMap.has(edge.from!)) {
      edgesMap.set(edge.from!, []);
    }
    edgesMap.get(edge.from!).push(edge.to);
  }

  for (let i = 1; i < edges.length; i++) {
    const curNodeId = edges[i].from!;
    if (rootArrayElementIds.includes(curNodeId)) continue;
    if (!edgesMap.has(curNodeId)) {
      rootArrayElementIds.push(curNodeId);
    }
  }

  if (rootArrayElementIds.length > 1) {
    resolvedPath += `Root[${rootArrayElementIds.findIndex(id => id === path[0])}]`;
  } else {
    resolvedPath += "{Root}";
  }

  for (let i = 1; i < path.length; i++) {
    const curId = path[i];
    const curNode = nodes[+curId - 1];

    if (!curNode) break;
    if (curNode.data.type === "array") {
      resolvedPath += `.${curNode.text}`;

      if (i !== path.length - 1) {
        const toNodeId = path[i + 1];
        const idx = edgesMap.get(curId).indexOf(toNodeId);
        resolvedPath += `[${idx}]`;
      }
    }

    if (curNode.data.type === "object") {
      resolvedPath += `.${curNode.text}`;
    }
  }

  return resolvedPath;
}
