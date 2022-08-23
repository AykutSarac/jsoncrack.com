import { NodeData, EdgeData } from "reaflow/dist/types";


export const findEdgeChildren = (selectedNode: string, connections: NodeData[], edges: EdgeData[]) => {

    const nodeIds = connections.map((n) => n.id);
    nodeIds.push(selectedNode);
    const newEdges = edges.filter(
      (e) =>
        nodeIds.includes(e.from as string) && nodeIds.includes(e.to as string)
    );

    return newEdges;

  };