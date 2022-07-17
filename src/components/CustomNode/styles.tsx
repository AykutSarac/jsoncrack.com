import styled from "styled-components";

export const StyledTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
`;

export const StyledText = styled.pre<{ width: number; height: number }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  min-height: 50;
  color: ${({ theme }) => theme.TEXT_NORMAL};
`;

export const StyledForeignObject = styled.foreignObject`
  pointer-events: none;

  * {
    font-family: "Roboto Mono", monospace;
  }

  &.searched {
    border: 2px solid ${({ theme }) => theme.TEXT_POSITIVE};
    border-radius: 2px;
  }

  .highlight {
    background-color: rgba(255, 0, 255, 0.5);
    filter: hue-rotate();
  }

  .renderVisible {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
  }
`;

export const StyledKey = styled.span<{
  objectKey?: boolean;
  parent?: boolean;
}>`
  font-weight: 500;
  color: ${({ theme, objectKey, parent }) =>
    parent ? theme.NODE_KEY : objectKey ? "#5c87ff" : theme.TEXT_POSITIVE};
`;

export const StyledRow = styled.span<{ width: number }>`
  height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 auto;
  width: ${({ width }) => `${width - 20}px`};
`;
