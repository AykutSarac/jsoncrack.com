import type { DefaultTheme } from "styled-components";
import styled from "styled-components";
import { LinkItUrl } from "react-linkify-it";
import { NODE_DIMENSIONS } from "../../../../../constants/graph";

type TextColorFn = {
  theme: DefaultTheme;
  $type?: string;
  $value?: string;
  $parent?: boolean;
};

function getTextColor({ $value, $type, $parent, theme }: TextColorFn) {
  // per type
  if ($parent && $type === "array") return theme.NODE_COLORS.PARENT_ARR;
  if ($parent && $type === "object") return theme.NODE_COLORS.PARENT_OBJ;
  if ($type === "object") return theme.NODE_COLORS.NODE_KEY;
  if ($type === "array") return theme.NODE_COLORS.NODE_VALUE;

  // per value
  if ($value && !Number.isNaN(+$value)) return theme.NODE_COLORS.INTEGER;
  if ($value === "true") return theme.NODE_COLORS.BOOL.TRUE;
  if ($value === "false") return theme.NODE_COLORS.BOOL.FALSE;
  if ($value === "null") return theme.NODE_COLORS.NULL;

  // default
  return theme.NODE_COLORS.NODE_VALUE;
}

export const StyledLinkItUrl = styled(LinkItUrl)`
  text-decoration: underline;
  pointer-events: all;
`;

export const StyledForeignObject = styled.foreignObject<{ $isObject?: boolean }>`
  text-align: ${({ $isObject }) => !$isObject && "center"};
  color: ${({ theme }) => theme.NODE_COLORS.TEXT};
  font-family: monospace;
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  pointer-events: none;

  &.searched {
    background: rgba(27, 255, 0, 0.1);
    border: 2px solid ${({ theme }) => theme.TEXT_POSITIVE};
    border-radius: 2px;
    box-sizing: border-box;
  }

  .highlight {
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

export const StyledKey = styled.span<{ $parent?: boolean; $type: string; $value?: string }>`
  display: ${({ $parent }) => ($parent ? "flex" : "inline")};
  align-items: center;
  justify-content: center; // Always center for parent nodes
  flex: 1;
  min-width: 0;
  height: ${({ $parent }) => ($parent ? `${NODE_DIMENSIONS.PARENT_HEIGHT}px` : "auto")};
  line-height: ${({ $parent }) => ($parent ? `${NODE_DIMENSIONS.PARENT_HEIGHT}px` : "inherit")};
  padding: 0; // Remove padding
  color: ${({ theme, $type, $parent = false, $value = "" }) =>
    getTextColor({ $parent, $type, $value, theme })};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledRow = styled.span<{ $value: string }>`
  padding: 3px 10px;
  height: ${NODE_DIMENSIONS.ROW_HEIGHT}px;
  line-height: 18px;
  color: ${({ theme, $value }) => getTextColor({ $value, theme })};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.NODE_COLORS.DIVIDER};
  box-sizing: border-box;

  &:last-of-type {
    border-bottom: none;
  }
`;

export const StyledChildrenCount = styled.span`
  color: ${({ theme }) => theme.NODE_COLORS.CHILD_COUNT};
  padding: 10px;
  margin-left: -15px;
`;
