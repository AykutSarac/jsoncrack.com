import React from "react";
import useGraph from "src/store/useGraph";

const useToggleHide = () => {
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

  const validateHiddenNodes = React.useCallback(() => {
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
  }, [nodeList, edgeList]);

  React.useEffect(() => {
    validateHiddenNodes();
  }, [validateHiddenNodes]);

  return { validateHiddenNodes };
};

export default useToggleHide;
