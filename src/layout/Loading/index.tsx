import React from "react";
import styled, { keyframes } from "styled-components";
import { Center, Image, Stack, Title } from "@mantine/core";

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

const StyledLoading = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? "grid" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  place-content: center;
  width: 100%;
  height: 100vh;
  text-align: center;
  background: rgba(30, 30, 30, 0.8);
  z-index: 100;
  pointer-events: visiblePainted;
  cursor: wait;
  animation: 0.2s ${fadeIn};
  animation-fill-mode: forwards;
  visibility: hidden;

  img {
    transform: rotate(45deg) translate(100px, -70px);
  }
`;

const StyledText = styled.span`
  color: #faa81a;
`;

const StyledMessage = styled.div`
  color: #b9bbbe;
  font-size: 32px;
  font-weight: 600;
`;

export const Loading: React.FC<LoadingProps> = ({ loading = true, message }) => (
  <Center mx="auto">
    <StyledLoading visible={loading}>
      <Stack>
        <Image maw={150} src="./assets/rocket_ship.webp" alt="loading image" />
        <Title size="4rem">
          <StyledText>JSON</StyledText> Crack
        </Title>
        <StyledMessage>{message ?? "Preparing the environment for you..."}</StyledMessage>
      </Stack>
    </StyledLoading>
  </Center>
);
