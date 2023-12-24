import React from "react";
import styled from "styled-components";

const StyledErrorView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const StyledTitle = styled.h2`
  color: ${({ theme }) => theme.TEXT_DANGER};
`;

const StyledInfo = styled.p`
  width: 60%;
  text-align: center;
  color: ${({ theme }) => theme.TEXT_NORMAL};
`;

export const ErrorView = () => (
  <StyledErrorView>
    <StyledTitle>JSON Crack is unable to handle this file!</StyledTitle>
    <StyledInfo>
      We apologize for the problem you encountered. We are doing our best as an Open Source
      community to improve our service. Unfortunately, JSON Crack is currently unable to handle such
      a large file. Please try the tree view from View Modes to see if it works.
    </StyledInfo>
  </StyledErrorView>
);
