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

export const getNodeGroupFromElement = (element: Element): Element | null => {
  const foreignObject = element.closest("foreignObject");
  if (!foreignObject) return null;
  return foreignObject.closest("g");
};

export const getAllNodeGroups = (): NodeListOf<Element> => {
  return document.querySelectorAll(".jsoncrack-canvas g");
};

export const applyNodeSearchEffects = (matchedNodeIds: Set<string>) => {
  const allNodes = getAllNodeGroups();
  
  for (let i = 0; i < allNodes.length; i++) {
    const nodeGroup = allNodes[i];
    const foreignObject = nodeGroup.querySelector("foreignObject");
    if (!foreignObject) continue;
    
    const dataId = foreignObject.getAttribute("data-id");
    if (!dataId) continue;
    
    const nodeId = dataId.replace("node-", "");
    
    if (matchedNodeIds.has(nodeId)) {
      nodeGroup.classList.remove("node-unmatched");
      nodeGroup.classList.add("node-matched");
    } else {
      nodeGroup.classList.remove("node-matched");
      nodeGroup.classList.add("node-unmatched");
    }
  }
};

export const clearNodeSearchEffects = () => {
  const allNodes = document.querySelectorAll(".node-matched, .node-unmatched");
  for (let i = 0; i < allNodes.length; i++) {
    allNodes[i].classList.remove("node-matched", "node-unmatched");
  }
};
