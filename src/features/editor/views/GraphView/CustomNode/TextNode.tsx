import React from "react";
import styled from "styled-components";
import type { CustomNodeProps } from ".";
import useConfig from "../../../../../store/useConfig";
import { isContentImage } from "../lib/utils/calculateNodeSize";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";
import useGraph from "../stores/useGraph";
import useJson from "../../../../../store/useJson";
import { useNodeEdit } from "../../../../../store/useNodeEdit";
import updateJsonStyles from "../../../../../lib/utils/json/updateJsonStyles";

const StyledTextNodeWrapper = styled.span<{ $isParent: boolean }>`
  display: flex;
  justify-content: ${({ $isParent }) => ($isParent ? "center" : "flex-start")};
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0 10px;
`;

const StyledImageWrapper = styled.div`
  padding: 5px;
`;

const StyledImage = styled.img`
  border-radius: 2px;
  object-fit: contain;
  background: ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
`;

const EditControlsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  /* keep node content click-through by default; only interactive children opt-in */
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
  pointer-events: all; /* allow clicking the button */
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
  pointer-events: all; /* make the form interactive */
`;

const Node = ({ node, x, y }: CustomNodeProps) => {
  const { text, width, height } = node;
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);
  const isImage = imagePreviewEnabled && isContentImage(JSON.stringify(text[0].value));
  const value = text[0].value;
  const json = useJson(state => state.json);
  const setJson = useJson(state => state.setJson);

  // read styles for displayName
  let displayName: string | undefined;
  try {
    const parsed = JSON.parse(json ?? "{}");
    const styles = parsed?._styles?.[node.id];
    if (styles && styles.displayName) displayName = String(styles.displayName);
  } catch (e) {
    displayName = undefined;
  }
  const selectedNode = useGraph(state => state.selectedNode);
  const isSelected = selectedNode?.id === node.id;

  const { open, editingNodeId, draft, start, updateDraft, reset, suppressInline } = useNodeEdit();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    start(node.id, { name: String(value ?? ""), color: "#4C6EF5" });
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
      width={width}
      height={height}
      x={0}
      y={0}
    >
      {isImage ? (
        <StyledImageWrapper>
          <StyledImage src={JSON.stringify(text[0].value)} width="70" height="70" loading="lazy" />
        </StyledImageWrapper>
      ) : (
  <EditControlsWrapper data-x={x} data-y={y} data-key={JSON.stringify(text)}>
          <StyledTextNodeWrapper
            data-x={x}
            data-y={y}
            data-key={JSON.stringify(text)}
            $isParent={false}
          >
            <Styled.StyledKey $value={value} $type={typeof text[0].value}>
              <TextRenderer>{displayName ?? value}</TextRenderer>
            </Styled.StyledKey>
          </StyledTextNodeWrapper>

          {/* Inline edit UI intentionally removed — editing happens only via the modal */}
        </EditControlsWrapper>
      )}
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return prev.node.text === next.node.text && prev.node.width === next.node.width;
}

export const TextNode = React.memo(Node, propsAreEqual);
