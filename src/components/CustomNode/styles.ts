import { LinkItUrl } from "react-linkify-it";
import styled, { DefaultTheme } from "styled-components";

function getTypeColor(value: string, theme: DefaultTheme) {
  if (!Number.isNaN(+value)) return theme.NODE_COLORS.INTEGER;
  if (value === "true") return theme.NODE_COLORS.BOOL.TRUE;
  if (value === "false") return theme.NODE_COLORS.BOOL.FALSE;
  if (value === "null") return theme.NODE_COLORS.NULL;
  return theme.NODE_COLORS.NODE_VALUE;
}

export const StyledLinkItUrl = styled(LinkItUrl)`
  text-decoration: underline;
  pointer-events: all;
`;

export const StyledForeignObject = styled.foreignObject<{
  hasCollapse?: boolean;
  isObject?: boolean;
}>`
  text-align: ${({ isObject }) => !isObject && "center"};
  font-size: 12px;
  overflow: hidden;
  color: ${({ theme }) => theme.NODE_COLORS.TEXT};
  pointer-events: none;
  padding: ${({ isObject }) => isObject && "10px"};

  * {
    font-family: "Roboto Mono", monospace;
  }

  &.searched {
    border: 2px solid ${({ theme }) => theme.TEXT_POSITIVE};
    border-radius: 2px;
    box-sizing: border-box;
  }

  .highlight {
    border: 2px dashed #ff2970;
    background: rgba(255, 214, 0, 0.3);
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

function getKeyColor(theme: DefaultTheme, parent: "array" | "object" | false, objectKey: boolean) {
  if (parent) {
    if (parent === "array") return theme.NODE_COLORS.PARENT_ARR;
    return theme.NODE_COLORS.PARENT_OBJ;
  }
  if (objectKey) return theme.NODE_COLORS.NODE_KEY;
  return theme.NODE_COLORS.TEXT;
}

export const StyledKey = styled.span<{
  objectKey?: boolean;
  parent?: "array" | "object" | false;
  value?: string;
}>`
  display: inline;
  flex: 1;
  font-weight: 500;
  color: ${({ theme, objectKey = false, parent = false }) => getKeyColor(theme, parent, objectKey)};
  font-size: ${({ parent }) => parent && "14px"};
  overflow: hidden;
  text-overflow: ellipsis;
  padding: ${({ objectKey }) => !objectKey && 10}px;
`;

export const StyledRow = styled.span.attrs<{
  "data-key": string;
  theme: DefaultTheme;
}>(props => ({
  style: {
    color: getTypeColor(props["data-key"], props.theme),
  },
}))<{ "data-key": string; theme: DefaultTheme }>`
  display: block;
  height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 auto;
`;

export const StyledChildrenCount = styled.span`
  color: ${({ theme }) => theme.NODE_COLORS.CHILD_COUNT};
  padding: 10px;
  margin-left: -15px;
`;
