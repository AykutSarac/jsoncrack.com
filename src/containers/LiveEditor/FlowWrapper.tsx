import React from "react";
import ReactFlow, {
  ControlButton,
  Controls,
  Elements,
  MiniMap,
  NodeExtent,
  OnLoadParams,
} from "react-flow-renderer";
import { StorageConfig } from "src/typings/global";
import { useLocalStorage } from "usehooks-ts";
import { defaultValue } from "../JsonEditor";
import { getLayout, getLayoutPosition } from "./helpers";
import { CustomNodeComponent } from "./Node";

const nodeExtent: NodeExtent = [
  [0, 0],
  [1000, 1000],
];

const nodeTypes = {
  special: CustomNodeComponent,
};

export const FlowWrapper: React.FC = () => {
  const [json] = useLocalStorage("json", JSON.stringify(defaultValue));
  const [config] = useLocalStorage<StorageConfig>("config", {
    layout: "RL",
    minimap: true,
    controls: true,
  });

  const [elements, setElements] = React.useState<Elements>([]);
  const [rfInstance, setRfInstance] = React.useState<OnLoadParams | null>(null);
  const [valid, setValid] = React.useState(true);

  const handleClick = () => {
    setElements(getLayoutPosition(config.layout, elements));
  };

  React.useEffect(() => {
    if (rfInstance) rfInstance.fitView();
  }, [rfInstance]);

  React.useEffect(() => {
    try {
      const layoutedElements = getLayout(config.layout, json);
      setElements(layoutedElements);
      setValid(true);
    } catch (error) {
      setValid(false);
    }
  }, [rfInstance, json, config]);

  if (!valid) return null;

  return (
    <ReactFlow
      nodeExtent={nodeExtent}
      elements={elements}
      nodeTypes={nodeTypes}
      onLoad={setRfInstance}
    >
      {config.minimap && <MiniMap />}
      {config.controls && (
        <Controls>
          <ControlButton
            onClick={handleClick}
            style={{ gridColumn: "1 / 3", width: "auto" }}
          >
            Format
          </ControlButton>
        </Controls>
      )}
    </ReactFlow>
  );
};
