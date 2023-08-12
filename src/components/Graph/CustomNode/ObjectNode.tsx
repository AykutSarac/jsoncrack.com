import React from "react";
import { CustomNodeProps } from "src/components/Graph/CustomNode";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

type Value = [string, string];

type RowProps = {
  val: Value;
  x: number;
  y: number;
  index: number;
};

const Row = ({ val, x, y, index }: RowProps) => {
  return (
    <Styled.StyledRow
      data-key={JSON.stringify(val)}
      data-x={x}
      data-y={y + index * 17.8}
      $type={JSON.stringify(val[1])}
    >
      <Styled.StyledKey $objectKey>{JSON.stringify(val[0]).replaceAll('"', "")}: </Styled.StyledKey>
      <TextRenderer>{JSON.stringify(val[1])}</TextRenderer>
    </Styled.StyledRow>
  );
};

const Node: React.FC<CustomNodeProps> = ({ node, x, y }) => (
  <Styled.StyledForeignObject width={node.width} height={node.height} x={0} y={0} $isObject>
    {(node.text as Value[]).map((val, idx) => (
      <Row val={val} index={idx} x={x} y={y} key={idx} />
    ))}
  </Styled.StyledForeignObject>
);

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return String(prev.node.text) === String(next.node.text) && prev.node.width === next.node.width;
}

export const ObjectNode = React.memo(Node, propsAreEqual);
