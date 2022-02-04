import React from "react";
import ReactFlow, {
  ControlButton,
  Controls,
  Elements,
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
  const [layout] = useLocalStorage("layout", "RL");

  const [elements, setElements] = React.useState<Elements>([]);
  const [rfInstance, setRfInstance] = React.useState<any>(null);
  const [valid, setValid] = React.useState(true);

  React.useEffect(() => {
    if (rfInstance) rfInstance.fitView();
  }, [rfInstance]);

  React.useEffect(() => {
    try {
      const layoutedElements = getLayout(layout, json);
      setElements(layoutedElements);
      setValid(true);
    } catch (error) {
      setValid(false);
    }
  }, [rfInstance, json, layout]);

  if (!valid) return null;

  return (
    <ReactFlow
      nodeExtent={nodeExtent}
      elements={elements}
      nodeTypes={nodeTypes}
      onLoad={(rf: any) => setRfInstance(rf)}
    >
      <Controls>
        <ControlButton
          onClick={() => setElements(getLayoutPosition(layout, elements))}
          style={{ gridColumn: "1 / 3", width: "auto" }}
        >
          Format
        </ControlButton>
      </Controls>
    </ReactFlow>
  );
};
