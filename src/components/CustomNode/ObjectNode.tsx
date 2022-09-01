import React from "react";
import { CustomNodeProps } from "src/components/CustomNode";
import useConfig from "src/hooks/store/useConfig";
import { useInViewport } from "react-in-viewport";
import * as Styled from "./styles";

const ObjectNode: React.FC<CustomNodeProps<[string, string][]>> = ({
  width,
  height,
  value,
  x,
  y,
}) => {
  const ref = React.useRef(null);
  const { inViewport } = useInViewport(ref);
  const performanceMode = useConfig((state) => state.performanceMode);

  return (
    <Styled.StyledForeignObject
      width={width}
      height={height}
      x={0}
      y={0}
      ref={ref}
    >
      {(!performanceMode || inViewport) && (
        <Styled.StyledTextWrapper>
          <Styled.StyledText width={width} height={height}>
            {value.map((val, idx) => (
              <Styled.StyledRow
                data-key={JSON.stringify(val[1])}
                data-x={x}
                data-y={y}
                key={idx}
                width={`${width - 20}px`}
                value={JSON.stringify(val[1])}
              >
                <Styled.StyledKey objectKey>
                  {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
                </Styled.StyledKey>
                <Styled.StyledLinkItUrl>
                  {JSON.stringify(val[1])}
                </Styled.StyledLinkItUrl>
              </Styled.StyledRow>
            ))}
          </Styled.StyledText>
        </Styled.StyledTextWrapper>
      )}
    </Styled.StyledForeignObject>
  );
};

export default ObjectNode;
