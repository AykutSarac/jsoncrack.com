import React from "react";
import useGraph from "src/store/useGraph";

const useHideNodes = () => {
  const collapsedNodes = useGraph(state => state.collapsedNodes);
  const collapsedEdges = useGraph(state => state.collapsedEdges);

  const nodeList = React.useMemo(
    () => collapsedNodes.map(id => `[id$="node-${id}"]`),
    [collapsedNodes]
  );
  const edgeList = React.useMemo(
    () => collapsedEdges.map(id => `[class$="edge-${id}"]`),
    [collapsedEdges]
  );

  const checkNodes = () => {
    const hiddenItems = document.querySelectorAll(".hide");
    hiddenItems.forEach(item => item.classList.remove("hide"));

    if (nodeList.length > 1) {
      const selectedNodes = document.querySelectorAll(nodeList.join(","));
      const selectedEdges = document.querySelectorAll(edgeList.join(","));

      selectedNodes.forEach(node => node.classList.add("hide"));
      selectedEdges.forEach(edge => edge.classList.add("hide"));
    }
  };

  return { checkNodes };
};

export default useHideNodes;
