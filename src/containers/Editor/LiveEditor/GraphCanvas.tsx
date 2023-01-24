import React from "react";
import { Graph } from "src/components/Graph";
import { EdgeModal } from "src/containers/Modals/EdgeModal";
import { NodeModal } from "src/containers/Modals/NodeModal";
import useGraph from "src/store/useGraph";

export const GraphCanvas = ({ isWidget = false }: { isWidget?: boolean }) => {
  const [isNodeModalVisible, setNodeModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<[string, string][]>([]);
  const [isEdgeModalVisible, setEdgeModalVisible] = React.useState(false);
  const [selectedEdge, setSelectedEdge] = React.useState("");

  const collapsedNodes = useGraph(state => state.collapsedNodes);
  const collapsedEdges = useGraph(state => state.collapsedEdges);

  const openNodeModal = React.useCallback(() => setNodeModalVisible(true), []);
  const openEdgeModal = React.useCallback(() => setEdgeModalVisible(true), []);

  React.useEffect(() => {
    const nodeList = collapsedNodes.map(id => `[id$="node-${id}"]`);
    const edgeList = collapsedEdges.map(id => `[class$="edge-${id}"]`);

    const hiddenItems = document.querySelectorAll(".hide");
    hiddenItems.forEach(item => item.classList.remove("hide"));

    if (nodeList.length) {
      const selectedNodes = document.querySelectorAll(nodeList.join(","));
      selectedNodes.forEach(node => node.classList.add("hide"));
    }

    if (edgeList.length) {
      const selectedEdges = document.querySelectorAll(edgeList.join(","));
      selectedEdges.forEach(edge => edge.classList.add("hide"));
    }
  }, [collapsedNodes, collapsedEdges]);

  return (
    <>
      <Graph
        openNodeModal={openNodeModal}
        setSelectedNode={setSelectedNode}
        openEdgeModal={openEdgeModal}
        setSelectedEdge={setSelectedEdge}
        isWidget={isWidget}
      />
      <NodeModal
        selectedNode={selectedNode}
        visible={isNodeModalVisible}
        closeModal={() => setNodeModalVisible(false)}
      />
      <EdgeModal
        selectedEdge={selectedEdge}
        visible={isEdgeModalVisible}
        closeModal={() => setEdgeModalVisible(false)}
      />
    </>
  );
};
