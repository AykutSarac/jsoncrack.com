import React, { memo } from "react";
import { Label, Node, Port, NodeChildProps, NodeProps } from "reaflow";
import styled from "styled-components";

const StyledNode = styled(Node)`
  stroke: black;
  stroke-width: 1;
`;

const StyledTextWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  width: 100%;
  height: 100%;
`;

const StyledText = styled.pre<{ width: number; height: number }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  color: ${({ theme }) => theme.SILVER};
`;

const StyledForeignObject = styled.foreignObject<{
  width: number;
  height: number;
}>`
  position: "relative" !important;
  pointer-events: "none" !important;
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
`;

const StyledKey = styled.span<{ bond?: boolean; arrayValue?: boolean }>`
  color: ${({ theme, bond, arrayValue }) =>
    bond ? theme.SEAGREEN : arrayValue ? theme.ORANGE : theme.BLURPLE};
`;

const baseLabelStyle = {
  fill: "transparent",
  stroke: "transparent",
  strokeWidth: 0,
};

const basePortStyle = {
  fill: "black",
};

const CustomNode = ({ nodeProps }) => {
  const { properties: data } = nodeProps;

  return (
    <StyledNode
      label={<Label style={baseLabelStyle} />}
      port={<Port style={basePortStyle} rx={10} ry={10} />}
      {...nodeProps}
    >
      {(nodeProps: NodeProps) => {
        const { width, height } = nodeProps;

        if (data.text instanceof Object) {
          const entries = Object.entries(data.text);

          if (Object.keys(data.text).every((val) => !isNaN(+val))) {
            return (
              <StyledForeignObject width={width} height={height} x={0} y={0}>
                <StyledTextWrapper>
                  <StyledText width={width} height={height}>
                    <StyledKey arrayValue>
                      {Object.values(data.text).join("")}
                    </StyledKey>
                  </StyledText>
                </StyledTextWrapper>
              </StyledForeignObject>
            );
          }

          return (
            <StyledForeignObject width={width} height={height} x={0} y={0}>
              <StyledTextWrapper>
                <StyledText width={width} height={height}>
                  {entries.map((val) => (
                    <div
                      key={nodeProps.id}
                      style={{ height: "fit-content" }}
                    >
                      <StyledKey>{val[0]}: </StyledKey>
                      {val[1]}
                    </div>
                  ))}
                </StyledText>
              </StyledTextWrapper>
            </StyledForeignObject>
          );
        }

        return (
          <StyledForeignObject width={width} height={height} x={0} y={0}>
            <StyledTextWrapper>
              <StyledText width={width} height={height}>
                <StyledKey bond>{data.text}</StyledKey>
              </StyledText>
            </StyledTextWrapper>
          </StyledForeignObject>
        );
      }}
    </StyledNode>
  );
};

export const NodeWrapper = (nodeProps: NodeProps) => {
  return nodeProps.properties?.data?.type ? (
    <CustomNode nodeProps={nodeProps} />
  ) : (
    <Node {...nodeProps} />
  );
};
