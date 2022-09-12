export const searchQuery = (param: string) => {
  return document.querySelectorAll(`${param}`);
};

export const cleanupHighlight = () => {
  const nodes = document.querySelectorAll("foreignObject.searched, .highlight");

  nodes?.forEach(node => {
    node.classList.remove("highlight");
    node.classList.remove("searched");
  });
};

export const highlightMatchedNodes = (
  nodes: NodeListOf<Element>,
  selectedNode: number
) => {
  nodes?.forEach(node => {
    console.log(node.parentElement?.closest("foreignObject"));

    node.parentElement?.closest("foreignObject")?.classList.add("searched");
  });

  nodes[selectedNode].classList.add("highlight");
};
