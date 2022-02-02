import React from "react";
import styled from "styled-components";

const StyledLoading = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  text-align: center;
`;

const StyledLogo = styled.h2`
  font-weight: 700;
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

export const Loading = () => {
  return (
    <StyledLoading>
      <StyledLogo>
        <StyledText>JSON</StyledText> Visio
      </StyledLogo>
      <StyledMessage>Preparing the environment for you...</StyledMessage>
    </StyledLoading>
  );
};
