import React from "react";
import { Container, Image, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import styled from "styled-components";

const StyledImageWrapper = styled.div`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 12px;
    border-radius: 15px;
    border: 1px solid #e0e0e0;
    background: #f3f3f3;
    --line-color-1: #e3e3e3;
    --line-color-2: #e5e5e5;
    background-image:
      linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
      linear-gradient(90deg, var(--line-color-1) 1.5px, transparent 1.5px),
      linear-gradient(var(--line-color-2) 1px, transparent 1px),
      linear-gradient(90deg, var(--line-color-2) 1px, transparent 1px);
    background-position:
      -1.5px -1.5px,
      -1.5px -1.5px,
      -1px -1px,
      -1px -1px;
    background-size:
      100px 100px,
      100px 100px,
      20px 20px,
      20px 20px;
  }

  img {
    z-index: 1;
  }
`;

export const Section1 = () => {
  return (
    <Container size="xl" py="80">
      <Title
        lh="1.1"
        fz={{
          base: 26,
          xs: 46,
          sm: 52,
        }}
        maw="16ch"
        ta="center"
        order={2}
        c="gray.9"
        mx="auto"
        mb="15"
      >
        Make working with JSON easy
      </Title>
      <Title
        order={3}
        fw={400}
        c="gray.7"
        px="lg"
        mx="auto"
        ta="center"
        mb={50}
        fz={{ base: 16, sm: 18 }}
        w={{ base: "100%", md: "600" }}
      >
        JSON Crack eliminates the chaos of raw, messy data, making the complex appear simple and
        easy to understand.
      </Title>
      <SimpleGrid
        cols={{
          base: 1,
          sm: 3,
        }}
      >
        <Stack
          p="lg"
          m="lg"
          maw="360"
          mx="auto"
          style={{
            borderRadius: "17px",
            border: "1px solid #e0e0e0",
          }}
        >
          <StyledImageWrapper>
            <Image src="/assets/step1-visual.png" pos="relative" w="100%" alt="upload" />
          </StyledImageWrapper>
          <Title ta="center" c="black" order={3}>
            Upload your data
          </Title>
          <Text ta="center" c="gray.7">
            Upload your JSON file, URL, or type your data directly into our easy-to-use text editor.
          </Text>
        </Stack>
        <Stack
          p="lg"
          m="lg"
          maw="360"
          mx="auto"
          style={{
            borderRadius: "17px",
            border: "1px solid #e0e0e0",
          }}
        >
          <StyledImageWrapper>
            <Image src="/assets/step2-visual.png" pos="relative" w="100%" alt="visualize" />
          </StyledImageWrapper>
          <Title ta="center" c="black" order={3}>
            Visualize your JSON
          </Title>
          <Text ta="center" c="gray.7">
            Your data will automatically be turned into a visual tree graph so you can quickly
            understand your data at a glance.
          </Text>
        </Stack>
        <Stack
          p="lg"
          m="lg"
          maw="360"
          mx="auto"
          style={{
            borderRadius: "17px",
            border: "1px solid #e0e0e0",
          }}
        >
          <StyledImageWrapper>
            <Image src="/assets/step3-visual.png" pos="relative" w="100%" alt="export image" />
          </StyledImageWrapper>
          <Title ta="center" c="black" order={3}>
            Export to image
          </Title>
          <Text ta="center" c="gray.7">
            Once you&apos;re satisfied, you can export an image of your graph as PNG, JPEG, or SVG
            and share with others.
          </Text>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};
