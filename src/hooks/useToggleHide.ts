import React from "react";
import useGraph from "src/store/useGraph";

const useToggleHide = () => {
  const getCollapsedNodeIds = useGraph(state => state.getCollapsedNodeIds);
  const getCollapsedEdgeIds = useGraph(state => state.getCollapsedEdgeIds);

  React.useEffect(() => {
    validateHiddenNodes(getCollapsedNodeIds(), getCollapsedEdgeIds());
  }, [getCollapsedEdgeIds, getCollapsedNodeIds]);

  return {
    validateHiddenNodes: () => validateHiddenNodes(getCollapsedNodeIds(), getCollapsedEdgeIds()),
  };
};

function validateHiddenNodes(collapsedNodeIs: string[], collapsedEdgeIds: string[]) {
  const nodeList = collapsedNodeIs.map(id => `[id$="node-${id}"]`);
  const edgeList = collapsedEdgeIds.map(id => `[class$="edge-${id}"]`);
  const hiddenItems = document.body.querySelectorAll(".hide");

  hiddenItems.forEach(item => item.classList.remove("hide"));

  if (nodeList.length) {
    const selectedNodes = document.body.querySelectorAll(nodeList.join(","));

    selectedNodes.forEach(node => node.classList.add("hide"));
  }

  if (edgeList.length) {
    const selectedEdges = document.body.querySelectorAll(edgeList.join(","));

    selectedEdges.forEach(edge => edge.classList.add("hide"));
  }
}

export default useToggleHide;
