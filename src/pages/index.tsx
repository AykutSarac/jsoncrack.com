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
  Image,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { FaChevronRight } from "react-icons/fa";
import { SiVisualstudiocode } from "react-icons/si";
import { Typewriter } from "react-simple-typewriter";
import { lightTheme } from "src/constants/theme";
import { Footer } from "src/layout/Footer";
import { Navbar } from "src/layout/Navbar";

const PreviewDiagram = dynamic(() => import("src/components/PreviewDiagram"), {
  ssr: false,
});

const StyledHome = styled.div``;

const StyledHeroSection = styled.div`
  min-height: 80vh;
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
  width: 60%;
  right: 0;
  filter: blur(1.2px);
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
  }

  @media only screen and (max-width: 735px) {
    .mantine-Image-root {
      display: none;
    }
  }
`;

// const PostCard: React.FC<{ avatar: string; content: string; name: string; handle: string }> = ({
//   avatar,
//   content,
//   name,
//   handle,
// }) => (
//   <Paper p="sm" radius="lg" w={350} h={200} withBorder>
//     <Flex align="center" gap="sm">
//       <Avatar radius="lg" src={avatar} />
//       <Stack spacing="0">
//         <Text fw="bold">{name}</Text>
//         <Text color="dimmed">@{handle}</Text>
//       </Stack>
//     </Flex>
//     <Text mt="lg">{content}</Text>
//   </Paper>
// );

export const HomePage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <StyledHome>
        <Head>
          <title>JSON Crack - Crack your data into pieces</title>
        </Head>
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
              <PreviewDiagram />
            </Right>
          </StyledHeroSectionBody>
        </StyledHeroSection>
      </StyledHome>
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
          <Anchor href="/pricing" color="yellow" fw="bold" w="fit-content">
            View Premium Plan <FaChevronRight />
          </Anchor>
        </Stack>
      </StyledStatsWrapper>

      <StyledFeatures my={60}>
        <Flex py="lg" align="flex-start" gap="lg">
          <Image width={500} src="/assets/highlight_graph.svg" alt="search through graph" />
          <Stack pt="lg">
            <Text color="dark" fz="1.5rem" fw="bold">
              ADVANCED GRAPH SEARCH
            </Text>
            <Text color="dark" maw={500}>
              Quickly navigate through your data visualization using JSON Crack&apos;s intuitive
              search functionality. Directly locate specific nodes matching with your search!
            </Text>
          </Stack>
        </Flex>
        <Flex py="lg" align="center" gap="lg" direction="row-reverse">
          <Image width={300} src="/assets/multidata.png" alt="multiple format support" />
          <Stack>
            <Text color="dark" fz="1.5rem" fw="bold">
              DYNAMIC DATA VISUALIZATION
            </Text>
            <Text color="dark" maw={500}>
              JSON Crack revolutionizes data visualization by transforming JSON, YAML, XML, and
              other data types into captivating, interactive graphs. Gain deep insights into complex
              data structures at a glance.
            </Text>
          </Stack>
        </Flex>
        <Flex py="lg" align="center" gap="lg">
          <Image width={400} src="/assets/download_image.png" alt="download as image" />
          <Stack>
            <Text color="dark" fz="1.5rem" fw="bold">
              DOWNLOAD AS IMAGE
            </Text>
            <Text color="dark" maw={500}>
              Capture and share your insights effortlessly by downloading your generated graphs as
              image files. Easily collaborate and communicate data-driven findings with colleagues
              and stakeholders.
            </Text>
          </Stack>
        </Flex>
        <Flex direction="row-reverse" py="lg" align="flex-start" gap="lg">
          <Image width={500} src="/assets/preview_image.svg" alt="preview images" />
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
      {/* <Container mt="lg">
          <Title color="dark" order={2}>
            What does the people say about JSON Crack?
          </Title>
          <Flex py={40} justify="center" gap="lg" wrap="wrap">
            <PostCard
              name="Alex Xu"
              handle="alexxubyte"
              avatar="https://media.licdn.com/dms/image/C5603AQEReSODdvboJw/profile-displayphoto-shrink_800_800/0/1633380703911?e=1692230400&v=beta&t=gjXipAUNUFzU47aMNrWiPC1ZP2H4oUaCNpDtJw6Wshs"
              content="A very handy tool for converting nested JSON files into graph diagrams."
            />
            <PostCard
              name="GitHub"
              handle="github"
              avatar="https://pbs.twimg.com/profile_images/1633247750010830848/8zfRrYjA_400x400.png"
              content="Looking to understand or explore some JSON? Just paste or upload to visualize it as a graph with https://jsonvisio.com 😍 Thanks to @aykutsarach!"
            />
            <PostCard
              name="GitHub"
              handle="github"
              avatar="https://pbs.twimg.com/profile_images/1633247750010830848/8zfRrYjA_400x400.png"
              content="Looking to understand or explore some JSON? Just paste or upload to visualize it as a graph with https://jsonvisio.com 😍 Thanks to @aykutsarach!"
            />
            <PostCard
              name="GitHub"
              handle="github"
              avatar="https://pbs.twimg.com/profile_images/1633247750010830848/8zfRrYjA_400x400.png"
              content="Looking to understand or explore some JSON? Just paste or upload to visualize it as a graph with https://jsonvisio.com 😍 Thanks to @aykutsarach!"
            />
          </Flex>
        </Container> */}

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
      <Footer />
    </ThemeProvider>
  );
};

export default HomePage;
