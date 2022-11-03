import { getParentsForNodeId } from "reaflow";

export const getPathToNode = (nodes, edges, id) => getParentsForNodeId(nodes, edges, id)
  .reduce((path, { text, data: { isParent } }) => isParent ? path ? `${text}.${path}` : text : path, '')
