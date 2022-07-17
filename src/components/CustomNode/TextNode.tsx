import React from "react";
import { useConfig } from "src/hocs/config";
import { ConditionalWrapper, CustomNodeProps } from "src/components/CustomNode";
import * as Styled from "./styles";

const TextNode: React.FC<CustomNodeProps<string>> = ({
  width,
  height,
  value,
  isParent = false,
  x,
  y,
}) => {
  const { settings } = useConfig();

  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <ConditionalWrapper condition={settings.performance}>
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
      </ConditionalWrapper>
    </Styled.StyledForeignObject>
  );
};

export default TextNode;
