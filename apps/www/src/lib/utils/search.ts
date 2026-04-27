export const searchQuery = (param: string) => {
  return document.querySelectorAll(param);
};

export const cleanupHighlight = () => {
  const nodes = document.querySelectorAll(".searched, .highlight");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].classList.remove("searched", "highlight");
  }
};

export const highlightMatchedNodes = (nodes: NodeListOf<Element>, selectedNode: number) => {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].classList.add("searched");
  }

  nodes[selectedNode].classList.add("highlight");
};
