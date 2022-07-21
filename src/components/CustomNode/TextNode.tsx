import React from "react";
import { ConditionalWrapper, CustomNodeProps } from "src/components/CustomNode";
import useConfig from "src/hooks/store/useConfig";
import * as Styled from "./styles";

const TextNode: React.FC<CustomNodeProps<string>> = ({
  width,
  height,
  value,
  isParent = false,
  x,
  y,
}) => {
  const performance = useConfig((state) => state.settings.performance);

  return (
    <Styled.StyledForeignObject width={width} height={height} x={0} y={0}>
      <ConditionalWrapper condition={performance}>
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
