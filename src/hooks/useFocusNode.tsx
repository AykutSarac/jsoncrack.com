import React from "react";
import { useConfig } from "src/hocs/config";

import {
  searchQuery,
  cleanupHighlight,
  highlightMatchedNodes,
} from "src/utils/search";

type Content = { value: string; debounced: string };

export const useFocusNode = () => {
  const [content, setContent] = React.useState({
    value: "",
    debounced: "",
  });

  const {
    states: { settings },
  } = useConfig();

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
    const firstMatchedNode: Element | null = matchedNodes[0] || null;

    cleanupHighlight();

    if (zoomPanPinch && firstMatchedNode && firstMatchedNode.parentElement) {
      const newScale = 1;
      const x = Number(firstMatchedNode.getAttribute("data-x"));
      const y = Number(firstMatchedNode.getAttribute("data-y"));

      const newPositionX =
        (zoomPanPinch.offsetLeft - x) * newScale +
        firstMatchedNode.getBoundingClientRect().width;
      const newPositionY =
        (zoomPanPinch.offsetTop - y) * newScale +
        firstMatchedNode.getBoundingClientRect().height;

      highlightMatchedNodes(matchedNodes);

      settings.zoomPanPinch?.setTransform(newPositionX, newPositionY, newScale);
    }
  }, [content.debounced, settings.zoomPanPinch]);

  return [content, setContent] as const;
};
