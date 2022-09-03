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

export const StyledForeignObject = styled.foreignObject<{
  hasCollapse?: boolean;
  hideCollapse?: boolean;
  isObject?: boolean;
}>`
  display: flex;
  text-align: ${({ isObject }) => !isObject && "center"};
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-direction: column;
  overflow: hidden;
  padding: 10px;
  color: ${({ theme }) => theme.TEXT_NORMAL};
  cursor: pointer;
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
  hasToggle?: boolean;
}>`
  font-weight: 500;
  color: ${({ theme, objectKey, parent }) =>
    parent
      ? theme.NODE_KEY
      : objectKey
      ? theme.OBJECT_KEY
      : theme.TEXT_POSITIVE};
  font-size: ${({ parent }) => parent && "14px"};
  padding-right: ${({ hasToggle }) => hasToggle && "30px"};
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledRow = styled.span.attrs<{
  value: string;
  theme: DefaultTheme;
}>((props) => ({
  style: {
    color: getTypeColor(props.value, props.theme),
  },
}))<{ value: string; theme: DefaultTheme }>`
  height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 auto;
`;
