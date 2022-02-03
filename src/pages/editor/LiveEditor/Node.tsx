import React from "react";
import { Handle, Position } from "react-flow-renderer";
import styled from "styled-components";

const StyledWrapper = styled.div<{
  isArray?: boolean;
  isElement?: boolean;
  circle?: boolean;
}>`
  background: ${({ theme }) => theme.BLACK_PRIMARY};
  border: 1px solid ${({ theme }) => theme.BLACK};
  border-radius: 5px;
  padding: 16px;
  color: ${({ theme, isArray, isElement }) =>
    isArray ? theme.SEAGREEN : isElement && theme.ORANGE};
  width: ${({ circle }) => (circle ? "20px" : "auto")};
  height: ${({ circle }) => (circle ? "20px" : "auto")};
  min-width: ${({ circle }) => !circle && "100px"};
  text-align: ${({ isArray }) => isArray && "center"};
  border-radius: ${({ circle }) => circle && "50%"};
`;

const StyledKey = styled.span`
  color: ${({ theme }) => theme.BLURPLE};
`;

export const CustomNodeComponent: React.FC<{ data: any; id: string }> = ({
  id,
  data,
}) => {
  const { label: json } = data;

  if (Object.keys(json).length === 0) {
    return (
      <StyledWrapper circle>
        <Handle type="source" position={Position.Left} />
        <Handle type="target" position={Position.Right} />
      </StyledWrapper>
    );
  }

  if (typeof json === "string") {
    return (
      <StyledWrapper isArray>
        {json}
        <Handle type="source" position={Position.Left} />
        <Handle type="target" position={Position.Right} />
      </StyledWrapper>
    );
  }

  if (typeof json === "object") {
    const keyPairs = Object.entries(json);

    // temporary solution for array items
    if (Object.keys(json).every((val) => !isNaN(+val))) {
      return (
        <StyledWrapper isElement>
          {Object.values(json).join("")}
          <Handle type="source" position={Position.Left} />
          <Handle type="target" position={Position.Right} />
        </StyledWrapper>
      );
    }

    return (
      <StyledWrapper>
        {keyPairs.map((entries) => {
          const isValidValue =
            typeof entries[1] === "string" || typeof entries[1] === "number";

          return (
            <div key={entries[0]}>
              <StyledKey>{entries[0]}: </StyledKey>
              {isValidValue && entries[1]}
            </div>
          );
        })}

        <Handle type="source" id={id} position={Position.Left} />
        <Handle type="target" id={id} position={Position.Right} />
      </StyledWrapper>
    );
  }

  return null;
};
