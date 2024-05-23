import React from "react";
import type { CustomNodeProps } from "src/modules/GraphView/CustomNode";
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
  const key = JSON.stringify(val);
  const rowKey = JSON.stringify(val[0]).replaceAll('"', "");
  const rowValue = JSON.stringify(val[1]);

  return (
    <Styled.StyledRow $value={rowValue} data-key={key} data-x={x} data-y={y + index * 17.8}>
      <Styled.StyledKey $type="object">{rowKey}: </Styled.StyledKey>
      <TextRenderer>{rowValue}</TextRenderer>
    </Styled.StyledRow>
  );
};

const Node = ({ node, x, y }: CustomNodeProps) => (
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
