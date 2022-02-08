import { isNode } from "react-flow-renderer";
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
      const text = renderText(el.data.label);
      const lines = text.split("\n");
      const lineLength = lines.map((line) => line.length);
      const longestLine = lineLength.sort()[lineLength.length - 1];

      nodes.push({
        id: el.id,
        text: text,
        width: 35 + longestLine * 8,
        height: 30 + lines.length * 10,
        data: { type: "special" },
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
