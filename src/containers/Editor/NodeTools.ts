import { NodeData, EdgeData, removeAndUpsertNodes } from "reaflow";
import { findNodeChildren } from "src/utils/findNodeChildren";
import toast from "react-hot-toast";
import { NodeTools } from "src/hooks/store/useNodeTools";
import { findEdgeChildren } from "src/utils/findEdgeChildren";

export const collapseNodes = (
  selectedNode: string,
  nodes: NodeData[],
  edges: EdgeData[],
  collapsedNodes: { [key: string]: NodeData[] },
  collapsedEdges: { [key: string]: EdgeData[] },
  setNodeTools: (key: keyof NodeTools, value: unknown) => void
) => {
  if (selectedNode) {
    const childrenOfNode = findNodeChildren(selectedNode, nodes, edges);
    const childrenOfEdge = findEdgeChildren(
      selectedNode,
      childrenOfNode,
      edges
    );

    const newCollapsedEdges = {};
    newCollapsedEdges[selectedNode] = childrenOfEdge;
    setNodeTools("collapsedEdges", {
      ...collapsedEdges,
      ...newCollapsedEdges,
    });

    const newCollapsedNodes = {};
    newCollapsedNodes[selectedNode] = childrenOfNode;
    setNodeTools("collapsedNodes", {
      ...collapsedNodes,
      ...newCollapsedNodes,
    });

    const resultOfRemovedNodes = removeAndUpsertNodes(
      nodes,
      edges,
      childrenOfNode
    );

    const edgesResult = resultOfRemovedNodes.edges.filter((e) =>
      e.id.startsWith("e")
    );
    setNodeTools("newNodes", resultOfRemovedNodes.nodes);
    setNodeTools("newEdges", edgesResult);
    setTimeout(() => toast.dismiss("restartToast"), 230);
  } else {
    toast("Please select a node to collapse!");
  }
};

export const expandNodes = (
  selectedNode: string,
  nodes: NodeData[],
  edges: EdgeData[],
  collapsedNodes: { [key: string]: NodeData[] },
  collapsedEdges: { [key: string]: EdgeData[] },
  setNodeTools: (nodeTools: keyof NodeTools, value: unknown) => void
) => {
  if (selectedNode) {
    const concatEdges = edges.concat(collapsedEdges[selectedNode]);
    const concatNodes = nodes.concat(collapsedNodes[selectedNode]);

    setNodeTools("newNodes", concatNodes);
    setNodeTools("newEdges", concatEdges);
  } else {
    toast("Please select a node to expand!");
  }
};

export const restartNodes = (
  initialNodes: NodeData[],
  initialEdges: EdgeData[],
  nodes: NodeData[],
  setNodeTools: (nodeTools: keyof NodeTools, value: unknown) => void
) => {
  if (nodes !== initialNodes) {
    setNodeTools("newNodes", initialNodes);
    setNodeTools("newEdges", initialEdges);
  } else {
    toast("Collapse at last once the node to restart!", { id: "restartToast" });
  }
};
