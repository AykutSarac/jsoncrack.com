import React from "react";
import ReactFlow, {
  ControlButton,
  Controls,
  Elements,
  MiniMap,
  NodeExtent,
} from "react-flow-renderer";
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
  const [config] = useLocalStorage("config", {
    layout: "RL",
    minimap: true,
    controls: true,
  });

  const [elements, setElements] = React.useState<Elements>([]);
  const [rfInstance, setRfInstance] = React.useState<any>(null);
  const [valid, setValid] = React.useState(true);

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
      onLoad={(rf: any) => setRfInstance(rf)}
    >
      {config.minimap && <MiniMap />}
      {config.controls && (
        <Controls>
          <ControlButton
            onClick={() =>
              setElements(getLayoutPosition(config.layout, elements))
            }
            style={{ gridColumn: "1 / 3", width: "auto" }}
          >
            Format
          </ControlButton>
        </Controls>
      )}
    </ReactFlow>
  );
};
