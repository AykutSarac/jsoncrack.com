import React from "react";

import {
  searchQuery,
  cleanupHighlight,
  highlightMatchedNodes,
} from "src/utils/search";
import useConfig from "./store/useConfig";

export const useFocusNode = () => {
  const [selectedNode, setSelectedNode] = React.useState(0);
  const [content, setContent] = React.useState({
    value: "",
    debounced: "",
  });

  const zoomPanPinch = useConfig((state) => state.settings.zoomPanPinch);

  const skip = () => setSelectedNode((current) => current + 1);

  React.useEffect(() => {
    const debouncer = setTimeout(() => {
      setContent((val) => ({ ...val, debounced: content.value }));
    }, 1500);

    return () => clearTimeout(debouncer);
  }, [content.value]);

  React.useEffect(() => {
    if (!zoomPanPinch) return;
    const ref = zoomPanPinch.instance.wrapperComponent;

    const matchedNodes: NodeListOf<Element> = searchQuery(
      `span[data-key*='${content.debounced}' i]`
    );
    const matchedNode: Element | null = matchedNodes[selectedNode] || null;

    cleanupHighlight();

    if (ref && matchedNode && matchedNode.parentElement) {
      const newScale = 1;
      const x = Number(matchedNode.getAttribute("data-x"));
      const y = Number(matchedNode.getAttribute("data-y"));

      const newPositionX =
        (ref.offsetLeft - x) * newScale +
        ref.clientWidth / 2 -
        matchedNode.getBoundingClientRect().width / 2;
      const newPositionY =
        (ref.offsetLeft - y) * newScale +
        ref.clientHeight / 2 -
        matchedNode.getBoundingClientRect().height / 2;

      highlightMatchedNodes(matchedNodes, selectedNode);

      zoomPanPinch?.setTransform(newPositionX, newPositionY, newScale);
    } else {
      setSelectedNode(0);
    }

    return () => {
      if (!content.value) setSelectedNode(0);
    };
  }, [content.debounced, zoomPanPinch, selectedNode, setSelectedNode]);

  return [content, setContent, skip] as const;
};
