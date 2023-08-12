import React from "react";
import useGraph from "src/store/useGraph";

const useToggleHide = () => {
  const getCollapsedNodeIds = useGraph(state => state.getCollapsedNodeIds);
  const getCollapsedEdgeIds = useGraph(state => state.getCollapsedEdgeIds);

  const validateHiddenNodes = React.useCallback(() => {
    const nodeList = getCollapsedNodeIds().map(id => `[id$="node-${id}"]`);
    const edgeList = getCollapsedEdgeIds().map(id => `[class$="edge-${id}"]`);
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
  }, [getCollapsedEdgeIds, getCollapsedNodeIds]);

  React.useEffect(() => {
    validateHiddenNodes();
  }, [validateHiddenNodes]);

  return { validateHiddenNodes };
};

export default useToggleHide;
