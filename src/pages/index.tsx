import React from "react";
import Head from "next/head";
import Link from "next/link";
import styled, { ThemeProvider } from "styled-components";
import {
  Anchor,
  Button,
  Center,
  Container,
  Flex,
  Image,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { FaChevronRight } from "react-icons/fa";
import { SiVisualstudiocode } from "react-icons/si";
import { Typewriter } from "react-simple-typewriter";
import { HoverCard } from "src/components/FlexBar";
import { lightTheme } from "src/constants/theme";
import { Footer } from "src/layout/Footer";
import { Navbar } from "src/layout/Navbar";

const StyledHeroSection = styled.div`
  --bg-color: ${({ theme }) => theme.GRID_BG_COLOR};
  --line-color-1: ${({ theme }) => theme.GRID_COLOR_PRIMARY};
  --line-color-2: ${({ theme }) => theme.GRID_COLOR_SECONDARY};

  background-color: var(--bg-color);
  background-image: linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(90deg, var(--line-color-1) 1.5px, transparent 1.5px),
    linear-gradient(var(--line-color-2) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-color-2) 1px, transparent 1px);
  background-position: -1.5px -1.5px, -1.5px -1.5px, -1px -1px, -1px -1px;
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;

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
  min-height: 60vh;

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
  min-width: 40%;
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
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  align-items: center;
  background: #421665;
  padding: 24px;
`;

const StyledFeatures = styled(Container)`
  .mantine-Image-root {
    filter: drop-shadow(3px 3px 5px black);

    img {
      width: 100%;
      object-fit: contain;
    }
  }

  @media only screen and (max-width: 735px) {
    .mantine-Image-root {
      display: none;
    }
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
          <Link href="/editor" prefetch={false}>
            <Button fw="bold" rightIcon={<FaChevronRight />} size="lg">
              GO TO EDITOR
            </Button>
          </Link>
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
        <Image src="/assets/diagram_bg.webp" width="1200" height="593" alt="diagram" />
      </Right>
    </StyledHeroSectionBody>
  </StyledHeroSection>
);

const StatsBanner = () => (
  <StyledStatsWrapper>
    <Group spacing="xl">
      <Stack spacing="0">
        <Text fw="bolder" fz="1.6rem">
          24.5K
        </Text>
        <Text color="gray.5" fw="bold" fz="0.8rem">
          GITHUB STARS
        </Text>
      </Stack>
      <Stack spacing="0">
        <Text fw="bolder" fz="1.6rem">
          50K+
        </Text>
        <Text color="gray.5" fw="bold" fz="0.8rem">
          MONTHLY USERS
        </Text>
      </Stack>
      <Stack spacing="0">
        <Text fw="bolder" fz="1.6rem">
          GPL-3
        </Text>
        <Text color="gray.5" fw="bold" fz="0.8rem">
          LICENSE
        </Text>
      </Stack>
    </Group>
    <Stack ml={60}>
      <Text maw={800} fz="0.9rem">
        JSON Crack is an open-source project with a GPL-3 license. By subscribing to our premium
        plan, you can help us continue developing and maintaining it, also enjoy the benefits.
      </Text>
      <Link href="/pricing" prefetch={false}>
        <Text color="yellow" fw="bold" w="fit-content">
          View Premium Plan <FaChevronRight />
        </Text>
      </Link>
    </Stack>
  </StyledStatsWrapper>
);

const Features = () => (
  <StyledFeatures my={60}>
    <Flex py="lg" align="flex-start" gap="lg">
      <Image
        width={500}
        height={287}
        src="/assets/highlight_graph.svg"
        alt="search through graph"
      />
      <Stack pt="lg">
        <Text color="dark" fz="1.5rem" fw="bold">
          ADVANCED GRAPH SEARCH
        </Text>
        <Text color="dark" maw={500}>
          Quickly navigate through your data visualization using JSON Crack&apos;s intuitive search
          functionality. Directly locate specific nodes matching with your search!
        </Text>
      </Stack>
    </Flex>
    <Flex py="lg" align="center" gap="lg" direction="row-reverse">
      <Image width={300} height={260} src="/assets/multidata.png" alt="multiple format support" />
      <Stack>
        <Text color="dark" fz="1.5rem" fw="bold">
          DYNAMIC DATA VISUALIZATION
        </Text>
        <Text color="dark" maw={500}>
          JSON Crack revolutionizes data visualization by transforming JSON, YAML, XML, and other
          data types into captivating, interactive graphs. Gain deep insights into complex data
          structures at a glance.
        </Text>
      </Stack>
    </Flex>
    <Flex py="lg" align="center" gap="lg">
      <Image width={400} height={344} src="/assets/download_image.webp" alt="download as image" />
      <Stack>
        <Text color="dark" fz="1.5rem" fw="bold">
          DOWNLOAD AS IMAGE
        </Text>
        <Text color="dark" maw={500}>
          Capture and share your insights effortlessly by downloading your generated graphs as image
          files. Easily collaborate and communicate data-driven findings with colleagues and
          stakeholders.
        </Text>
      </Stack>
    </Flex>
    <Flex direction="row-reverse" py="lg" align="flex-start" gap="lg">
      <Image width={500} height={285} src="/assets/preview_image.svg" alt="preview images" />
      <Stack pt="lg">
        <Text color="dark" fz="1.5rem" fw="bold">
          IMAGE PREVIEW
        </Text>
        <Text color="dark" maw={500}>
          Seamlessly preview embedded images within your JSON, YAML, or XML data. Instantly view
          visuals, photos, and graphics directly within JSON Crack, saving you time and effort.
        </Text>
      </Stack>
    </Flex>
  </StyledFeatures>
);

const HeroBottom = () => (
  <Container mt={100}>
    <Stack>
      <Title color="dark" order={3} maw={500} mx="auto" align="center">
        But that&apos;s not all yet!
        <br />
        Explore the full potential of your data now......
      </Title>
      <Center>
        <Link href="/editor" prefetch={false}>
          <Button color="violet" fw="bold" rightIcon={<FaChevronRight />} size="lg">
            GO TO EDITOR
          </Button>
        </Link>
      </Center>
    </Stack>
  </Container>
);

export const HomePage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Head>
        <title>JSON Crack - Crack your data into pieces</title>
      </Head>
      <HeroSection />
      <StatsBanner />
      <Features />
      <HeroBottom />
      <HoverCard />
      <Footer />
    </ThemeProvider>
  );
};

export default HomePage;
