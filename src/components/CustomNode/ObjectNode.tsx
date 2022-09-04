import React from "react";
import { CustomNodeProps } from "src/components/CustomNode";
import useConfig from "src/hooks/store/useConfig";
import { useInViewport } from "react-in-viewport";
import * as Styled from "./styles";

const inViewport = true;

const ObjectNode: React.FC<CustomNodeProps<[string, string][]>> = ({
  width,
  height,
  value,
  x,
  y,
}) => {
  const ref = React.useRef(null);
  // const { inViewport } = useInViewport(ref);
  const performanceMode = useConfig((state) => state.performanceMode);

  return (
    <Styled.StyledForeignObject
      width={width}
      height={height}
      x={0}
      y={0}
      ref={ref}
      isObject
    >
      {(!performanceMode || inViewport) &&
        value.map((val, idx) => (
          <Styled.StyledRow
            data-key={JSON.stringify(val[1])}
            data-x={x}
            data-y={y}
            key={idx}
          >
            <Styled.StyledKey objectKey>
              {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
            </Styled.StyledKey>
            <Styled.StyledLinkItUrl>
              {JSON.stringify(val[1])}
            </Styled.StyledLinkItUrl>
          </Styled.StyledRow>
        ))}
    </Styled.StyledForeignObject>
  );
};

export default ObjectNode;
