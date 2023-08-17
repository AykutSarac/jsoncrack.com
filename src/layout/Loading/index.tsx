import React from "react";
import styled, { keyframes } from "styled-components";
import { Center, Image, Stack } from "@mantine/core";
import { JSONCrackLogo } from "../JsonCrackLogo";

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

const StyledLoading = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "grid" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  place-content: center;
  width: 100%;
  height: 100vh;
  text-align: center;
  z-index: 100;
  pointer-events: visiblePainted;
  cursor: wait;
  animation: 200ms ${fadeIn};
  animation-fill-mode: forwards;
  visibility: hidden;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  img {
    transform: rotate(45deg);
  }
`;

const StyledMessage = styled.div`
  color: #b9bbbe;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const Loading: React.FC<LoadingProps> = ({ loading = false, message }) => {
  return (
    <Center mx="auto">
      <StyledLoading $visible={loading}>
        <Stack>
          <Image mx="auto" width="6.5em" src="./assets/rocket_ship.webp" alt="loading image" />
          <JSONCrackLogo fontSize="2rem" />
          <StyledMessage>{message ?? "Preparing the environment for you..."}</StyledMessage>
        </Stack>
      </StyledLoading>
    </Center>
  );
};
