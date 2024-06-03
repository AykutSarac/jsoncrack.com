import React from "react";
import { Stack, Flex, Badge, Button } from "@mantine/core";
import styled from "styled-components";
import { MdChevronRight } from "react-icons/md";
import { gaEvent } from "src/lib/utils/gaEvent";

const StyledHeroTitle = styled.h1`
  position: relative;
  font-size: 2rem;
  font-weight: 900;
  display: inline;
  color: #272727;
  width: fit-content;
  letter-spacing: -1px;
  line-height: 1.2;

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
    letter-spacing: -2px;
  }

  @media only screen and (min-width: 992px) {
    letter-spacing: -4px;
    font-size: 4rem;
  }

  @media only screen and (min-width: 1400px) {
    max-width: 75%;
    letter-spacing: -4px;
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

const StyledHeroSection = styled.section`
  position: relative;

  &:before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    background-image: radial-gradient(#e3e1e1 1px, #ffffff 1px);
    background-size: 10px 10px;
    background-position: top center;
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 20%, white, 80%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 20%, white, 80%, transparent);
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
  padding: 4em 10%;
  overflow: hidden;
  backdrop-filter: blur(1.2px);
  -webkit-backdrop-filter: blur(1.2px);
  text-align: center;
  gap: 60px;
  min-height: 60vh;

  @media only screen and (max-width: 768px) {
    padding: 3em 16px;
  }
`;

export const HeroSection = () => {
  return (
    <StyledHeroSection id="hero-section">
      <StyledHeroSectionBody>
        <Stack flex="1" miw={250} mx="auto" align="center">
          <StyledHeroTitle>Data into Clarity with Powerful Visualization</StyledHeroTitle>
          <StyledHeroText>Transform data into interactive graphs.</StyledHeroText>
          <Flex gap="xs">
            <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
              JSON
            </Badge>
            <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
              YAML
            </Badge>
            <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
              CSV
            </Badge>
            <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
              XML
            </Badge>
            <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
              TOML
            </Badge>
          </Flex>
          <Button
            onClick={() => gaEvent("Hero Section", "click upgrade premium")}
            component="a"
            variant="gradient"
            style={{ border: "1px solid #625BF6" }}
            href="/#pricing"
            size="lg"
            radius="lg"
            rightSection={<MdChevronRight size={30} />}
          >
            Get Started
          </Button>
        </Stack>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};
