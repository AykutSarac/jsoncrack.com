import React from "react";
import { Graph } from "src/components/Graph";
import { NodeModal } from "src/containers/Modals/NodeModal";

export const GraphCanvas = ({ isWidget = false }: { isWidget?: boolean }) => {
  const [isNodeModalVisible, setNodeModalVisible] = React.useState(false);
  const openNodeModal = React.useCallback(() => setNodeModalVisible(true), []);

  return (
    <>
      <Graph openNodeModal={openNodeModal} isWidget={isWidget} />
      <NodeModal opened={isNodeModalVisible} onClose={() => setNodeModalVisible(false)} />
    </>
  );
};
