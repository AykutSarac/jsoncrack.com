import React from "react";
import { Center, Stack, Text } from "@mantine/core";
import styled, { keyframes } from "styled-components";
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
  animation: 200ms ${fadeIn};
  animation-fill-mode: forwards;
  visibility: hidden;
  background: ${({ theme }) => theme.BACKGROUND_NODE};
  opacity: 0.8;
  color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  cursor: wait;

  img {
    transform: rotate(45deg);
  }
`;

export const Loading = ({ loading = false, message }: LoadingProps) => {
  return (
    <Center mx="auto">
      <StyledLoading $visible={loading}>
        <Stack>
          <JSONCrackLogo fontSize="3rem" />
          <Text fz="lg" fw="bold">
            {message ?? "Preparing the environment for you..."}
          </Text>
        </Stack>
      </StyledLoading>
    </Center>
  );
};
