import React from "react";
import styled, { keyframes } from "styled-components";

interface LoadingProps {
  loading?: boolean;
  message?: string;
}

const fadeIn = keyframes`
 99% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
`;

const StyledLoading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: grid;
  place-content: center;
  width: 100%;
  height: 100vh;
  text-align: center;
  background: ${({ theme }) => theme.BLACK_DARK};
  z-index: 36;
  pointer-events: none;
  animation: 0.2s ${fadeIn};
  animation-fill-mode: forwards;
  visibility: hidden;
`;

const StyledLogo = styled.h2`
  font-weight: 800;
  font-size: 56px;
  pointer-events: none;
  margin-bottom: 10px;
`;

const StyledText = styled.span`
  color: #faa81a;
`;

const StyledMessage = styled.div`
  color: #b9bbbe;
  font-size: 24px;
  font-weight: 500;
`;

export const Loading: React.FC<LoadingProps> = ({ loading = true, message }) => {
  if (!loading) return null;

  return (
    <StyledLoading>
      <StyledLogo>
        <StyledText>JSON</StyledText> Crack
      </StyledLogo>
      <StyledMessage>{message ?? "Preparing the environment for you..."}</StyledMessage>
    </StyledLoading>
  );
};
