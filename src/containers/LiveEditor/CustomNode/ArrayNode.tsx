import React from "react";
import { CustomNodeProps } from ".";
import * as Styled from "./styles";

const ArrayNode: React.FC<CustomNodeProps<string>> = ({ width, height, value }) => {
  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <Styled.StyledTextWrapper>
        <Styled.StyledText width={width} height={height}>
          <Styled.StyledKey arrayValue>{value}</Styled.StyledKey>
        </Styled.StyledText>
      </Styled.StyledTextWrapper>
    </Styled.StyledForeignObject>
  );
};

export default ArrayNode;
