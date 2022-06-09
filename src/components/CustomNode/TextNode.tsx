import React from "react";
import RenderIfVisible from "react-render-if-visible";
import { CustomNodeProps } from ".";
import * as Styled from "./styles";

const TextNode: React.FC<CustomNodeProps<string>> = ({
  width,
  height,
  value,
  isParent = false,
  x,
  y,
}) => {
  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <RenderIfVisible>
        <Styled.StyledTextWrapper>
          <Styled.StyledText width={width} height={height}>
            <Styled.StyledKey
              data-x={x}
              data-y={y}
              data-key={value}
              parent={isParent}
            >
              {value}
            </Styled.StyledKey>
          </Styled.StyledText>
        </Styled.StyledTextWrapper>
      </RenderIfVisible>
    </Styled.StyledForeignObject>
  );
};

export default TextNode;
