import React from "react";
import styled from "styled-components";
import { HiHeart } from "react-icons/hi";

const StyledText = styled.span`
  white-space: nowrap;
  opacity: 0;
  width: 0px;
  transition: 0.2s;
  font-weight: 600;
`;

const StyledSupportButton = styled.a`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  width: 24px;
  padding: 8px;
  height: 24px;
  background: ${({ theme }) => theme.DANGER};
  transition: all 0.5s;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
    0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07), 0 16px 32px rgba(0, 0, 0, 0.07),
    0 32px 64px rgba(0, 0, 0, 0.07);
  opacity: 0.7;
  box-sizing: content-box !important;

  &:hover {
    width: 180px;
    border-radius: 6px;

    ${StyledText} {
      opacity: 1;
      width: fit-content;
      margin-right: 8px;
    }
  }
`;

export const SupportButton = () => {
  return (
    <StyledSupportButton href="https://github.com/sponsors/AykutSarac" target="_blank" rel="me">
      <StyledText>Support JSON Crack</StyledText>
      <HiHeart size={25} />
    </StyledSupportButton>
  );
};
