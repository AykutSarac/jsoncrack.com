import React from "react";
import { Stack, Flex, Badge, Button } from "@mantine/core";
import styled from "styled-components";
import { MdChevronRight } from "react-icons/md";

const StyledHeroSection = styled.main`
  position: relative;

  @media only screen and (max-width: 1240px) {
    flex-direction: column;
  }
`;

const StyledHeroTitle = styled.h1`
  position: relative;
  font-size: 2rem;
  font-weight: 600;
  display: inline;
  color: #272727;
  width: fit-content;
  line-height: 1.2;
  letter-spacing: -1px;
  max-width: 30rem;

  span {
    display: inline-block;
    white-space: nowrap;
    padding: 0 0.5rem;
    color: white;
    background: black;
    transform: rotate(-1.5deg);
  }

  @media only screen and (min-width: 576px) {
    font-size: 3.2rem;
    max-width: 34rem;
  }

  @media only screen and (min-width: 992px) {
    font-size: 3.6rem;
    max-width: 40rem;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 4rem;
    max-width: 48rem;
  }
`;

const StyledHeroText = styled.p`
  font-size: 1.2rem;
  color: #626262;
  font-weight: 500;
  max-width: 100%;
  min-width: 400px;
  margin-top: 1rem;
  text-align: center;

  strong {
    font-weight: 500;
    color: #0073ff;
  }

  @media only screen and (min-width: 576px) {
    font-size: 1.3rem;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 1.2rem;
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
  text-align: center;
  gap: 60px;
  min-height: 40vh;

  @media only screen and (max-width: 768px) {
    padding: 6em 16px;
    margin-top: 10vh;
  }
`;

export const HeroSection = () => {
  return (
    <StyledHeroSection id="hero-section">
      <StyledHeroSectionBody>
        <Stack flex="1" miw={250} mx="auto" align="center">
          <StyledHeroTitle>
            Convert any JSON into
            <span>interactive graphs</span>
          </StyledHeroTitle>
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

          <Button
            component="a"
            variant="gradient"
            gradient={{
              from: "#4466ff",
              to: "#003ba9",
            }}
            href="/#pricing"
            size="xl"
            radius="md"
            fw={600}
            rightSection={<MdChevronRight size={30} />}
            mt="lg"
          >
            Start Typing
          </Button>
        </Stack>
      </StyledHeroSectionBody>
    </StyledHeroSection>
  );
};
