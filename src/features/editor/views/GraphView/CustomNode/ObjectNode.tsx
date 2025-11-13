import React from "react";
import { ActionIcon } from "@mantine/core";
import { LuPencil } from "react-icons/lu";
import type { CustomNodeProps } from ".";
import { NODE_DIMENSIONS } from "../../../../../constants/graph";
import type { NodeData } from "../../../../../types/graph";
import useGraph from "../stores/useGraph";
import { useModal } from "../../../../../store/useModal";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

type RowProps = {
  row: NodeData["text"][number];
  x: number;
  y: number;
  index: number;
  nodeData: NodeData;
};

const Row = ({ row, x, y, index, nodeData }: RowProps) => {
  const rowPosition = index * NODE_DIMENSIONS.ROW_HEIGHT;
  const setSelectedNode = useGraph(state => state.setSelectedNode);
  const setVisible = useModal(state => state.setVisible);
  const [isHovered, setIsHovered] = React.useState(false);
  const isPrimitive = row.type !== "object" && row.type !== "array";

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode(nodeData);
    setVisible("EditNodeModal", true);
  };

  const getRowText = () => {
    if (row.type === "object") return `{${row.childrenCount ?? 0} keys}`;
    if (row.type === "array") return `[${row.childrenCount ?? 0} items]`;
    return row.value;
  };

  return (
    <Styled.StyledRow
      $value={row.value}
      data-key={`${row.key}: ${row.value}`}
      data-x={x}
      data-y={y + rowPosition}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Styled.StyledKey $type="object">{row.key}: </Styled.StyledKey>
      <TextRenderer>{getRowText()}</TextRenderer>
      {isPrimitive && isHovered && (
        <Styled.StyledEditButton>
          <ActionIcon
            size="xs"
            variant="subtle"
            color="blue"
            onClick={handleEdit}
            aria-label="Edit value"
          >
            <LuPencil size={12} />
          </ActionIcon>
        </Styled.StyledEditButton>
      )}
    </Styled.StyledRow>
  );
};

const Node = ({ node, x, y }: CustomNodeProps) => (
  <Styled.StyledForeignObject
    data-id={`node-${node.id}`}
    width={node.width}
    height={node.height}
    x={0}
    y={0}
    $isObject
  >
    {node.text.map((row, index) => (
      <Row key={`${node.id}-${index}`} row={row} x={x} y={y} index={index} nodeData={node} />
    ))}
  </Styled.StyledForeignObject>
);

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    JSON.stringify(prev.node.text) === JSON.stringify(next.node.text) &&
    prev.node.width === next.node.width
  );
}

export const ObjectNode = React.memo(Node, propsAreEqual);
