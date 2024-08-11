import React from "react";
import { Manrope } from "next/font/google";
import Link from "next/link";
import { Stack, Flex, Badge, Button, Text } from "@mantine/core";
import styled from "styled-components";
import { FaArrowRightLong } from "react-icons/fa6";

const manrope = Manrope({
  subsets: ["latin-ext"],
});

const StyledHeroSection = styled.main`
  position: relative;

  &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 20%, white, 80%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 20%, white, 80%, transparent);
    --line-color-1: #f5f5f5;
    --line-color-2: #f8f8f8;
    background-image: linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
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

  @media only screen and (max-width: 1240px) {
    flex-direction: column;
  }
`;

const StyledHeroSectionBody = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 6rem 10% 3rem;
  overflow: hidden;
  text-align: center;
  gap: 60px;
  min-height: 40vh;

  @media only screen and (max-width: 768px) {
    padding: 6em 16px;
    margin-top: 10vh;
  }
`;

const StyledHeroTitle = styled.h1`
  position: relative;
  font-size: 2.2rem;
  font-weight: 800;
  display: inline;
  color: #272727;
  width: fit-content;
  line-height: 1.12;
  letter-spacing: -0.02em;
  max-width: 30rem;
  font-family: ${manrope.style.fontFamily};

  @media only screen and (min-width: 576px) {
    font-size: 3.2rem;
    max-width: 34rem;
  }

  @media only screen and (min-width: 992px) {
    font-size: 3.6rem;
    max-width: 40rem;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 4.2rem;
    max-width: 50rem;
  }
`;

const StyledHeroText = styled.p`
  font-size: 1rem;
  color: #626262;
  font-weight: 500;
  max-width: 75%;
  margin-top: 1rem;
  text-align: center;

  strong {
    font-weight: 500;
    color: #be7d1c;
  }

  @media only screen and (min-width: 576px) {
    font-size: 1.15rem;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 1.3rem;
    max-width: 60%;
  }
`;

export const HeroSection = () => {
  return (
    <StyledHeroSection>
      <StyledHeroSectionBody>
        <Stack flex="1" miw={250} mx="auto" align="center">
          <StyledHeroTitle>Visualize JSON into interactive graphs</StyledHeroTitle>
          <StyledHeroText>
            The best JSON viewer tool to <strong>visualize</strong>, <strong>format</strong> and{" "}
            <strong>modify</strong>.
          </StyledHeroText>
          <Flex gap="md">
            <Badge size="sm" color="dark" autoContrast radius="sm" variant="light">
              JSON
            </Badge>
            <Badge size="sm" color="dark" autoContrast radius="sm" variant="light">
              YAML
            </Badge>
            <Badge size="sm" color="dark" autoContrast radius="sm" variant="light">
              CSV
            </Badge>
            <Badge size="sm" color="dark" autoContrast radius="sm" variant="light">
              XML
            </Badge>
            <Badge size="sm" color="dark" autoContrast radius="sm" variant="light">
              TOML
            </Badge>
          </Flex>
          <Flex gap="md" wrap="wrap" justify="center">
            <Button
              component="a"
              color="orange"
              href="/#pricing"
              size="lg"
              radius="xl"
              px="xl"
              fz="md"
              rightSection={<FaArrowRightLong />}
              mt="lg"
            >
              Start for free
            </Button>
            <Button
              component={Link}
              variant="outline"
              color="orange"
              prefetch={false}
              href="/premium"
              size="lg"
              radius="xl"
              fz="md"
              mt="lg"
            >
              Get Premium
            </Button>
          </Flex>
          <Text c="gray.6" size="xs" mt="-10">
            No registration needed.
          </Text>
        </Stack>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};
