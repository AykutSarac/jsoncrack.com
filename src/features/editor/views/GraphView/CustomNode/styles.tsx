import type { DefaultTheme } from "styled-components";
import styled from "styled-components";
import { LinkItUrl } from "react-linkify-it";
import { NODE_DIMENSIONS } from "../../../../../constants/graph";

type TextColorFn = {
  theme: DefaultTheme;
  $type?: string;
  $value?: string | number | null | boolean;
};

function getTextColor({ $value, $type, theme }: TextColorFn) {
  if ($value === null) return theme.NODE_COLORS.NULL;
  if ($type === "object") return theme.NODE_COLORS.NODE_KEY;
  if ($type === "number") return theme.NODE_COLORS.INTEGER;
  if ($value === true) return theme.NODE_COLORS.BOOL.TRUE;
  if ($value === false) return theme.NODE_COLORS.BOOL.FALSE;
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
  pointer-events: all;

  /* Reveal any buttons placed inside the foreignObject on hover */
  button {
    opacity: 0;
    transition: all 0.15s ease;
  }

  &:hover button {
    opacity: 1;
  }

  &.searched {
    background: rgba(27, 255, 0, 0.1);
    border: 1px solid ${({ theme }) => theme.TEXT_POSITIVE};
    border-radius: 2px;
    box-sizing: border-box;
  }

  .highlight {
    background: rgba(255, 214, 0, 0.15);
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
  $type: TextColorFn["$type"];
  $value?: TextColorFn["$value"];
}>`
  display: inline;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 0;
  height: auto;
  line-height: inherit;
  padding: 0; // Remove padding
  color: ${({ theme, $type, $value = "" }) => getTextColor({ $value, $type, theme })};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledRow = styled.span<{ $value: TextColorFn["$value"] }>`
  padding: 3px 10px;
  height: ${NODE_DIMENSIONS.ROW_HEIGHT}px;
  line-height: 24px;
  color: ${({ theme, $value }) => getTextColor({ $value, theme, $type: typeof $value })};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.NODE_COLORS.DIVIDER};
  box-sizing: border-box;

  &:last-of-type {
    border-bottom: none;
  }

  .searched & {
    border-bottom: 1px solid ${({ theme }) => theme.TEXT_POSITIVE};
  }
`;

export const StyledChildrenCount = styled.span`
  color: ${({ theme }) => theme.NODE_COLORS.CHILD_COUNT};
  padding: 10px;
  margin-left: -15px;
`;

export const StyledEditButton = styled.button<{ $isActive?: boolean }>`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  padding: 2px;
  border: 1px solid
    ${({ theme, $isActive }) => ($isActive ? theme.INTERACTIVE_ACTIVE : "transparent")};
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.BACKGROUND_MODIFIER_ACCENT : "transparent"};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  border-radius: 2px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  transition: all 0.15s ease;
  opacity: 0;
  z-index: 100;

  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
    border-color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  }

  &:active {
    opacity: 1;
  }
`;

export const StyledEditWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  padding: 0 8px;
  box-sizing: border-box;
`;

export const StyledNodeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:hover ${StyledEditButton} {
    opacity: 1;
  }
`;

export const StyledEditInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 20px;
  padding: 2px 4px;
  border: 1px solid ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  background: ${({ theme }) => theme.BACKGROUND_NODE};
  color: ${({ theme }) => theme.NODE_COLORS.TEXT};
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  border-radius: 2px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  }
`;

export const StyledEditButton2 = styled.button`
  padding: 2px 6px;
  height: 20px;
  border: 1px solid ${({ theme }) => theme.INTERACTIVE_NORMAL};
  background: ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  font-size: 10px;
  font-weight: 600;
  border-radius: 2px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.1s ease;
  pointer-events: all;

  &:hover {
    background: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
    color: ${({ theme }) => theme.BACKGROUND_NODE};
  }

  &:active {
    opacity: 0.8;
  }
`;
