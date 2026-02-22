export const searchQuery = (param: string) => {
  return document.querySelectorAll(param);
};

export const cleanupHighlight = () => {
  const nodes = document.querySelectorAll("foreignObject.searched, .highlight");
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.classList.remove("searched", "highlight");
  }
};

export const highlightMatchedNodes = (nodes: NodeListOf<Element>, selectedNode: number) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const foreignObject = node.parentElement?.closest("foreignObject");
    if (foreignObject) foreignObject.classList.add("searched");
  }

  nodes[selectedNode].classList.add("highlight");
};
