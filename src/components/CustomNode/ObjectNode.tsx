import React from "react";
import { useConfig } from "src/hocs/config";
import { ConditionalWrapper, CustomNodeProps } from "src/components/CustomNode";
import * as Styled from "./styles";

const ObjectNode: React.FC<CustomNodeProps<[string, string][]>> = ({
  width,
  height,
  value,
  x,
  y,
}) => {
  const { settings } = useConfig();

  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <ConditionalWrapper condition={settings.performance}>
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
      </ConditionalWrapper>
    </Styled.StyledForeignObject>
  );
};

export default ObjectNode;
