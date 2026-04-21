import React from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { event as gaEvent } from "nextjs-google-analytics";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import {
  cleanupHighlight,
  searchQuery,
  highlightMatchedNodes,
  applyNodeSearchEffects,
  clearNodeSearchEffects,
} from "../lib/utils/search";

export const useFocusNode = () => {
  const viewPort = useGraph(state => state.viewPort);
  const searchQueryState = useGraph(state => state.searchQuery);
  const matchedNodeIds = useGraph(state => state.matchedNodeIds);
  const selectedMatchIndex = useGraph(state => state.selectedMatchIndex);
  const totalMatches = useGraph(state => state.totalMatches);
  
  const {
    setSearchQuery,
    setMatchedNodeIds,
    setSelectedMatchIndex,
    setTotalMatches,
    clearSearch: clearSearchFromStore,
    nextMatch,
    prevMatch,
  } = useGraph(state => state);

  const [debouncedValue] = useDebouncedValue(searchQueryState, 300);

  const getNodeIdFromElement = (element: Element): string | null => {
    const foreignObject = element.closest("foreignObject");
    if (!foreignObject) return null;
    const dataId = foreignObject.getAttribute("data-id");
    if (!dataId) return null;
    return dataId.replace("node-", "");
  };

  const setValue = React.useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (value === "") {
        setSelectedMatchIndex(0);
        setTotalMatches(0);
        setMatchedNodeIds(new Set());
        cleanupHighlight();
        clearNodeSearchEffects();
      }
    },
    [setSearchQuery, setSelectedMatchIndex, setTotalMatches, setMatchedNodeIds]
  );

  const clear = React.useCallback(() => {
    clearSearchFromStore();
    cleanupHighlight();
    clearNodeSearchEffects();
  }, [clearSearchFromStore]);

  React.useEffect(() => {
    if (!searchQueryState) {
      cleanupHighlight();
      clearNodeSearchEffects();
      setSelectedMatchIndex(0);
      setTotalMatches(0);
      setMatchedNodeIds(new Set());
      return;
    }

    if (!viewPort || !debouncedValue) return;
    const matchedElements: NodeListOf<Element> = searchQuery(`span[data-key*='${debouncedValue}' i]`);
    const matchedElement: Element | null = matchedElements[selectedMatchIndex] || null;

    cleanupHighlight();

    if (matchedElement instanceof HTMLElement) {
      highlightMatchedNodes(matchedElements, selectedMatchIndex);
      setTotalMatches(matchedElements.length);

      const nodeIds = new Set<string>();
      for (let i = 0; i < matchedElements.length; i++) {
        const nodeId = getNodeIdFromElement(matchedElements[i]);
        if (nodeId) nodeIds.add(nodeId);
      }
      setMatchedNodeIds(nodeIds);
      
      applyNodeSearchEffects(nodeIds);

      viewPort?.camera.centerFitElementIntoView(matchedElement, {
        elementExtraMarginForZoom: 200,
      });
    } else {
      setSelectedMatchIndex(0);
      setTotalMatches(0);
      setMatchedNodeIds(new Set());
      clearNodeSearchEffects();
    }

    gaEvent("search_graph");
  }, [selectedMatchIndex, debouncedValue, searchQueryState, viewPort, setTotalMatches, setMatchedNodeIds, setSelectedMatchIndex]);

  React.useEffect(() => {
    if (matchedNodeIds.size > 0) {
      applyNodeSearchEffects(matchedNodeIds);
    }
  }, [matchedNodeIds]);

  return {
    value: searchQueryState,
    setValue,
    next: nextMatch,
    prev: prevMatch,
    clear,
    nodeCount: totalMatches,
    selectedNode: selectedMatchIndex,
    matchedNodeIds,
  };
};
