import React from "react";
import type { CustomNodeProps } from ".";
import { NODE_DIMENSIONS } from "../../../../../constants/graph";
import type { NodeData } from "../../../../../types/graph";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";
import useGraph from "../stores/useGraph";
import useJson from "../../../../../store/useJson";
import { useNodeEdit } from "../../../../../store/useNodeEdit";
import updateJsonStyles from "../../../../../lib/utils/json/updateJsonStyles";
import styled from "styled-components";

type RowProps = {
  row: NodeData["text"][number];
  x: number;
  y: number;
  index: number;
  styles?: { displayName?: string } | null;
};

const Row = ({ row, x, y, index, styles }: RowProps) => {
  const rowPosition = index * NODE_DIMENSIONS.ROW_HEIGHT;

  const getRowText = () => {
    if (row.type === "object") return `{${row.childrenCount ?? 0} keys}`;
    if (row.type === "array") return `[${row.childrenCount ?? 0} items]`;
    return row.value;
  };

  // if this row is the "name" key and styles.displayName exists, show the displayName instead of original value
  const valueToRender = row.key === "name" && styles?.displayName ? styles.displayName : getRowText();

  return (
    <Styled.StyledRow
      $value={row.value}
      data-key={`${row.key}: ${row.value}`}
      data-x={x}
      data-y={y + rowPosition}
    >
      <Styled.StyledKey $type="object">{row.key}: </Styled.StyledKey>
      <TextRenderer>{valueToRender}</TextRenderer>
    </Styled.StyledRow>
  );
};

const EditControlsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  /* default click-through so node selection works by clicking anywhere */
  pointer-events: none;
`;

const EditButton = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;
  background: transparent;
  border: 1px solid rgba(0,0,0,0.08);
  padding: 2px 6px;
  font-size: 11px;
  cursor: pointer;
  pointer-events: all;
  z-index: 20;
`;

const EditForm = styled.div`
  position: absolute;
  right: 6px;
  top: 28px;
  background: white;
  border: 1px solid #ddd;
  padding: 8px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 6px;
  pointer-events: all;
`;

const Node = ({ node, x, y }: CustomNodeProps) => {
  const selectedNode = useGraph(state => state.selectedNode);
  const isSelected = selectedNode?.id === node.id;

  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);

  const { open, editingNodeId, draft, start, updateDraft, reset, suppressInline } = useNodeEdit();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // pick first row as default name and coerce to string
    const defaultName = node.text?.[0]?.value ?? "";
    start(node.id, { name: String(defaultName), color: "#4C6EF5" });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = updateJsonStyles(json, node.id, { displayName: draft.name, color: draft.color });
    setJson(next);
    reset();
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    reset();
  };

  return (
    <Styled.StyledForeignObject
      data-id={`node-${node.id}`}
      width={node.width}
      height={node.height}
      x={0}
      y={0}
      $isObject
    >
      <EditControlsWrapper>
        {(() => {
          try {
            const parsed = JSON.parse(useJson.getState().json || "{}");
            const styles = parsed?._styles?.[node.id] ?? null;
            return node.text.map((row, index) => (
              <Row key={`${node.id}-${index}`} row={row} x={x} y={y} index={index} styles={styles} />
            ));
          } catch (e) {
            return node.text.map((row, index) => (
              <Row key={`${node.id}-${index}`} row={row} x={x} y={y} index={index} styles={null} />
            ));
          }
        })()}

        {/* Inline edit UI removed — editing should happen only via the modal */}
      </EditControlsWrapper>
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    JSON.stringify(prev.node.text) === JSON.stringify(next.node.text) &&
    prev.node.width === next.node.width
  );
}

export const ObjectNode = React.memo(Node, propsAreEqual);
