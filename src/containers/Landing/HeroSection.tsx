import React from "react";
import { Stack, Flex, Badge, Button } from "@mantine/core";
import styled from "styled-components";
import { MdChevronRight } from "react-icons/md";
import { gaEvent } from "src/lib/utils/gaEvent";

const StyledHeroSection = styled.main`
  position: relative;

  /* &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: transparent;
    background-image: radial-gradient(#0000002a 1px, transparent 1px);
    background-size: 15px 15px;
    background-position: top center;
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 20%, white, 80%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 20%, white, 80%, transparent);
  } */

  @media only screen and (max-width: 1240px) {
    flex-direction: column;
  }
`;

const StyledHeroTitle = styled.h1`
  position: relative;
  font-size: 2rem;
  font-weight: 800;
  display: inline;
  color: #272727;
  width: fit-content;
  line-height: 1.2;
  letter-spacing: -2px;

  @keyframes textShine {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  @media only screen and (min-width: 576px) {
    font-size: 3.2rem;
  }

  @media only screen and (min-width: 992px) {
    max-width: 75%;
    font-size: 3.6rem;
  }

  @media only screen and (min-width: 1400px) {
    max-width: 50%;
    font-size: 4rem;
  }
`;

const StyledHeroText = styled.p`
  font-size: 1rem;
  color: #898989;
  font-weight: 500;
  max-width: 100%;
  min-width: 400px;
  text-align: center;

  @media only screen and (min-width: 576px) {
    font-size: 1.2rem;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 1.25rem;
    max-width: 60%;
  }
`;

const StyledHeroSectionBody = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 9rem 10%;
  overflow: hidden;
  backdrop-filter: blur(1.2px);
  -webkit-backdrop-filter: blur(1.2px);
  text-align: center;
  gap: 60px;
  min-height: 40vh;

  @media only screen and (max-width: 768px) {
    padding: 6em 16px;
  }
`;

export const HeroSection = () => {
  return (
    <StyledHeroSection id="hero-section">
      <StyledHeroSectionBody>
        <Stack flex="1" miw={250} mx="auto" align="center">
          <StyledHeroTitle>Transform data into interactive graphs</StyledHeroTitle>
          <StyledHeroText>Powerful editor to explore data visually.</StyledHeroText>
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
          <Flex justify="center" gap="sm" mt="lg" wrap="wrap">
            <Button
              component="a"
              color="brightBlue"
              href="/#pricing"
              size="lg"
              radius="md"
              fw={600}
              rightSection={<MdChevronRight size={30} />}
            >
              Get Started
            </Button>
            <Button
              onClick={() => gaEvent("Hero Section", "click upgrade premium")}
              component="a"
              variant="default"
              href="/#premium"
              size="lg"
              radius="md"
              fw={600}
            >
              Premium vs Free
            </Button>
          </Flex>
        </Stack>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};
