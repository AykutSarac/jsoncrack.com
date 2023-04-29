import React from "react";
import { useDebouncedValue } from "@mantine/hooks";
import useGraph from "src/store/useGraph";
import { searchQuery, cleanupHighlight, highlightMatchedNodes } from "src/utils/search";

export const useFocusNode = () => {
  const zoomPanPinch = useGraph(state => state.zoomPanPinch);
  const [selectedNode, setSelectedNode] = React.useState(0);
  const [nodeCount, setNodeCount] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [debouncedValue] = useDebouncedValue(value, 600);

  const skip = () => setSelectedNode(current => current + 1);

  React.useEffect(() => {
    if (!zoomPanPinch) return;
    const matchedNodes: NodeListOf<Element> = searchQuery(`span[data-key*='${debouncedValue}' i]`);
    const ref = zoomPanPinch.instance.wrapperComponent;
    const matchedNode: Element | null = matchedNodes[selectedNode] || null;

    cleanupHighlight();

    if (ref && matchedNode && matchedNode.parentElement) {
      const newScale = 0.8;
      const x = Number(matchedNode.getAttribute("data-x"));
      const y = Number(matchedNode.getAttribute("data-y"));

      const newPositionX =
        (ref.offsetLeft - x) * newScale +
        ref.clientWidth / 5 -
        matchedNode.getBoundingClientRect().width / 5;

      const newPositionY =
        (ref.offsetLeft - y) * newScale +
        ref.clientHeight / 8 -
        matchedNode.getBoundingClientRect().height / 8;
      highlightMatchedNodes(matchedNodes, selectedNode);
      setNodeCount(matchedNodes.length);

      zoomPanPinch?.setTransform(newPositionX, newPositionY, newScale);
    } else {
      setSelectedNode(0);
      setNodeCount(0);
    }

    return () => {
      if (!value) {
        setSelectedNode(0);
        setNodeCount(0);
      }
    };
  }, [selectedNode, debouncedValue, value, zoomPanPinch]);

  return [value, setValue, skip, nodeCount, selectedNode] as const;
};
