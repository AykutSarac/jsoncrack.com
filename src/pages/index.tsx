import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Flex, Group, Stack, Text } from "@mantine/core";
import styled from "styled-components";
import { MdChevronRight } from "react-icons/md";
import Layout from "src/layout/Layout";

const StyledHeroSection = styled.section`
  position: relative;
  padding: 4em 4em 2em;

  &::before {
    z-index: 0;
    position: absolute;
    content: "";
    top: 0%;
    right: 0;
    width: 80%;
    height: 100%;
    background: linear-gradient(84deg, #8b32ff 0%, #a837dc 100%);
    -webkit-mask-image: radial-gradient(rgba(0, 0, 0, 0.45), transparent 70%);
    mask-image: radial-gradient(rgba(0, 0, 0, 0.45), transparent 70%);
  }

  @media only screen and (max-width: 768px) {
    padding: 2em;
  }
`;

const StyledHeroSectionBody = styled.div`
  min-height: 70vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: fit-content;
  gap: 4vw;
`;

const StyledHeroTitle = styled.h1`
  font-size: clamp(24px, 4vw, 50px);
  color: white;

  @media only screen and (max-width: 768px) {
    font-size: 34px;
  }
`;

const StyledHeroText = styled.p`
  font-size: clamp(18px, 2vw, 22px);
  color: #bcbcbc;
  max-width: 600px;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
    max-width: 100%;
  }
`;

const StyledImageWrapper = styled.div`
  border: 8px solid #36393e;
  border-radius: 6px;
  border-top: none;
  width: 100%;
  max-width: 40vw;
  flex: auto;
  height: fit-content;
  margin: 0 auto;
  z-index: 1;

  img {
    display: block;
    width: 100%;
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledFeaturedSection = styled.section`
  padding: 0 1em;

  img {
    filter: brightness(70%) grayscale(100%);
    transition: filter 200ms ease;
  }

  img:hover {
    filter: none;
  }
`;

export const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>JSON Crack | More Than a JSON Editor</title>
      </Head>
      <StyledHeroSection id="hero-section">
        <StyledHeroSectionBody>
          <Stack gap="xs">
            <StyledHeroTitle>More than a JSON editor.</StyledHeroTitle>

            <StyledHeroText>
              Visualize, analyze, and manipulate data with ease, a versatile and powerful tool for
              data representation and exploration.
            </StyledHeroText>
            <Group mt="sm" justify="left">
              <Link href="/editor" prefetch={false}>
                <Button
                  size="xl"
                  color="violet"
                  rightSection={<MdChevronRight size={30} />}
                  visibleFrom="md"
                >
                  GO TO EDITOR
                </Button>
                <Button
                  size="lg"
                  color="violet"
                  rightSection={<MdChevronRight size={30} />}
                  hiddenFrom="md"
                >
                  GO TO EDITOR
                </Button>
              </Link>
              <Button
                component="a"
                href="https://pro.jsoncrack.com"
                target="_blank"
                size="xl"
                variant="outline"
                color="#A771FE"
                visibleFrom="md"
              >
                Get Premium+
              </Button>
              <Button
                component="a"
                href="https://pro.jsoncrack.com"
                target="_blank"
                size="lg"
                variant="outline"
                color="#A771FE"
                hiddenFrom="md"
              >
                Get Premium+
              </Button>
            </Group>
          </Stack>
          <StyledImageWrapper>
            <img src="./assets/preview.png" alt="JSON Crack Preview" />
          </StyledImageWrapper>
        </StyledHeroSectionBody>
      </StyledHeroSection>
      <StyledFeaturedSection>
        <Flex
          mx="auto"
          align="center"
          justify="center"
          pb={120}
          gap="md"
          wrap="wrap"
          style={{ whiteSpace: "nowrap" }}
        >
          <Text fz="xs" c="dimmed">
            Featured on
          </Text>
          <a href="https://news.ycombinator.com/item?id=32626873" target="_blank" rel="noreferrer">
            <img width={128} src="./assets/hn.svg" alt="Hacker News" />
          </a>
          <a
            href="https://www.producthunt.com/products/JSON-Crack"
            target="_blank"
            rel="noreferrer"
          >
            <img width={128} src="./assets/ph.svg" alt="Product Hunt" />
          </a>
          <a
            href="https://twitter.com/github/status/1519363257794015233"
            target="_blank"
            rel="noreferrer"
          >
            <img width={32} src="./assets/x.svg" alt="X" />
          </a>
        </Flex>
      </StyledFeaturedSection>
    </Layout>
  );
};

export default HomePage;
