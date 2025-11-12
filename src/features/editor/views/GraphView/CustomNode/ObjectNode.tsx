// ObjectNode.tsx
import React from "react";
import styled from "styled-components";
import type { CustomNodeProps } from ".";
import { NODE_DIMENSIONS } from "../../../../../constants/graph";
import type { NodeData } from "../../../../../types/graph";
import useFile from "../../../../../store/useFile";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

const StyledEditContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  height: ${NODE_DIMENSIONS.ROW_HEIGHT}px;
  pointer-events: all;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 2px 4px;
  border: 1px solid ${({ theme }) => theme.INTERACTIVE_NORMAL};
  border-radius: 3px;
  background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  color: ${({ theme }) => theme.TEXT_NORMAL};
  font-size: 11px;
  font-family: monospace;
`;

const StyledSmallButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 2px 6px;
  border: none;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;
  pointer-events: all;
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.TEXT_POSITIVE : theme.BACKGROUND_MODIFIER_ACCENT};
  color: ${({ theme, $variant }) => ($variant === "primary" ? "#fff" : theme.TEXT_NORMAL)};
  &:hover { opacity: 0.8; }
`;

/** NEW: local layout to keep the edit button visible without changing outside interactions */
const RowShell = styled.div`
  position: relative;                 /* anchor the absolute button */
  display: flex;
  align-items: center;
  width: 100%;
  height: ${NODE_DIMENSIONS.ROW_HEIGHT}px;
`;

const ContentClamp = styled.div`
  width: 100%;
  min-width: 0;
  padding-right: 56px;                /* reserve space for the absolute edit button */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledEditButton = styled.button`
  position: absolute;                 /* keep visible even when text is long */
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 1px 4px;
  border: none;
  border-radius: 2px;
  font-size: 9px;
  cursor: pointer;
  pointer-events: all;
  background: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  color: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  opacity: 0.85;
  flex-shrink: 0;
  &:hover { opacity: 1; }
`;

type RowProps = {
  row: NodeData["text"][number];
  x: number;
  y: number;
  index: number;
  node: NodeData;
};

const Row = ({ row, x, y, index, node }: RowProps) => {
  const rowPosition = index * NODE_DIMENSIONS.ROW_HEIGHT;
  const setContents = useFile(state => state.setContents);
  const getContents = useFile(state => state.getContents);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(String(row.value));

  const getRowText = () => {
    if (row.type === "object") return `{${row.childrenCount ?? 0} keys}`;
    if (row.type === "array") return `[${row.childrenCount ?? 0} items]`;
    return row.value;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (row.type === "object") return; // unchanged behavior
    setIsEditing(true);
    setEditValue(String(row.value));
  };

  const coerceScalar = (raw: string): any => {
    let newValue: any = raw;
    if (!isNaN(Number(raw)) && raw.trim() !== "") {
      newValue = Number(raw);
    } else if (raw === "true" || raw === "false") {
      newValue = raw === "true";
    } else if (raw === "null") {
      newValue = null;
    }
    return newValue;
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const currentJson = JSON.parse(getContents());

      if (node.path && node.path.length > 0) {
        let current: any = currentJson;
        for (let i = 0; i < node.path.length; i++) {
          current = current[node.path[i]];
        }

        if (row.key) {
          current[row.key] = coerceScalar(editValue);
        }
      }

      setContents({ contents: JSON.stringify(currentJson, null, 2) });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
      setIsEditing(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(String(row.value));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <StyledEditContainer
        data-key={`${row.key}: ${row.value}`}
        data-x={x}
        data-y={y + rowPosition}
      >
        <Styled.StyledKey $type="object">{row.key}: </Styled.StyledKey>
        <StyledInput
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onClick={e => e.stopPropagation()}
          autoFocus
        />
        <StyledSmallButton $variant="primary" onClick={handleSave}>Save</StyledSmallButton>
        <StyledSmallButton $variant="secondary" onClick={handleCancel}>Cancel</StyledSmallButton>
      </StyledEditContainer>
    );
  }

  return (
    <Styled.StyledRow
      $value={row.value}
      data-key={`${row.key}: ${row.value}`}
      data-x={x}
      data-y={y + rowPosition}
    >
      <RowShell>
        <Styled.StyledKey $type="object">{row.key}: </Styled.StyledKey>
        <ContentClamp>
          <TextRenderer>{getRowText()}</TextRenderer>
        </ContentClamp>
        {row.type !== "object" && <StyledEditButton onClick={handleEdit}>Edit</StyledEditButton>}
      </RowShell>
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
      <Row key={`${node.id}-${index}`} row={row} x={x} y={y} index={index} node={node} />
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
