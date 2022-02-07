import dagre from "dagre";
import { Elements, isNode, Position } from "react-flow-renderer";
import { CanvasDirection } from "reaflow";
import { parser } from "src/utils/json-editor-parser";

export function getEdgeNodes(graph: any): any {
  graph = JSON.parse(graph);
  const elements = parser(graph);

  let nodes: object[] = [],
    edges: object[] = [];

  elements.forEach((el) => {
    const renderText = (value: string | object) => {
      if (value instanceof Object) {
        let temp = "";
        const entries = Object.entries(value);

        if (Object.keys(value).every((val) => !isNaN(+val))) {
          return Object.values(value).join("");
        }

        entries.forEach((entry) => {
          temp += `${entry[0]}: ${entry[1]}\n`;
        });

        return temp;
      }

      return value;
    };

    if (isNode(el)) {
      nodes.push({
        id: el.id,
        text: renderText(el.data.label),
      });
    } else {
      edges.push({
        id: el.id,
        from: el.source,
        to: el.target,
      });
    }
  });

  return {
    nodes,
    edges,
  };
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const getLayoutPosition = (
  direction: string,
  elements: Elements,
  dynamic = false
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        width: dynamic ? el.__rf.width : 400,
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

export function getNextLayout(layout: CanvasDirection) {
  switch (layout) {
    case "LEFT":
      return "UP";

    case "UP":
      return "RIGHT";

    case "RIGHT":
      return "DOWN";

    default:
      return "LEFT";
  }
}

export function getLayout(layout: CanvasDirection, json: string, dynamic = false) {
  const jsonToGraph = parser(json);
  const layoutedElements = getLayoutPosition(layout, jsonToGraph, dynamic);

  return layoutedElements;
}
