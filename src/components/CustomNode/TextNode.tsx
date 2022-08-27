import React from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { NodeData, EdgeData } from "reaflow";
import { ConditionalWrapper, CustomNodeProps } from "src/components/CustomNode";
import useConfig from "src/hooks/store/useConfig";
import useGraph from "src/hooks/store/useGraph";
import styled from "styled-components";
import * as Styled from "./styles";

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

const TextNode: React.FC<CustomNodeProps<string> & { node: NodeData }> = ({
  node,
  width,
  height,
  value,
  isParent = false,
  x,
  y,
}) => {
  const performanceMode = useConfig((state) => state.performanceMode);
  const expand = useConfig((state) => state.expand);
  const [isExpanded, setIsExpanded] = React.useState(!expand);
  const toggleNode = useGraph((state) => state.toggleNode);

  React.useEffect(() => {
    setIsExpanded(expand);
  }, [expand]);

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleNode(node, isExpanded);
    setIsExpanded(!isExpanded);
  };

  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <ConditionalWrapper condition={performanceMode}>
        <Styled.StyledText parent={isParent} width={width} height={height}>
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
        </Styled.StyledText>
      </ConditionalWrapper>
      {isParent && (
        <StyledExpand onClick={handleExpand}>
          {isExpanded ? (
            <BiChevronRight size={20} />
          ) : (
            <BiChevronLeft size={20} />
          )}
        </StyledExpand>
      )}
    </Styled.StyledForeignObject>
  );
};

export default TextNode;
