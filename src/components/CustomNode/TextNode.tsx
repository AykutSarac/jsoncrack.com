import React from "react";
import styled from "styled-components";
import { MdLink, MdLinkOff } from "react-icons/md";
import { CustomNodeProps } from "src/components/CustomNode";
import { isContentImage } from "src/lib/utils/graph/calculateNodeSize";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";
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

const Node: React.FC<CustomNodeProps> = ({ node, x, y, hasCollapse = false }) => {
  const {
    id,
    text,
    width,
    height,
    data: { isParent, childrenCount, type },
  } = node;
  const hideCollapse = useStored(state => state.hideCollapse);
  const showChildrenCount = useStored(state => state.childrenCount);
  const imagePreview = useStored(state => state.imagePreview);
  const expandNodes = useGraph(state => state.expandNodes);
  const collapseNodes = useGraph(state => state.collapseNodes);
  const isExpanded = useGraph(state => state.collapsedParents.includes(id));
  const isImage = imagePreview && isContentImage(text as string);

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isExpanded) collapseNodes(id);
    else expandNodes(id);
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
          $hasCollapse={isParent && hideCollapse}
        >
          <Styled.StyledKey $parent={isParent} type={type}>
            <TextRenderer>{JSON.stringify(text).replaceAll('"', "")}</TextRenderer>
          </Styled.StyledKey>
          {isParent && childrenCount > 0 && showChildrenCount && (
            <Styled.StyledChildrenCount>({childrenCount})</Styled.StyledChildrenCount>
          )}

          {isParent && hasCollapse && hideCollapse && (
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
  return prev.node.text === next.node.text && prev.node.width === next.node.width;
}

export const TextNode = React.memo(Node, propsAreEqual);
