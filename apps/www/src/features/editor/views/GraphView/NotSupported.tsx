import React from "react";
import { Anchor, Badge, Button, Image, List, Overlay, Stack, Text, ThemeIcon } from "@mantine/core";
import styled, { keyframes } from "styled-components";
import { LuCheck } from "react-icons/lu";
import useConfig from "../../../../store/useConfig";
import useFile from "../../../../store/useFile";

const shineEffect = keyframes`
  0% {
    transform: translateX(-120%) rotate(25deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  60% {
    transform: translateX(80%) rotate(25deg);
    opacity: 0.6;
  }
  70% {
    transform: translateX(120%) rotate(25deg);
    opacity: 0;
  }
  100% {
    transform: translateX(120%) rotate(25deg);
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CardWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px 48px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 1px 3px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
  max-width: 460px;
  width: 90%;
  animation: ${fadeIn} 0.4s ease-out;
  position: relative;
  overflow: hidden;
  z-index: 10;

  &[data-dark="true"] {
    background: rgba(37, 38, 43, 0.95);
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.4),
      0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const ShiningButton = styled.div`
  position: relative;
  overflow: hidden;
  display: inline-block;
  border-radius: 8px;
  z-index: 10;
  width: 100%;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 35%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0) 65%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-120%) rotate(25deg);
    z-index: 20;
    pointer-events: none;
    animation: ${shineEffect} 5s ease-out infinite;
  }
`;

const FEATURES = [
  "Unlimited diagram size",
  "Compare data side by side",
  "Edit data directly on graph",
  "AI-powered data filter",
];

export const NotSupported = () => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);
  const format = useFile(state => state.format);

  return (
    <Overlay backgroundOpacity={0.6} color={darkmodeEnabled ? "#111" : "#e2f0f3"} blur="3" center>
      <CardWrapper data-dark={darkmodeEnabled}>
        <Stack align="center" gap="md">
          <Image src="https://todiagram.com/logo.svg" alt="ToDiagram" w={48} h={48} />
          <Badge variant="light" color="teal" size="sm" radius="sm">
            Upgrade Required
          </Badge>
          <Text fz="24" fw={700} c={darkmodeEnabled ? "white" : "dark"} ta="center" lh={1.2}>
            Your diagram is too large
          </Text>
          <Text ta="center" size="sm" c="dimmed" maw="360" lh={1.5}>
            JSON Crack can&apos;t render this file.{" "}
            <Anchor
              inherit
              c="teal"
              fw={500}
              href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=data_limit"
              target="_blank"
              rel="noopener"
            >
              ToDiagram
            </Anchor>{" "}
            handles large datasets with ease.
          </Text>
          <List
            spacing="xs"
            size="sm"
            w="100%"
            c={darkmodeEnabled ? "gray.4" : "dark.6"}
            icon={
              <ThemeIcon color="teal" size={20} radius="xl" variant="light">
                <LuCheck size={12} />
              </ThemeIcon>
            }
          >
            {FEATURES.map(feature => (
              <List.Item key={feature}>{feature}</List.Item>
            ))}
          </List>
          <ShiningButton>
            <Button
              component="a"
              href={`https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=data_limit&modal=upgrade&format=${format}&example=true`}
              rel="noopener"
              size="md"
              fullWidth
              target="_blank"
              color="teal"
              radius="md"
            >
              Continue with ToDiagram &rarr;
            </Button>
          </ShiningButton>
        </Stack>
      </CardWrapper>
    </Overlay>
  );
};
