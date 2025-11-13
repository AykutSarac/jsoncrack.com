import React from "react";
import type { CustomNodeProps } from ".";
import { NODE_DIMENSIONS } from "../../../../../constants/graph";
import type { NodeData } from "../../../../../types/graph";
import useNodeEdit from "../stores/useNodeEdit";
import { RowEditComponent } from "./RowEditComponent";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

type RowProps = {
  row: NodeData["text"][number];
  x: number;
  y: number;
  index: number;
  nodeId: string;
  nodePath: NodeData["path"];
  isEditing: boolean;
};

const Row = ({ row, x, y, index, nodeId, nodePath, isEditing }: RowProps) => {
  const rowPosition = index * NODE_DIMENSIONS.ROW_HEIGHT;
  const { editingNodeId } = useNodeEdit();
  const isRowEditing = isEditing && editingNodeId === nodeId;

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
    >
      {isRowEditing ? (
        <RowEditComponent row={row} nodePath={nodePath} />
      ) : (
        <>
          <Styled.StyledKey $type="object">{row.key}: </Styled.StyledKey>
          <TextRenderer>{getRowText()}</TextRenderer>
        </>
      )}
    </Styled.StyledRow>
  );
};

const Node = ({ node, x, y }: CustomNodeProps) => {
  const { editingNodeId, toggleEdit } = useNodeEdit();
  const isEditing = editingNodeId === node.id;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEdit(node.id);
  };

  return (
    <>
      <Styled.StyledForeignObject
        data-id={`node-${node.id}`}
        width={node.width}
        height={node.height}
        x={0}
        y={0}
        $isObject
      >
        {node.text.map((row, index) => (
          <Row
            key={`${node.id}-${index}`}
            row={row}
            x={x}
            y={y}
            index={index}
            nodeId={node.id}
            nodePath={node.path}
            isEditing={isEditing}
          />
        ))}

        <Styled.StyledEditButton
          $isActive={isEditing}
          onClick={handleEditClick}
          title={isEditing ? "Close editor" : "Edit node"}
          style={{ position: "absolute", top: -8, right: -8 }}
        >
          ✎
        </Styled.StyledEditButton>
      </Styled.StyledForeignObject>
    </>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    JSON.stringify(prev.node.text) === JSON.stringify(next.node.text) &&
    prev.node.width === next.node.width
  );
}

export const ObjectNode = React.memo(Node, propsAreEqual);
