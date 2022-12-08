import React, {useCallback} from "react";
// import { useInViewport } from "react-in-viewport";
import { CustomNodeProps } from "src/components/CustomNode";
import useConfig from "src/store/useConfig";
import * as Styled from "./styles";

const inViewport = true;

const ObjectNode: React.FC<CustomNodeProps> = ({ node, x, y }) => {
  const { text, width, height, data } = node;
  const ref = React.useRef(null);
  const performanceMode = useConfig(state => state.performanceMode);
  // const { inViewport } = useInViewport(ref);
  const getNodeValue = useCallback(value => {
    if (typeof value === "string" && value.length > 50) {
      return `${value.substring(0, 10)} ... ${value.substring(value.length - 10, value.length)}`;
    }
    return value;
  }, []);

  if (data.isEmpty) return null;

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
        text.map((val, idx) => (
          <Styled.StyledRow
            data-key={JSON.stringify(val[1])}
            data-x={x}
            data-y={y}
            key={idx}
          >
            <Styled.StyledKey objectKey>
              {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
            </Styled.StyledKey>
            <Styled.StyledLinkItUrl>getNodeValue(JSON.stringify(val[1]))}</Styled.StyledLinkItUrl>
          </Styled.StyledRow>
        ))}
    </Styled.StyledForeignObject>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    String(prev.node.text) === String(next.node.text) &&
    prev.node.width === next.node.width
  );
}

export default React.memo(ObjectNode, propsAreEqual);
