import styled, { DefaultTheme } from "styled-components";
import { LinkItUrl } from "react-linkify-it";

function getTypeColor(value: string, theme: DefaultTheme) {
  if (!Number.isNaN(+value)) return "#FD0079";
  if (value === "true") return theme.TEXT_POSITIVE;
  if (value === "false") return theme.TEXT_DANGER;
}

export const StyledLinkItUrl = styled(LinkItUrl)`
  text-decoration: underline;
  pointer-events: all;
`;

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

export const StyledText = styled.div<{
  width: number;
  height: number;
  hasCollapse?: boolean;
  hideCollapse?: boolean;
}>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  min-height: 50;
  color: ${({ theme }) => theme.TEXT_NORMAL};
  padding-right: ${({ hasCollapse, hideCollapse }) =>
    hasCollapse && !hideCollapse && "20px"};
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
    parent
      ? theme.NODE_KEY
      : objectKey
      ? theme.OBJECT_KEY
      : theme.TEXT_POSITIVE};
  font-size: ${({ parent }) => parent && "14px"};
`;

export const StyledRow = styled.span.attrs<{
  width: string;
  value: string;
  theme: DefaultTheme;
}>((props) => ({
  style: {
    width: props.width,
    color: getTypeColor(props.value, props.theme),
  },
}))<{ width: string; value: string; theme: DefaultTheme }>`
  height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 auto;
`;
