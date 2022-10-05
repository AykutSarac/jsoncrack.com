
const nodeToValue = (node:NodeData) => Array.isArray(node.text) ? Object.fromEntries(node.text) : node.text;

const hasEdgeLeaving = (node:NodeData, edges:EdgeData[]) => edges.some((edge)=> node.id === edge.from);
const hasChild = (node:NodeData) => !!node.data.isParent;

const getChildNode = (edge: EdgeData, nodes: NodeData[]) => nodes.find((node)=> node.id === edge.to) as NodeData;
const moveNodeToFront = (node: NodeData, nodes: NodeData[]) => [node, ...removeNode(node, nodes)];

const removeNode = (node: NodeData, nodes: NodeData[]) => nodes.filter((n)=> n.id !== node.id);
const removeEdge = (edge: EdgeData, edges: EdgeData[]) => edges.filter((e)=> e.id !== edge.id);

const getEdge = (node:NodeData, edges:EdgeData[]) => edges.find((edge)=> node.id === edge.from) as EdgeData;

export const graphParser = (nodes:NodeData[], edges:EdgeData[]) =>{
  const currentNode = nodes[0];
  if((!hasChild(currentNode) && !hasEdgeLeaving(currentNode, edges))){
    return nodeToValue(currentNode);
  }
  
  const remainingNodes = removeNode(currentNode, nodes);

  if(hasChild(currentNode)) {
    const childEdges = edges.filter((edge)=> edge.from === currentNode.id);
    const remainingEdges = edges.filter((edge)=> edge.from !== currentNode.id);
    const key = nodeToValue(currentNode);
    const obj = {};
    obj[key] = childEdges.map((edge)=>{
      const childNode = getChildNode(edge, remainingNodes);       
      const nextNodes = moveNodeToFront(childNode, remainingNodes);  
      return typeof nodeToValue(childNode) === 'string' 
        ? nodeToValue(childNode)
        : Object.assign({}, nodeToValue(childNode), graphParser(nextNodes, remainingEdges));
    });
    return obj;
  }
  const nextEdge = getEdge(currentNode, edges);
  const remainingEdges = removeEdge(nextEdge, edges);
  const childNode = getChildNode(nextEdge, remainingNodes);       
  const nextNodes = moveNodeToFront(childNode, remainingNodes);  

  return Object.assign({}, nodeToValue(currentNode), graphParser(nextNodes, remainingEdges));
}

