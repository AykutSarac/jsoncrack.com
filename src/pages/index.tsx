import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Group } from "@mantine/core";
import styled from "styled-components";
import { MdChevronRight } from "react-icons/md";
import Layout from "src/layout/Layout";

const StyledHeroSection = styled.section`
  padding: 4em;
`;

const StyledHeroSectionBody = styled.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: fit-content;
  gap: 24px;
`;

const StyledHeroTitle = styled.h1`
  font-size: 60px;
  color: white;

  @media only screen and (max-width: 768px) {
    font-size: 34px;
  }
`;

const StyledHeroText = styled.p`
  font-size: 24px;
  color: #bcbcbc;
  max-width: 60%;

  @media only screen and (max-width: 768px) {
    font-size: 20px;
    max-width: 100%;
  }
`;

const StyledImageWrapper = styled.div`
  border: 8px solid #36393e;
  border-radius: 6px;
  border-top: none;
  width: 80%;
  height: auto;
  margin: 0 auto;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media only screen and (max-width: 768px) {
    display: none;
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
          <StyledHeroTitle>More than a JSON editor.</StyledHeroTitle>

          <StyledHeroText>
            Visualize, analyze, and manipulate data with ease, a versatile and powerful tool for
            data representation and exploration.
          </StyledHeroText>
          <Group justify="left">
            <Link href="/editor" prefetch={false}>
              <Button
                size="xl"
                color="violet"
                rightSection={<MdChevronRight size={30} />}
                visibleFrom="sm"
              >
                GO TO EDITOR
              </Button>
              <Button
                size="lg"
                color="violet"
                rightSection={<MdChevronRight size={30} />}
                hiddenFrom="sm"
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
              visibleFrom="sm"
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
              hiddenFrom="sm"
            >
              Get Premium+
            </Button>
          </Group>
        </StyledHeroSectionBody>
        <StyledImageWrapper>
          <img src="./assets/preview.png" alt="JSON Crack Preview" />
        </StyledImageWrapper>
      </StyledHeroSection>
    </Layout>
  );
};

export default HomePage;
