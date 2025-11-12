// TextNode.tsx
import React from "react";
import styled from "styled-components";
import type { CustomNodeProps } from ".";
import useConfig from "../../../../../store/useConfig";
import useFile from "../../../../../store/useFile";
import { isContentImage } from "../lib/utils/calculateNodeSize";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

const StyledTextNodeWrapper = styled.span<{ $isParent: boolean }>`
  display: flex;
  justify-content: ${({ $isParent }) => ($isParent ? "center" : "flex-start")};
  align-items: center;
  height: 100%;
  width: 100%;
  overflow: hidden; /* keep as-is */
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

const StyledEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  width: 100%;
  pointer-events: all;
`;

const StyledInput = styled.input`
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.INTERACTIVE_NORMAL};
  border-radius: 4px;
  background: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  color: ${({ theme }) => theme.TEXT_NORMAL};
  font-size: 12px;
  font-family: monospace;
  width: 100%;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const StyledButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  pointer-events: all;
  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.TEXT_POSITIVE : theme.BACKGROUND_MODIFIER_ACCENT};
  color: ${({ theme, $variant }) => ($variant === "primary" ? "#fff" : theme.TEXT_NORMAL)};
  &:hover { opacity: 0.8; }
`;

/** NEW: local layout that does not change outside interactions */
const RowShell = styled.div`
  position: relative;           /* anchor the absolute button */
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ContentClamp = styled.div`
  width: 100%;
  min-width: 0;
  /* Reserve space for the absolute button so text never sits under it */
  padding-right: 64px;          /* matches max button width + margin */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledEditButton = styled.button`
  position: absolute;           /* keep visible regardless of text length */
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 2px 6px;
  border: none;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;
  pointer-events: all;
  background: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  color: ${({ theme }) => theme.BACKGROUND_PRIMARY};
  opacity: 0.85;
  flex-shrink: 0;
  &:hover { opacity: 1; }
`;

const Node = ({ node, x, y }: CustomNodeProps) => {
  const { text, width, height } = node;
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);
  const isImage = imagePreviewEnabled && isContentImage(JSON.stringify(text[0].value));
  const value = text[0].value;
  const setContents = useFile(state => state.setContents);
  const getContents = useFile(state => state.getContents);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(String(value));

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(String(value));
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
      const contents = getContents();
      let currentJson = JSON.parse(contents);

      if (node.path && node.path.length > 0) {
        let current: any = currentJson;
        for (let i = 0; i < node.path.length - 1; i++) {
          current = current[node.path[i]];
        }
        const lastKey = node.path[node.path.length - 1];
        current[lastKey] = coerceScalar(editValue);
      } else {
        // Only affect root if it is a scalar JSON file; otherwise leave structure untouched.
        // We won't change outer interactions; just attempt scalar replace as before.
        currentJson = coerceScalar(editValue);
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
    setEditValue(String(value));
    setIsEditing(false);
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
      ) : isEditing ? (
        <StyledEditContainer>
          <StyledInput
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onClick={e => e.stopPropagation()}
            autoFocus
          />
          <StyledButtonGroup>
            <StyledButton $variant="primary" onClick={handleSave}>Save</StyledButton>
            <StyledButton $variant="secondary" onClick={handleCancel}>Cancel</StyledButton>
          </StyledButtonGroup>
        </StyledEditContainer>
      ) : (
        <StyledTextNodeWrapper
          data-x={x}
          data-y={y}
          data-key={JSON.stringify(text)}
          $isParent={false}
        >
          <RowShell>
            {/* Keep StyledKey usage unchanged */}
            <Styled.StyledKey $value={value} $type={typeof text[0].value}>
              <ContentClamp>
                <TextRenderer>{String(value)}</TextRenderer>
              </ContentClamp>
            </Styled.StyledKey>

            <StyledEditButton onClick={handleEdit}>Edit</StyledEditButton>
          </RowShell>
        </StyledTextNodeWrapper>
      )}
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return prev.node.text === next.node.text && prev.node.width === next.node.width;
}

export const TextNode = React.memo(Node, propsAreEqual);
