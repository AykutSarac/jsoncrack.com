export const searchQuery = (param: string) => {
  return document.querySelectorAll(`${param}`);
};

export const cleanupHighlight = () => {
  const nodes = document.querySelectorAll("foreignObject.searched");

  nodes?.forEach((node) => {
    node.classList.remove("searched");
  });
};

export const highlightMatchedNodes = (nodes: NodeListOf<Element>) => {
  nodes?.forEach((node) => {
    node.parentElement?.parentElement
      ?.closest("foreignObject")
      ?.classList.add("searched");
  });
};
