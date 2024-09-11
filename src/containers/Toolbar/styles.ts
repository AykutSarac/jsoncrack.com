import styled from "styled-components";

export const StyledToolElement = styled.button<{ $hide?: boolean }>`
  display: ${({ $hide }) => ($hide ? "none" : "flex")};
  align-items: center;
  gap: 4px;
  place-content: center;
  font-size: 12px;
  background: none;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  padding: 6px;
  border-radius: 3px;
  white-space: nowrap;

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
  }

  &:hover {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
    opacity: 1;
    box-shadow: none;
  }
`;
