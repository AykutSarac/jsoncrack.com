import { CanvasDirection, NodeData, EdgeData } from "reaflow";
import { parser } from "src/utils/json-editor-parser";

const toString = (value: string | object) => {
  const isObject = value instanceof Object;

  if (isObject) {
    const entries = Object.entries(value);
    const stringObj = entries.map((val) => [val[0], String(val[1])]);

    return Object.fromEntries(stringObj);
  }

  return String(value);
};

export function getEdgeNodes(graph: any, isExpanded: boolean = true): any {
  graph = JSON.parse(graph);
  const elements = parser(graph);

  let nodes: NodeData[] = [],
    edges: EdgeData[] = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (isNode(el)) {
      const text = renderText(el.text);
      const lines = text.split("\n");
      const lineLengths = lines
        .map((line) => line.length)
        .sort((a, b) => a - b);
      const longestLine = lineLengths.reverse()[0];

      const height = (lines.length * 18 < 30 ? 40 : lines.length * 18);

      nodes.push({
        id: el.id,
        text: toString(el.text),
        data: {
          isParent: el.parent,
        },
        width: isExpanded ? 35 + longestLine * 8 : 180,
        height,
      });
    } else {
      edges.push(el);
    }
  }

  return {
    nodes,
    edges,
  };
}

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

function renderText(value: string | object) {
  if (value instanceof Object) {
    let temp = "";
    const entries = Object.entries(value);

    if (Object.keys(value).every((val) => !isNaN(+val))) {
      return Object.values(value).join("");
    }

    entries.forEach((entry) => {
      temp += `${entry[0]}: ${String(entry[1])}\n`;
    });

    return temp;
  }

  return value;
}

function isNode(element: NodeData | EdgeData) {
  if ("text" in element) return true;
  return false;
}
