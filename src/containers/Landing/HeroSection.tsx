import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Stack, Flex, Badge, Button } from "@mantine/core";
import styled from "styled-components";
import { FaChevronRight } from "react-icons/fa6";
import { LovedBy } from "./LovedBy";

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
    background-image: linear-gradient(to right, #f6f6f6 1px, transparent 1px),
      linear-gradient(to bottom, #f6f6f6 1px, transparent 1px);
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
  padding: 6rem 10% 3rem;
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

export const HeroSection = ({ stars }: { stars: number }) => {
  return (
    <StyledHeroSection>
      <StyledHeroSectionBody>
        <Stack flex="1" miw={250} mx="auto" align="center">
          <Link href="/#features">
            <Badge
              fw="600"
              tt="none"
              variant="outline"
              c="gray.7"
              color="gray.3"
              bg="gray.0"
              size="lg"
              rightSection={<FaChevronRight />}
              visibleFrom="xs"
            >
              Supports: JSON, CSV, XML, YAML, TOML
            </Badge>
            <Badge
              fw="600"
              tt="none"
              variant="outline"
              c="gray.7"
              color="gray.3"
              bg="gray.0"
              size="md"
              rightSection={<FaChevronRight />}
              hiddenFrom="xs"
            >
              Supports: JSON, CSV, XML, YAML, TOML
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
              color="indigo"
              href="/editor"
              size="md"
              radius="md"
              rightSection={<FaChevronRight />}
              fw="500"
            >
              Go to Editor
            </Button>
            <Button
              component={Link}
              variant="default"
              prefetch={false}
              href="/premium"
              size="md"
              radius="md"
              fw="500"
              rightSection={<FaChevronRight />}
            >
              Premium
            </Button>
          </Flex>
          <Flex gap="lg" wrap="wrap" justify="center" visibleFrom="xs">
            <Button
              component="a"
              color="indigo"
              href="/editor"
              size="lg"
              radius="md"
              rightSection={<FaChevronRight />}
              fw="500"
            >
              Go to Editor
            </Button>
            <Button
              component={Link}
              variant="default"
              prefetch={false}
              href="/premium"
              size="lg"
              radius="md"
              fw="500"
              rightSection={<FaChevronRight />}
            >
              Premium
            </Button>
          </Flex>
          <LovedBy stars={stars} />
        </Stack>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};
