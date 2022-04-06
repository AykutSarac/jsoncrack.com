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
  margin: 0 auto;
  min-height: calc(100vh - 250px);
  flex-direction: ${({ reverse }) => reverse && "row-reverse"};
  line-height: 1.2;

  @media only screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    margin-top: 160px;
  }
`;

export const Container: React.FC<ContainerProps> = ({
  children,
  reverse = false,
}) => {
  return <StyledContainer reverse={reverse}>{children}</StyledContainer>;
};
