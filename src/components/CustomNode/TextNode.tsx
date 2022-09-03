import React from "react";
import { MdCompareArrows } from "react-icons/md";
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
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  padding: 0;
  color: ${({ theme }) => theme.TEXT_NORMAL};
  background: rgba(0, 0, 0, 0.1);
  min-height: 0;
  height: 100%;
  width: 40px;
  border-radius: 0;
  border-left: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
`;

const TextNode: React.FC<
  CustomNodeProps<string> & { node: NodeData; hasCollapse: boolean }
> = ({
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
  const performanceMode = useConfig((state) => state.performanceMode);

  const hideCollapse = useStored((state) => state.hideCollapse);
  const expandNodes = useGraph((state) => state.expandNodes);
  const collapseNodes = useGraph((state) => state.collapseNodes);
  const [isExpanded, setIsExpanded] = React.useState(true);

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);

    if (isExpanded) collapseNodes(node.id);
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
      {(!performanceMode || inViewport) && (
        <Styled.StyledKey
          data-x={x}
          data-y={y}
          data-key={JSON.stringify(value)}
          parent={isParent}
          hasToggle={hasCollapse}
        >
          <Styled.StyledLinkItUrl>
            {JSON.stringify(value).replaceAll('"', "")}
          </Styled.StyledLinkItUrl>
        </Styled.StyledKey>
      )}

      {inViewport && isParent && hasCollapse && !hideCollapse && (
        <StyledExpand onClick={handleExpand}>
          <MdCompareArrows size={18} />
        </StyledExpand>
      )}
    </Styled.StyledForeignObject>
  );
};

export default TextNode;
