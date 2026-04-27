import React from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { event as gaEvent } from "nextjs-google-analytics";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import { cleanupHighlight, searchQuery, highlightMatchedNodes } from "../lib/utils/search";

export const useFocusNode = () => {
  const viewPort = useGraph(state => state.viewPort);
  const [selectedNode, setSelectedNode] = React.useState(0);
  const [nodeCount, setNodeCount] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [debouncedValue] = useDebouncedValue(value, 300);

  const next = React.useCallback(() => {
    setSelectedNode(current => (nodeCount > 0 ? (current + 1) % nodeCount : 0));
  }, [nodeCount]);

  const prev = React.useCallback(() => {
    setSelectedNode(current => (nodeCount > 0 ? (current - 1 + nodeCount) % nodeCount : 0));
  }, [nodeCount]);

  const clear = React.useCallback(() => {
    setValue("");
    setSelectedNode(0);
    setNodeCount(0);
    cleanupHighlight();
  }, []);

  React.useEffect(() => {
    if (!value) {
      cleanupHighlight();
      setSelectedNode(0);
      setNodeCount(0);
      return;
    }

    if (!viewPort || !debouncedValue) return;
    const matchedNodes: NodeListOf<Element> = searchQuery(`span[data-key*='${debouncedValue}' i]`);
    const matchedNode: Element | null = matchedNodes[selectedNode] || null;

    cleanupHighlight();

    if (matchedNode instanceof HTMLElement) {
      highlightMatchedNodes(matchedNodes, selectedNode);
      setNodeCount(matchedNodes.length);

      viewPort?.camera.centerFitElementIntoView(matchedNode, {
        elementExtraMarginForZoom: 200,
      });
    } else {
      setSelectedNode(0);
      setNodeCount(0);
    }

    gaEvent("search_graph");
  }, [selectedNode, debouncedValue, value, viewPort]);

  return { value, setValue, next, prev, clear, nodeCount, selectedNode };
};
