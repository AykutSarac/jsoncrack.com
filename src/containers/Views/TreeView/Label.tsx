import React from "react";
import { styled, DefaultTheme } from "styled-components";
import { KeyPath } from "react-json-tree";

interface LabelProps {
  keyPath: KeyPath;
  nodeType: string;
}

function getLabelColor({ $type, theme }: { $type?: string; theme: DefaultTheme }) {
  if ($type === "Object") return theme.NODE_COLORS.PARENT_OBJ;
  if ($type === "Array") return theme.NODE_COLORS.PARENT_ARR;
  return theme.NODE_COLORS.PARENT_OBJ;
}

const StyledLabel = styled.span<{ $nodeType?: string }>`
  color: ${({ theme, $nodeType }) => getLabelColor({ theme, $type: $nodeType })};

  &:hover {
    filter: brightness(1.5);
    transition: filter 0.2s ease-in-out;
  }
`;

export const Label = ({ keyPath, nodeType }: LabelProps) => {
  return <StyledLabel $nodeType={nodeType}>{keyPath[0]}:</StyledLabel>;
};
