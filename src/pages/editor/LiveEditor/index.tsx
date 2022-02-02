import React from "react";
import styled from "styled-components";
import ReactFlow, {
  ControlButton,
  Controls,
  Elements,
  NodeExtent,
} from "react-flow-renderer";
import { defaultValue } from "../JsonEditor";
import { parser } from "src/utils/json-editor-parser";
import { useLocalStorage } from "usehooks-ts";
import { CustomNodeComponent } from "./Node";
import { onLayout } from "./helpers";

const nodeExtent: NodeExtent = [
  [0, 0],
  [1000, 1000],
];

const StyledLiveEditor = styled.div`
  width: 100%;
  height: 100%;

  .react-flow__controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;
    right: 10px;
    left: unset;
  }

  .react-flow__controls-button {
    background: ${({ theme }) => theme.BLACK_PRIMARY};
    fill: ${({ theme }) => theme.SILVER};
    color: ${({ theme }) => theme.SILVER};
    font-weight: 600;
    border: 1px solid ${({ theme }) => theme.BLACK};

    &:hover {
      background: unset;
    }
  }
`;

const nodeTypes = {
  special: CustomNodeComponent,
};

export const LiveEditor: React.FC = () => {
  const [json] = useLocalStorage("json", JSON.stringify(defaultValue));
  const [rfInstance, setRfInstance] = React.useState<any>(null);
  const [valid, setValid] = React.useState(true);
  const [elements, setElements] = React.useState<Elements>(
    parser(json)
  );

  React.useEffect(() => {
    try {
      JSON.parse(json);
      onLayout("RL", parser(json), setElements);
      setValid(true);
    } catch (error) {
      setValid(false);
    }
  }, [json]);

  React.useEffect(() => {
    if (rfInstance) {
      rfInstance.fitView();
    }
  }, [elements, rfInstance]);

  if (!valid) return null;

  return (
    <StyledLiveEditor>
      <ReactFlow
        nodeExtent={nodeExtent}
        elements={elements}
        nodeTypes={nodeTypes}
        onLoad={(rf: any) => {
          setRfInstance(rf);
          onLayout("RL", elements, setElements);
        }}
      >
        <Controls>
          <ControlButton onClick={() => onLayout("RL", elements, setElements)}>
            Style
          </ControlButton>
        </Controls>
      </ReactFlow>
    </StyledLiveEditor>
  );
};
