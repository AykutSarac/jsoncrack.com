import React from "react";
import styled from "styled-components";

interface ContainerProps {
  reverse?: boolean;
}

const StyledContainer = styled.div<{ reverse: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 50px;
  align-items: center;
  width: 75%;
  margin: 40px auto;
  flex-direction: ${({ reverse }) => reverse && 'row-reverse'};
  line-height: 1.2;
`;

export const Container: React.FC<ContainerProps> = ({ children, reverse = false }) => {
  return <StyledContainer reverse={reverse}>{children}</StyledContainer>;
};
