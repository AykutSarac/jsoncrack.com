import React from "react";
import { MdLink, MdLinkOff } from "react-icons/md";
import { useInViewport } from "react-in-viewport";
import { CustomNodeProps } from "src/components/CustomNode";
import useConfig from "src/hooks/store/useConfig";
import useGraph from "src/hooks/store/useGraph";
import useStored from "src/hooks/store/useStored";
import styled from "styled-components";
import * as Styled from "./styles";

const inViewport = true;

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

const StyledTextNodeWrapper = styled.div<{ hasCollapse: boolean }>`
  display: flex;
  justify-content: ${({ hasCollapse }) =>
    hasCollapse ? "space-between" : "center"};
  align-items: center;
  height: 100%;
  width: 100%;
`;

type TextNodeProps = CustomNodeProps<string> & {
  node: NodeData;
  hasCollapse: boolean;
};

const TextNode: React.FC<TextNodeProps> = ({
  node,
  width,
  height,
  value,
  isParent = false,
  hasCollapse = false,
  x,
  y,
}) => {
  const ref = React.useRef(null);
  // const { inViewport } = useInViewport(ref);
  const performanceMode = useConfig(state => state.performanceMode);

  const hideCollapse = useStored(state => state.hideCollapse);
  const expandNodes = useGraph(state => state.expandNodes);
  const collapseNodes = useGraph(state => state.collapseNodes);
  const isExpanded = useGraph(state => state.collapsedParents.includes(node.id));

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isExpanded) collapseNodes(node.id);
    else expandNodes(node.id);
  };

  return (
    <Styled.StyledForeignObject
      width={width}
      height={height}
      x={0}
      y={0}
      data-nodeid={node.id}
      ref={ref}
      hideCollapse={hideCollapse}
      hasCollapse={isParent && hasCollapse}
    >
      <StyledTextNodeWrapper hasCollapse={isParent && !hideCollapse}>
        {(!performanceMode || inViewport) && (
          <Styled.StyledKey
            data-x={x}
            data-y={y}
            data-key={JSON.stringify(value)}
            parent={isParent}
          >
            <Styled.StyledLinkItUrl>
              {JSON.stringify(value).replaceAll('"', "")}
            </Styled.StyledLinkItUrl>
          </Styled.StyledKey>
        )}

        {inViewport && isParent && hasCollapse && !hideCollapse && (
          <StyledExpand onClick={handleExpand}>
            {isExpanded ? <MdLinkOff size={18} /> : <MdLink size={18} />}
          </StyledExpand>
        )}
      </StyledTextNodeWrapper>
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: TextNodeProps, next: TextNodeProps) {
  return prev.value === next.value;
}

export default React.memo(TextNode, propsAreEqual);
