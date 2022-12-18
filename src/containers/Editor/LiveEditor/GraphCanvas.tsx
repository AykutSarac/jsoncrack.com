import React from "react";
import { Graph } from "src/components/Graph";
import { NodeModal } from "src/containers/Modals/NodeModal";
import useGraph from "src/store/useGraph";

export const GraphCanvas = ({ isWidget = false }: { isWidget?: boolean }) => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<[string, string][]>([]);

  const collapsedNodes = useGraph(state => state.collapsedNodes);
  const collapsedEdges = useGraph(state => state.collapsedEdges);

  const openModal = React.useCallback(() => setModalVisible(true), []);

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
        openModal={openModal}
        setSelectedNode={setSelectedNode}
        isWidget={isWidget}
      />
      {!isWidget && (
        <NodeModal
          selectedNode={selectedNode}
          visible={isModalVisible}
          closeModal={() => setModalVisible(false)}
        />
      )}
    </>
  );
};
