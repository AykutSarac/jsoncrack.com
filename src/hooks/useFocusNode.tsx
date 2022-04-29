import React from "react";
import { useConfig } from "src/hocs/config";

import {
  searchQuery,
  cleanupHighlight,
  highlightMatchedNodes,
} from "src/utils/search";

export const useFocusNode = () => {
  const [selectedNode, setSelectedNode] = React.useState(0);
  const [content, setContent] = React.useState({
    value: "",
    debounced: "",
  });

  const {
    states: { settings },
  } = useConfig();

  const skip = () => setSelectedNode((current) => current + 1);

  React.useEffect(() => {
    const debouncer = setTimeout(() => {
      setContent((val) => ({ ...val, debounced: content.value }));
    }, 1500);

    return () => clearTimeout(debouncer);
  }, [content.value]);

  React.useEffect(() => {
    if (!settings.zoomPanPinch) return;
    const zoomPanPinch = settings.zoomPanPinch.instance.wrapperComponent;

    const matchedNodes: NodeListOf<Element> = searchQuery(
      `span[data-key*='${content.debounced}' i]`
    );
    const matchedNode: Element | null = matchedNodes[selectedNode] || null;

    cleanupHighlight();

    if (zoomPanPinch && matchedNode && matchedNode.parentElement) {
      const newScale = 1;
      const x = Number(matchedNode.getAttribute("data-x"));
      const y = Number(matchedNode.getAttribute("data-y"));

      const newPositionX =
        (zoomPanPinch.offsetLeft - x) * newScale +
        zoomPanPinch.clientWidth / 2 -
        matchedNode.getBoundingClientRect().width / 2;
      const newPositionY =
        (zoomPanPinch.offsetLeft - y) * newScale +
        zoomPanPinch.clientHeight / 2 -
        matchedNode.getBoundingClientRect().height / 2;

      highlightMatchedNodes(matchedNodes, selectedNode);

      settings.zoomPanPinch?.setTransform(newPositionX, newPositionY, newScale);
    } else {
      setSelectedNode(0);
    }

    return () => {
      if (!content.value) setSelectedNode(0);
    };
  }, [content.debounced, settings.zoomPanPinch, selectedNode, setSelectedNode]);

  return [content, setContent, skip] as const;
};
