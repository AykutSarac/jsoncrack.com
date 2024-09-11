import React from "react";
import styled from "styled-components";
import { MdLink, MdLinkOff } from "react-icons/md";
import type { CustomNodeProps } from "src/containers/Editor/components/views/GraphView/CustomNode";
import { isContentImage } from "src/containers/Editor/components/views/GraphView/lib/utils/calculateNodeSize";
import useGraph from "src/containers/Editor/components/views/GraphView/stores/useGraph";
import useToggleHide from "src/hooks/useToggleHide";
import useConfig from "src/store/useConfig";
import { TextRenderer } from "./TextRenderer";
import * as Styled from "./styles";

const StyledExpand = styled.button`
  pointer-events: all;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.TEXT_NORMAL};
  background: rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 40px;
  border-left: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }
`;

const StyledTextNodeWrapper = styled.span<{ $hasCollapse: boolean }>`
  display: flex;
  justify-content: ${({ $hasCollapse }) => ($hasCollapse ? "space-between" : "center")};
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledImageWrapper = styled.div`
  padding: 5px;
`;

const StyledImage = styled.img`
  border-radius: 2px;
  object-fit: contain;
  background: ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
`;

const Node = ({ node, x, y, hasCollapse = false }: CustomNodeProps) => {
  const {
    id,
    text,
    width,
    height,
    data: { isParent, childrenCount, type },
  } = node;
  const { validateHiddenNodes } = useToggleHide();
  const collapseButtonVisible = useConfig(state => state.collapseButtonVisible);
  const childrenCountVisible = useConfig(state => state.childrenCountVisible);
  const imagePreviewEnabled = useConfig(state => state.imagePreviewEnabled);
  const expandNodes = useGraph(state => state.expandNodes);
  const collapseNodes = useGraph(state => state.collapseNodes);
  const isExpanded = useGraph(state => state.collapsedParents.includes(id));
  const isImage = imagePreviewEnabled && isContentImage(text as string);
  const value = JSON.stringify(text).replaceAll('"', "");

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isExpanded) collapseNodes(id);
    else expandNodes(id);
    validateHiddenNodes();
  };

  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      {isImage ? (
        <StyledImageWrapper>
          <StyledImage src={text as string} width="70" height="70" loading="lazy" />
        </StyledImageWrapper>
      ) : (
        <StyledTextNodeWrapper
          data-x={x}
          data-y={y}
          data-key={JSON.stringify(text)}
          $hasCollapse={isParent && collapseButtonVisible}
        >
          <Styled.StyledKey $value={value} $parent={isParent} $type={type}>
            <TextRenderer>{value}</TextRenderer>
          </Styled.StyledKey>
          {isParent && childrenCount > 0 && childrenCountVisible && (
            <Styled.StyledChildrenCount>({childrenCount})</Styled.StyledChildrenCount>
          )}

          {isParent && hasCollapse && collapseButtonVisible && (
            <StyledExpand aria-label="Expand" onClick={handleExpand}>
              {isExpanded ? <MdLinkOff size={18} /> : <MdLink size={18} />}
            </StyledExpand>
          )}
        </StyledTextNodeWrapper>
      )}
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    prev.node.text === next.node.text &&
    prev.node.width === next.node.width &&
    prev.node.data.childrenCount === next.node.data.childrenCount
  );
}

export const TextNode = React.memo(Node, propsAreEqual);
