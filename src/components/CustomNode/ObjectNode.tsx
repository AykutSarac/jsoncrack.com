import React from "react";
import { CustomNodeProps } from "src/components/CustomNode";
import useConfig from "src/hooks/store/useConfig";
import { useInViewport } from "react-in-viewport";
import * as Styled from "./styles";

const inViewport = true;

type ObjectNodeProps = CustomNodeProps<[string, string][]>;

const ObjectNode: React.FC<ObjectNodeProps> = ({
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

function propsAreEqual(prev: ObjectNodeProps, next: ObjectNodeProps) {
  return String(prev.value) === String(next.value) && prev.width === next.width;
}

export default React.memo(ObjectNode, propsAreEqual);
