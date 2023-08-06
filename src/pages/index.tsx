import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import styled, { ThemeProvider } from "styled-components";
import {
  Anchor,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { FaChevronRight } from "react-icons/fa";
import { SiVisualstudiocode } from "react-icons/si";
import { Typewriter } from "react-simple-typewriter";
import { HovercardAds } from "src/components/HovercardAds";
import { lightTheme } from "src/constants/theme";
import { FeaturesCards } from "src/containers/Features";
import { Navbar } from "src/layout/Navbar";

const Footer = dynamic(() => import("src/layout/Footer").then(c => c.Footer));

const StyledHeroSection = styled.div`
  --bg-color: ${({ theme }) => theme.GRID_BG_COLOR};
  --line-color-1: ${({ theme }) => theme.GRID_COLOR_PRIMARY};
  --line-color-2: ${({ theme }) => theme.GRID_COLOR_SECONDARY};

  background-color: var(--bg-color);
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

  @media only screen and (max-width: 1240px) {
    flex-direction: column;
  }
`;

const StyledHeroSectionBody = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rem 10%;
  overflow: hidden;
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
  height: 70vh;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

const StyledTitle = styled.h1`
  font-weight: 900;
  margin: 0;
  font-size: 4rem;
  color: #323232;
  font-family: var(--mona-sans);
  filter: drop-shadow(2px 2px 1px black);

  @media only screen and (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StyledGradientText = styled.span`
  background: #ffb76b;
  background: linear-gradient(to right, #fca74d 0%, #fda436 30%, #ff7c00 60%, #ff7f04 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Left = styled.div`
  width: 100%;
  z-index: 1;
`;

const Right = styled.div`
  position: absolute;
  transform: translate(25%, 25%);
  width: 80%;
  right: 0;
  filter: blur(1px);
  user-select: none;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const StyledHighlightedText = styled.span`
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: #eab308;
`;

const StyledHeroText = styled.p`
  font-size: 1.25rem;
  color: #5e656b;
  font-weight: 600;
  max-width: 600px;
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  background: #421665;
  padding: 24px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeroSection = () => (
  <StyledHeroSection id="hero-section">
    <Navbar />
    <StyledHeroSectionBody>
      <Left>
        <StyledTitle>
          <StyledGradientText>JSON</StyledGradientText> CRACK
        </StyledTitle>
        <StyledHeroText>
          Seamlessly visualize your{" "}
          <StyledHighlightedText>
            <Typewriter
              words={["JSON", "YAML", "XML", "TOML", "CSV"]}
              typeSpeed={100}
              deleteSpeed={60}
              delaySpeed={2000}
              loop
            />
          </StyledHighlightedText>{" "}
          instantly into graphs!
        </StyledHeroText>
        <Group spacing="xl">
          <Button
            component={Link}
            href="/editor"
            prefetch={false}
            fw="bold"
            rightIcon={<FaChevronRight />}
            size="lg"
          >
            GO TO EDITOR
          </Button>
          <Tooltip
            maw={400}
            label="VS Code extension only contains JSON visualization without additional features."
            withArrow
            multiline
            position="bottom"
          >
            <Anchor
              href="https://marketplace.visualstudio.com/items?itemName=AykutSarac.jsoncrack-vscode"
              target="_blank"
              fw="bold"
            >
              <Flex gap="xs" align="center">
                <SiVisualstudiocode />
                Get it on VS Code
              </Flex>
            </Anchor>
          </Tooltip>
        </Group>
      </Left>
      <Right>
        <img
          src="/assets/diagram_bg.webp"
          width="1200"
          height="593"
          alt="diagram"
          loading="eager"
        />
      </Right>
    </StyledHeroSectionBody>
  </StyledHeroSection>
);

const StatsBanner = () => (
  <StyledStatsWrapper>
    <Flex gap="lg">
      <Stack spacing="0">
        <Text fw="bolder" fz="1.8rem" truncate>
          24.8K
        </Text>
        <Text color="gray.5" fw="bold" fz="0.8rem" truncate>
          GITHUB STARS
        </Text>
      </Stack>
      <Stack spacing="0">
        <Text fw="bolder" fz="1.8rem" truncate>
          50K+
        </Text>
        <Text color="gray.5" fw="bold" fz="12px" truncate>
          MONTHLY USERS
        </Text>
      </Stack>
      <Stack spacing="0">
        <Text fw="bolder" fz="1.8rem" truncate>
          GPL-3
        </Text>
        <Text color="gray.5" fw="bold" fz="0.8rem" truncate>
          LICENSE
        </Text>
      </Stack>
    </Flex>
    <Stack ml={60}>
      <Text maw={600} fw="bold" fz="0.9rem">
        JSON Crack is an open-source project under GPL-3 license. Support us through our premium
        plan for continued development and exclusive benefits.
      </Text>
      <Anchor
        component={Link}
        href="/pricing"
        prefetch={false}
        color="yellow"
        fw="bold"
        w="fit-content"
      >
        View Premium Plan <FaChevronRight />
      </Anchor>
    </Stack>
  </StyledStatsWrapper>
);

const HeroBottom = () => (
  <Container mt={100}>
    <Stack>
      <Title color="dark" order={2} fz="xl" maw={500} mx="auto" align="center">
        But that&apos;s not all yet!
        <br />
        Explore the full potential of your data now......
      </Title>
      <Center>
        <Button
          component={Link}
          href="/editor"
          prefetch={false}
          color="violet"
          fw="bold"
          rightIcon={<FaChevronRight />}
          size="lg"
        >
          GO TO EDITOR
        </Button>
      </Center>
    </Stack>
  </Container>
);

export const HomePage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Head>
        <title>JSON Crack - Visualize Data to Graphs</title>
      </Head>
      <HeroSection />
      <StatsBanner />
      <FeaturesCards />
      <HeroBottom />
      <HovercardAds />
      <Footer />
    </ThemeProvider>
  );
};

export default HomePage;
