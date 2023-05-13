import React from "react";
import { CustomNodeProps } from "src/components/CustomNode";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

const Node: React.FC<CustomNodeProps> = ({ node, x, y }) => {
  const { text, width, height, data } = node;
  if (data.isEmpty) return null;

  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0} isObject>
      {text.map((val, idx) => {
        return (
          <Styled.StyledRow
            data-key={JSON.stringify(val)}
            data-type={JSON.stringify(val[1])}
            data-x={x}
            data-y={y + idx * 17.8}
            key={idx}
          >
            <Styled.StyledKey objectKey>
              {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
            </Styled.StyledKey>
            <TextRenderer>{JSON.stringify(val[1])}</TextRenderer>
          </Styled.StyledRow>
        );
      })}
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return String(prev.node.text) === String(next.node.text) && prev.node.width === next.node.width;
}

export const ObjectNode = React.memo(Node, propsAreEqual);
