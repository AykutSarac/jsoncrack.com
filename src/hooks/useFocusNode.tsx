import React from "react";
import { useConfig } from "src/hocs/config";

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

    const node = document.querySelector(
      `span[data-key*='${content.debounced}' i]`
    );

    document
      .querySelector("foreignObject.searched")
      ?.classList.remove("searched");

    if (zoomPanPinch && node && node.parentElement) {
      const newScale = 1;
      const x = Number(node.getAttribute("data-x"));
      const y = Number(node.getAttribute("data-y"));

      const newPositionX =
        (zoomPanPinch.offsetLeft - x) * newScale +
        node.getBoundingClientRect().width;
      const newPositionY =
        (zoomPanPinch.offsetTop - y) * newScale +
        node.getBoundingClientRect().height;

      node.parentElement.parentElement
        ?.closest("foreignObject")
        ?.classList.toggle("searched");

      settings.zoomPanPinch?.setTransform(newPositionX, newPositionY, newScale);
    }
  }, [content.debounced, settings.zoomPanPinch]);

  return [content, setContent] as const;
};
