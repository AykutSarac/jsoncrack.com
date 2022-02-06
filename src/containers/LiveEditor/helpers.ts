import dagre from "dagre";
import { Elements, isNode, Position } from "react-flow-renderer";
import { Layout } from "src/typings/global";
import { parser } from "src/utils/json-editor-parser";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutPosition = (direction: string, elements: Elements, dynamic = false) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        width: dynamic ? el.__rf.width : 200,
        height: dynamic ? el.__rf.height : 100,
      });
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

  return layoutedElements;
};

export function getNextLayout(layout: Layout) {
  switch (layout) {
    case "TB":
      return "BT";

    case "BT":
      return "RL";

    case "RL":
      return "LR";

    default:
      return "TB";
  }
}

export function getLayout(layout: Layout, json: string, dynamic = false) {
  const jsonToGraph = parser(json);
  const layoutedElements = getLayoutPosition(layout, jsonToGraph, dynamic);

  return layoutedElements;
}
