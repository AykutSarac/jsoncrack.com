import React from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { event as gaEvent } from "nextjs-google-analytics";
import type { NodeData } from "jsoncrack-react";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import {
  cleanupHighlight,
  highlightMatchedNodes,
  applyNodeSearchEffects,
  clearNodeSearchEffects,
} from "../lib/utils/search";

interface MatchedNode {
  nodeId: string;
  nodeData: NodeData;
  matchedRowIndex: number;
}

const isTextMatch = (
  row: { key: string | null; value: string | number | null | boolean },
  searchTerm: string
): boolean => {
  const lowerSearchTerm = searchTerm.toLowerCase();

  if (row.key != null && String(row.key).toLowerCase().includes(lowerSearchTerm)) {
    return true;
  }

  if (row.value != null && String(row.value).toLowerCase().includes(lowerSearchTerm)) {
    return true;
  }

  return false;
};

const findMatchingNodes = (
  allNodes: NodeData[],
  searchTerm: string
): MatchedNode[] => {
  if (!searchTerm || searchTerm.trim() === "") {
    return [];
  }

  const trimmedTerm = searchTerm.trim();
  const matches: MatchedNode[] = [];

  for (const node of allNodes) {
    for (let rowIndex = 0; rowIndex < node.text.length; rowIndex++) {
      const row = node.text[rowIndex];
      if (isTextMatch(row, trimmedTerm)) {
        matches.push({
          nodeId: node.id,
          nodeData: node,
          matchedRowIndex: rowIndex,
        });
        break;
      }
    }
  }

  return matches;
};

const findElementByNodeId = (nodeId: string, rowIndex?: number): HTMLElement | null => {
  const foreignObject = document.querySelector(
    `foreignObject[data-id="node-${nodeId}"]`
  ) as HTMLElement | null;

  if (!foreignObject) return null;

  if (rowIndex != null) {
    const rows = foreignObject.querySelectorAll(".row, .textNodeWrapper");
    if (rows[rowIndex]) {
      return rows[rowIndex] as HTMLElement;
    }
  }

  return foreignObject;
};

const findAllMatchingElements = (matchedNodes: MatchedNode[]): HTMLElement[] => {
  const elements: HTMLElement[] = [];

  for (const matched of matchedNodes) {
    const element = findElementByNodeId(matched.nodeId, matched.matchedRowIndex);
    if (element) {
      elements.push(element);
    }
  }

  return elements;
};

export const useFocusNode = () => {
  const viewPort = useGraph(state => state.viewPort);
  const allNodes = useGraph(state => state.allNodes);
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

  const [matchedNodesCache, setMatchedNodesCache] = React.useState<MatchedNode[]>([]);
  const [debouncedValue] = useDebouncedValue(searchQueryState, 300);

  const setValue = React.useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (value === "") {
        setSelectedMatchIndex(0);
        setTotalMatches(0);
        setMatchedNodeIds(new Set());
        setMatchedNodesCache([]);
        cleanupHighlight();
        clearNodeSearchEffects();
      }
    },
    [setSearchQuery, setSelectedMatchIndex, setTotalMatches, setMatchedNodeIds]
  );

  const clear = React.useCallback(() => {
    clearSearchFromStore();
    setMatchedNodesCache([]);
    cleanupHighlight();
    clearNodeSearchEffects();
  }, [clearSearchFromStore]);

  React.useEffect(() => {
    if (!searchQueryState || searchQueryState.trim() === "") {
      cleanupHighlight();
      clearNodeSearchEffects();
      setSelectedMatchIndex(0);
      setTotalMatches(0);
      setMatchedNodeIds(new Set());
      setMatchedNodesCache([]);
      return;
    }

    if (!debouncedValue || debouncedValue.trim() === "") {
      return;
    }

    const matchedNodes = findMatchingNodes(allNodes, debouncedValue);
    setMatchedNodesCache(matchedNodes);

    const nodeIds = new Set(matchedNodes.map(m => m.nodeId));

    setTotalMatches(matchedNodes.length);
    setMatchedNodeIds(nodeIds);

    if (matchedNodes.length > 0) {
      if (selectedMatchIndex >= matchedNodes.length) {
        setSelectedMatchIndex(0);
      }
    }

    gaEvent("search_graph");
  }, [debouncedValue, searchQueryState, allNodes]);

  React.useEffect(() => {
    if (matchedNodeIds.size === 0) {
      cleanupHighlight();
      clearNodeSearchEffects();
      return;
    }

    applyNodeSearchEffects(matchedNodeIds);

    if (matchedNodesCache.length === 0) return;

    const matchedElements = findAllMatchingElements(matchedNodesCache);

    if (matchedElements.length > 0) {
      cleanupHighlight();
      highlightMatchedNodes(
        matchedElements as unknown as NodeListOf<Element>,
        Math.min(selectedMatchIndex, matchedElements.length - 1)
      );
    }

    if (!viewPort || selectedMatchIndex >= matchedNodesCache.length) return;

    const currentMatch = matchedNodesCache[selectedMatchIndex];
    if (!currentMatch) return;

    const elementToFocus = findElementByNodeId(
      currentMatch.nodeId,
      currentMatch.matchedRowIndex
    );

    if (elementToFocus instanceof HTMLElement) {
      viewPort?.camera.centerFitElementIntoView(elementToFocus, {
        elementExtraMarginForZoom: 200,
      });
    }
  }, [matchedNodeIds, matchedNodesCache, selectedMatchIndex, viewPort]);

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
