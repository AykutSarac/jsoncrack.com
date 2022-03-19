import styled from "styled-components";

export const StyledTextWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
`;

export const StyledText = styled.pre<{
  width: number;
  height: number;
}>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  color: ${({ theme }) => theme.SILVER};
`;

export const StyledForeignObject = styled.foreignObject<{
  width: number;
  height: number;
}>`
  position: "relative" !important;
  pointer-events: "none" !important;
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
`;

export const StyledKey = styled.span<{
  objectKey?: boolean;
  parent?: boolean;
}>`
  color: ${({ theme, objectKey, parent }) =>
    parent ? theme.ORANGE : objectKey ? theme.BLURPLE : theme.LIGHTGREEN};
`;

export const StyledRow = styled.div<{ width: number }>`
  height: fit-content;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 auto;
  width: ${({ width }) => `${width - 20}px`};
`;
