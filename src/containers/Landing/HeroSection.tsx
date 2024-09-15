import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Stack, Flex, Button, Badge } from "@mantine/core";
import styled from "styled-components";
import { FaChevronRight, FaFire } from "react-icons/fa6";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin-ext"],
});

const StyledHeroSection = styled.main`
  position: relative;

  &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-size: 40px 40px;
    background-image: linear-gradient(to right, #f7f7f7 1px, transparent 1px),
      linear-gradient(to bottom, #f7f7f7 1px, transparent 1px);
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 0%, white, 98%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 0%, white, 98%, transparent);
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
  padding: 6rem 10% 4rem;
  overflow: hidden;
  text-align: center;
  gap: 60px;
  min-height: 40vh;

  @media only screen and (max-width: 768px) {
    padding: 6em 16px;
    padding-top: 10vh;
  }
`;

const StyledHeroTitle = styled.h1`
  position: relative;
  font-size: 2.3rem;
  font-weight: 700;
  display: inline;
  color: #120f43;
  width: fit-content;
  line-height: 1.15;
  max-width: 30rem;
  font-family: ${plusJakartaSans.style.fontFamily};

  @media only screen and (min-width: 576px) {
    font-size: 3.4rem;
    max-width: 34rem;
  }

  @media only screen and (min-width: 992px) {
    font-size: 3.8rem;
    max-width: 40rem;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 4.2rem;
    max-width: 50rem;
  }
`;

const StyledHeroText = styled.h2`
  font-size: 14px;
  color: #4a5568;
  font-weight: 400;
  max-width: 75%;
  margin-top: 1rem;
  text-align: center;

  strong {
    font-weight: 400;
    color: #115fe6;
  }

  @media only screen and (min-width: 576px) {
    font-size: 18px;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 18px;
    max-width: 60%;
  }
`;

export const HeroSection = () => {
  return (
    <StyledHeroSection>
      <StyledHeroSectionBody>
        <Stack flex="1" miw={250} mx="auto" align="center">
          <Link href="https://todiagram.com?ref=jsoncrack.com">
            <Badge
              fw={600}
              size="lg"
              variant="outline"
              color="red.5"
              leftSection={<FaFire />}
              tt="unset"
              visibleFrom="xs"
            >
              NEW: Now faster & more powerful — ToDiagram.com
            </Badge>
            <Badge
              fw={600}
              size="sm"
              variant="outline"
              color="red.5"
              leftSection={<FaFire />}
              tt="unset"
              hiddenFrom="xs"
            >
              NEW: Now faster & more powerful — ToDiagram.com
            </Badge>
          </Link>
          <StyledHeroTitle>Visualize JSON into interactive graphs</StyledHeroTitle>
          <StyledHeroText>
            The best JSON viewer tool to <strong>visualize</strong>, <strong>format</strong> and{" "}
            <strong>modify</strong>.
          </StyledHeroText>

          <Flex gap="xs" wrap="wrap" justify="center" hiddenFrom="xs">
            <Button
              component="a"
              color="#202842"
              href="/editor"
              size="md"
              radius="md"
              rightSection={<FaChevronRight />}
              fw="500"
            >
              Go to Editor
            </Button>
          </Flex>
          <Flex gap="lg" wrap="wrap" justify="center" visibleFrom="xs">
            <Button
              component="a"
              color="#202842"
              href="/editor"
              size="lg"
              radius="md"
              rightSection={<FaChevronRight />}
              fw="500"
            >
              Go to Editor
            </Button>
          </Flex>
        </Stack>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};
