import styled, { DefaultTheme } from "styled-components";
import { LinkItUrl } from "react-linkify-it";
import { firaMono } from "src/constants/fonts";

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
  font-family: ${firaMono.style.fontFamily};
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
  display: inline;
  flex: 1;
  color: ${({ theme, $type, $parent = false, $value = "" }) =>
    getTextColor({ $parent, $type, $value, theme })};
  font-size: ${({ $parent }) => $parent && "14px"};
  overflow: hidden;
  text-overflow: ellipsis;
  padding: ${({ $type }) => $type !== "object" && "10px"};
  white-space: nowrap;
`;

export const StyledRow = styled.span<{ $value: string }>`
  padding: 0 10px;
  color: ${({ theme, $value }) => getTextColor({ $value, theme })};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:first-of-type {
    padding-top: 10px;
  }

  &:last-of-type {
    padding-bottom: 10px;
  }
`;

export const StyledChildrenCount = styled.span`
  color: ${({ theme }) => theme.NODE_COLORS.CHILD_COUNT};
  padding: 10px;
  margin-left: -15px;
`;
