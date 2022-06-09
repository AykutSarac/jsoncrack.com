import React from "react";
import RenderIfVisible from "react-render-if-visible";
import { CustomNodeProps } from ".";
import * as Styled from "./styles";

const ObjectNode: React.FC<CustomNodeProps<[string, string][]>> = ({
  width,
  height,
  value,
  x,
  y,
}) => {
  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <RenderIfVisible>
        <Styled.StyledTextWrapper>
          <Styled.StyledText width={width} height={height}>
            {value.map(
              (val, idx) =>
                val[1] && (
                  <Styled.StyledRow
                    data-key={val[1]}
                    data-x={x}
                    data-y={y}
                    key={idx}
                    width={width}
                  >
                    <Styled.StyledKey objectKey>{val[0]}: </Styled.StyledKey>
                    {val[1]}
                  </Styled.StyledRow>
                )
            )}
          </Styled.StyledText>
        </Styled.StyledTextWrapper>
      </RenderIfVisible>
    </Styled.StyledForeignObject>
  );
};

export default ObjectNode;
