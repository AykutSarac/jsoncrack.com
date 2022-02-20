import React from "react";
import { CustomNodeProps } from ".";
import * as Styled from "./styles";

const ObjectNode: React.FC<CustomNodeProps<[string, unknown][]>> = ({
  width,
  height,
  value,
}) => {
  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <Styled.StyledTextWrapper>
        <Styled.StyledText width={width} height={height}>
          {value.map(
            (val, idx) =>
              val[1] && (
                <Styled.StyledRow key={idx} width={width}>
                  <Styled.StyledKey>{val[0]}: </Styled.StyledKey>
                  {val[1]}
                </Styled.StyledRow>
              )
          )}
        </Styled.StyledText>
      </Styled.StyledTextWrapper>
    </Styled.StyledForeignObject>
  );
};

export default ObjectNode;
