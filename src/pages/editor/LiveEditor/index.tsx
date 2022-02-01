import React from "react";
import styled, { css } from "styled-components";
import ReactFlow, {
  Controls,
  Elements,
  isNode,
  NodeExtent,
  Position,
  ReactFlowProvider,
} from "react-flow-renderer";
import { defaultValue } from "../JsonEditor";
import { parser } from "src/utils/json-editor-parser";
import { useLocalStorage } from "usehooks-ts";
import dagre from "dagre";
import { CustomNodeComponent } from "./Node";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeExtent: NodeExtent = [
  [0, 0],
  [1000, 1000],
];

const StyledLiveEditor = styled.div`
  width: 100%;
  height: 100%;
`;

const onLayout = (
  direction: string,
  elements: Elements,
  setElements: React.Dispatch<Elements>
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: 175, height: 50 });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  const layoutedElements = elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = isHorizontal ? Position.Left : Position.Top;
      el.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      el.position = {
        x: nodeWithPosition.x + Math.random() / 1000,
        y: nodeWithPosition.y,
      };
    }

    return el;
  });

  setElements(layoutedElements);
};

const nodeTypes = {
  special: CustomNodeComponent,
};

const LiveEditor: React.FC = () => {
  const [json] = useLocalStorage("json", JSON.stringify(defaultValue));
  const [rfInstance, setRfInstance] = React.useState<any>(null);
  const [valid, setValid] = React.useState(true);
  const [elements, setElements] = React.useState<Elements>(
    parser(JSON.parse(json))
  );

  React.useEffect(() => {
    try {
      JSON.parse(json);
      setElements(parser(JSON.parse(json)));
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
      <ReactFlowProvider>
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
            <button
              type="button"
              className="react-flow__controls-button react-flow__controls-zoomin"
              onClick={() => onLayout("RL", elements, setElements)}
            >
              Style
            </button>
          </Controls>
        </ReactFlow>
      </ReactFlowProvider>
    </StyledLiveEditor>
  );
};

export default LiveEditor;
