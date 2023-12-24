import React from "react";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { Button, Group, Stack, Title, Text } from "@mantine/core";
import styled from "styled-components";
import { FaChevronRight } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import Layout from "src/layout/Layout";

const StyledHeroSection = styled.div`
  position: relative;
  background-size: 100% 100%;
  margin-bottom: -48px;
  background-position:
    0px 0px,
    0px 0px,
    0px 0px,
    0px 0px,
    0px 0px;
  background-image: radial-gradient(49% 81% at 45% 47%, #26001fff 1%, #60006a00 100%),
    radial-gradient(113% 91% at 17% -2%, #0f000cff 1%, #ff000000 99%),
    radial-gradient(142% 91% at 83% 7%, #0f000cff 1%, #ff000000 99%),
    radial-gradient(142% 91% at -6% 74%, #0f000cff 1%, #ff000000 99%),
    radial-gradient(142% 91% at 111% 84%, #0f000cff 0%, #5b004eff 99%);
  overflow: hidden;

  @keyframes shine {
    0% {
      background-position:
        0 0,
        3px 60px,
        130px 270px,
        70px 100px;
    }
    100% {
      background-position:
        1000px 1000px,
        1000px 1000px,
        1000px 1000px,
        1000px 1000px;
    }
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    content: "";
    background-color: transparent;
    background-image: radial-gradient(white, rgba(255, 255, 255, 0.2) 2px, transparent 2px),
      radial-gradient(white, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
      radial-gradient(white, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
      radial-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1) 2px, transparent 1px);
    background-size:
      800px 800px,
      400px 400px,
      300px 300px,
      200px 200px;
    background-position:
      0 0,
      3px 60px,
      130px 270px,
      70px 100px;
    animation: shine 100s linear infinite alternate; /* Use alternate to make it smoother */
  }

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
  height: calc(100vh - 56px);
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
`;

const StyledHeroText = styled.p`
  font-size: 18px;
  color: #a9aaaa;
  font-weight: 600;
  max-width: 600px;
  text-align: center;

  @media only screen and (max-width: 600px) {
    max-width: 100%;
  }
`;

const HeroSection = () => (
  <StyledHeroSection id="hero-section">
    <StyledHeroSectionBody>
      <Stack w="100%" mx="auto" align="center">
        <Title c="#d0c9c9" order={1} fz={40} fw={800} style={{ textAlign: "center" }}>
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
        </Title>

        <StyledHeroText>
          Visualize, analyze, and manipulate data with ease, a versatile and powerful tool for data
          representation and exploration.
        </StyledHeroText>
        <Group gap="xl">
          <Button
            color="orange"
            variant="light"
            component={Link}
            href="/editor"
            fw="bold"
            rightSection={<FaChevronRight />}
            size="xl"
            style={{ border: "2px solid orange" }}
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
