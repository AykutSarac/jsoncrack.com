import React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { Button, Group, Stack, Text } from "@mantine/core";
import styled from "styled-components";
import { FaChevronRight } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import Layout from "src/layout/Layout";

const StyledHeroSection = styled.div`
  position: relative;
  background-size: 100% 100%;
  margin-bottom: -48px;
  background-image: radial-gradient(49% 81% at 45% 47%, #21415f 1%, #60006a00 100%),
    radial-gradient(113% 91% at 17% -2%, #1b1b1b 1%, #ff000000 99%),
    radial-gradient(142% 91% at 83% 7%, #1b1b1b 1%, #ff000000 99%),
    radial-gradient(142% 91% at -6% 74%, #1b1b1b 1%, #ff000000 99%),
    radial-gradient(142% 91% at 111% 84%, #1b1b1b 0%, #5b004eff 99%);

  @media only screen and (max-width: 1240px) {
    flex-direction: column;
  }
`;

const StyledHeroSectionBody = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5em 10%;
  overflow: hidden;
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
  height: calc(100vh - 111px);
  text-align: center;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

const StyledHighlightedText = styled(Text)`
  font-size: 40px;
  font-weight: 800;
  display: inline;

  background-color: gray;
  background-image: linear-gradient(45deg, gray, slategray);
  background-size: 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;

  @media only screen and (max-width: 992px) {
    font-size: 24px;
  }
`;

const StyledHeroText = styled.p`
  font-size: 18px;
  color: #a9aaaa;
  font-weight: 600;
  max-width: 600px;
  text-align: center;

  @media only screen and (max-width: 992px) {
    max-width: 100%;
    font-size: 14px;
  }
`;

const StyledHeroTitle = styled.h1`
  color: #dacfcf;
  font-size: 40px;
  font-weight: 800;
  text-align: center;

  @media only screen and (max-width: 992px) {
    font-size: 26px;
  }
`;

const HeroSection = () => (
  <StyledHeroSection id="hero-section">
    <StyledHeroSectionBody>
      <Stack w="100%" mx="auto" align="center">
        <StyledHeroTitle>
          Understand your{" "}
          <StyledHighlightedText>
            <Typewriter
              words={["JSON", "YAML", "XML", "TOML", "CSV"]}
              typeSpeed={100}
              deleteSpeed={60}
              delaySpeed={2000}
              loop
            />
          </StyledHighlightedText>
          <br />
          better by visualizing
        </StyledHeroTitle>

        <StyledHeroText>
          Visualize, analyze, and manipulate data with ease, a versatile and powerful tool for data
          representation and exploration.
        </StyledHeroText>
        <Group gap="xl">
          <Button
            color="gray.2"
            c="indigo"
            component={Link}
            href="/editor"
            fw="bold"
            rightSection={<FaChevronRight />}
            size="xl"
            visibleFrom="md"
          >
            GO TO EDITOR
          </Button>
          <Button
            color="gray.2"
            c="indigo"
            component={Link}
            href="/editor"
            fw="bold"
            rightSection={<FaChevronRight />}
            size="md"
            style={{ border: "2px solid orange" }}
            hiddenFrom="md"
          >
            GO TO EDITOR
          </Button>
        </Group>
      </Stack>
    </StyledHeroSectionBody>
  </StyledHeroSection>
);

export const HomePage = () => {
  const [ads, setAds] = React.useState(false);

  return (
    <Layout>
      <Head>
        <title>JSON Crack | Visualize Instantly Into Graphs</title>
      </Head>
      <HeroSection />
      <Script src="https://m.servedby-buysellads.com/monetization.js" onLoad={() => setAds(true)} />
    </Layout>
  );
};

export default HomePage;
