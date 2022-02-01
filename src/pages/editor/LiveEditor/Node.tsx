import React from "react";
import { Handle, Position } from "react-flow-renderer";
import styled from "styled-components";

const StyledWrapper = styled.div<{ isArray?: boolean }>`
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  border-radius: 5px;
  padding: 16px;
  color: ${({ theme, isArray }) => isArray && theme.SEAGREEN};
  width: auto;
  min-width: 100px;
  text-align: ${({ isArray }) => isArray && "center"};
`;

const StyledKey = styled.span`
  color: ${({ theme }) => theme.BLURPLE};
`;

export const CustomNodeComponent: React.FC<{ data: any; id: string }> = ({
  id,
  data,
}) => {
  const { label: json } = data;

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
