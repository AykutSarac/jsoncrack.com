import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import {
  Badge,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import styled from "styled-components";
import { BiChevronDown } from "react-icons/bi";
import { FaRocket } from "react-icons/fa";
import {
  MdChevronRight,
  MdCompare,
  MdExtension,
  MdOutlineArrowRightAlt,
  MdRebaseEdit,
  MdSearch,
} from "react-icons/md";
import useBackgroundCursorPosition from "use-bg-cursor-pos";
import Layout from "src/layout/Layout";

const PricingCards = dynamic(() => import("./pricing").then(mod => mod.PricingCards));

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
  padding: 5em 10%;
  overflow: hidden;
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
  text-align: center;
  gap: 60px;
  min-height: 60vh;

  @media only screen and (max-width: 768px) {
    padding: 3em 16px;
  }
`;

const StyledHeroText = styled.p`
  font-size: 0.8rem;
  color: #414141;
  font-weight: 400;
  max-width: 100%;
  min-width: 400px;
  text-align: center;

  @media only screen and (min-width: 576px) {
    font-size: 1.3rem;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 1.4rem;
    max-width: 60%;
  }
`;

const StyledPaper = styled.div`
  position: relative;
  z-index: 1;

  &:before {
    position: absolute;
    z-index: -1;
    opacity: 0.7;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: 100%;
    background-size: 20px 20px;
    background-image: linear-gradient(to right, #dcdcdc 1px, transparent 1px),
      linear-gradient(to bottom, #dcdcdc 1px, transparent 1px);
    background-position: top center;
    image-rendering: pixelated;
    -webkit-mask-image: linear-gradient(to bottom, transparent, 20%, white, 90%, transparent);
    mask-image: linear-gradient(to bottom, transparent, 20%, white, 90%, transparent);
  }
`;

const StyledHeroTitle = styled.h1`
  position: relative;
  font-size: 1.8rem;
  font-weight: 800;
  display: inline;
  color: #2e2e2e;
  width: fit-content;
  line-height: 1.2;
  filter: drop-shadow(2px 1px 1px rgba(0, 0, 0, 0.1));

  @keyframes textShine {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  @media only screen and (min-width: 576px) {
    font-size: 3rem;
  }

  @media only screen and (min-width: 992px) {
    font-size: 4rem;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 4.5rem;
  }
`;

const StyledHeroGradient = styled.span`
  background: linear-gradient(90deg, #f5a623, #ff5f6d);
  background-size: 200% 200%;
  animation: textShine 2s linear infinite alternate;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-left: 8px;
`;

const StyledCarouselWrapper = styled.section`
  max-width: 75%;
  position: relative;
  z-index: 1;
  border: 6px solid #bdbdbd;
  margin: 60px auto;
  border-radius: 14px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media only screen and (max-width: 768px) {
    max-width: 85%;
    margin: 0 auto;
  }
`;

const metaDescription =
  "JSON Crack Editor is a tool for visualizing into graphs, analyzing, editing, formatting, querying, transforming and validating JSON, CSV, YAML, XML, and more.";

export const HomePage = () => {
  const [card1, bg1] = useBackgroundCursorPosition("#f2f2f2", "#ffffff", "200px");
  const [card2, bg2] = useBackgroundCursorPosition("#f2f2f2", "#ffffff", "200px");
  const [card3, bg3] = useBackgroundCursorPosition("#f2f2f2", "#ffffff", "200px");
  const [card4, bg4] = useBackgroundCursorPosition("#f2f2f2", "#ffffff", "200px");

  return (
    <Layout>
      <Head>
        <title>JSON Crack | Best JSON Visualizer, Formatter and Viewer for everyone</title>
        <meta name="description" content={metaDescription} key="description" />
        <meta property="og:description" content={metaDescription} key="ogdescription" />
        <meta name="twitter:description" content={metaDescription} key="twdescription" />
      </Head>
      <StyledHeroSection id="hero-section">
        <StyledHeroSectionBody>
          <Stack flex="1" miw={250} mx="auto" align="center">
            <StyledHeroTitle>
              Transform your data
              <br />
              into
              <StyledHeroGradient>interactive graphs</StyledHeroGradient>
            </StyledHeroTitle>

            <StyledHeroText>
              Experience the ultimate online editor designed to empower you in visualizing,
              refining, and formatting data effortlessly.
            </StyledHeroText>
            <Group justify="center">
              <Button
                component={Link}
                prefetch={false}
                href="/editor"
                size="xl"
                fw="bold"
                color="indigo"
                rightSection={<MdChevronRight size={30} />}
                visibleFrom="sm"
                radius="md"
              >
                Go To Editor
              </Button>
              <Button
                component={Link}
                prefetch={false}
                href="/editor"
                fw="bold"
                size="md"
                color="indigo"
                rightSection={<MdChevronRight size={24} />}
                hiddenFrom="sm"
                radius="md"
              >
                Go To Editor
              </Button>
              <Button
                component="a"
                href="/#features"
                size="xl"
                fw="bold"
                variant="outline"
                color="gray.7"
                leftSection={<FaRocket />}
                visibleFrom="sm"
                radius="md"
              >
                Explore Premium
              </Button>
              <Button
                component="a"
                href="/#features"
                fw="bold"
                size="md"
                variant="outline"
                color="gray.7"
                leftSection={<FaRocket />}
                hiddenFrom="sm"
                radius="md"
              >
                Explore Premium
              </Button>
            </Group>
            <Flex gap="xs">
              <Badge color="dark" radius="sm" variant="light">
                JSON
              </Badge>
              <Badge color="dark" radius="sm" variant="light">
                YAML
              </Badge>
              <Badge color="dark" radius="sm" variant="light">
                CSV
              </Badge>
              <Badge color="dark" radius="sm" variant="light">
                XML
              </Badge>
              <Badge color="dark" radius="sm" variant="light">
                TOML
              </Badge>
            </Flex>
          </Stack>
        </StyledHeroSectionBody>
      </StyledHeroSection>

      <StyledCarouselWrapper id="preview">
        <Carousel
          getEmblaApi={embla => {
            setInterval(() => {
              embla.scrollNext();
            }, 10_000);
          }}
          withIndicators
          loop
          height="100%"
          style={{ flex: 1 }}
        >
          <Carousel.Slide>
            <img width="1440" height="760" src="./assets/preview/1.jpeg" alt="Preview 1" />
          </Carousel.Slide>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Carousel.Slide key={index}>
                <img
                  loading="lazy"
                  width="1440"
                  height="760"
                  src={`./assets/preview/${index + 2}.jpeg`}
                  alt={`Preview ${index + 2}`}
                />
              </Carousel.Slide>
            ))}
        </Carousel>
      </StyledCarouselWrapper>
      <Paper
        pt={rem(280)}
        px={rem(80)}
        pb={rem(20)}
        maw="95%"
        radius="xl"
        bg="dark.9"
        mx="auto"
        mt="-17.5rem"
        style={{ textAlign: "center" }}
        visibleFrom="sm"
      >
        <Title c="white" order={2} fz={36} fw={500} mb="md">
          Optimized for easy navigation
        </Title>
        <Text mx="auto" fz={16} maw="80%" c="dimmed" mb={60}>
          Designed to help you navigate through your data with ease. The editor provides a clean and
          intuitive interface that allows you to focus on what matters most: your data.
        </Text>
      </Paper>

      <section id="features">
        <Stack mt={100} align="center" px="lg" mx="auto" maw={{ sm: "80%", md: "65%" }}>
          <ThemeIcon variant="transparent" color="dark" mx="auto" size="xl">
            <BiChevronDown size={40} />
          </ThemeIcon>

          <Title order={2} fz={{ sm: 36, md: 48 }} fw={600} mt={50} style={{ textAlign: "center" }}>
            Unlock the Ease of Visualizing Your Data
          </Title>
          <Text c="dark.2" fz={{ base: 12, md: 16 }} style={{ textAlign: "center" }}>
            Forget juggling JSON formatters, validators, and viewers! JSON Crack simplifies your
            workflow with effortless formatting, robust validation, and intuitive visualizations -
            all in one user-friendly platform. See your data sing and make smarter decisions,
            faster.
          </Text>
        </Stack>

        <Grid w="90%" gutter={24} mt={50} mb={150} mx="auto">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper
              pos="relative"
              ref={card1 as React.RefObject<HTMLDivElement>}
              p={30}
              withBorder
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                overflow: "hidden",
                background: bg1,
              }}
            >
              <StyledPaper>
                <ThemeIcon
                  color="gray.3"
                  c="dark.4"
                  bg="gray.1"
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdCompare size={28} />
                </ThemeIcon>
                <Title order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Compare
                </Title>
                <Text fz={{ sm: 14, md: 18 }} fw={300} lts={0.4} c="dark.5" mt={10}>
                  Compare and analyze your data smoothly with the interactive graphs.
                </Text>
                <Image
                  loading="lazy"
                  src="./assets/features/compare.webp"
                  alt="Compare"
                  w={{ sm: 350, md: 400 }}
                  mt={20}
                  style={{
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                  }}
                />
              </StyledPaper>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper
              ref={card2 as React.RefObject<HTMLDivElement>}
              p={30}
              withBorder
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                overflow: "hidden",
                background: bg2,
              }}
            >
              <StyledPaper>
                <ThemeIcon
                  color="gray.3"
                  c="dark.4"
                  bg="gray.1"
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdRebaseEdit size={28} />
                </ThemeIcon>
                <Title order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Edit
                </Title>
                <Text fz={{ sm: 14, md: 16 }} fw={300} lts={0.4} c="dark.5" my={10}>
                  Directly modify your data through the graphs, without wasting time on manual
                  editing.
                </Text>
                <Paper withBorder shadow="sm" radius="sm" w="fit-content" mx="auto">
                  <Image
                    loading="lazy"
                    radius="sm"
                    src="./assets/features/edit.webp"
                    alt="Edit"
                    w={340}
                  />
                </Paper>
              </StyledPaper>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper
              ref={card3 as React.RefObject<HTMLDivElement>}
              p={30}
              withBorder
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                overflow: "hidden",
                background: bg3,
              }}
            >
              <StyledPaper>
                <ThemeIcon
                  color="gray.3"
                  c="dark.4"
                  bg="gray.1"
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdSearch size={28} />
                </ThemeIcon>
                <Title order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Search
                </Title>
                <Text fz={{ sm: 14, md: 18 }} fw={300} lts={0.4} c="dark.5" mt={10}>
                  Highlight and search what you need in your data, without any hassle.
                </Text>
                <Image
                  loading="lazy"
                  src="./assets/features/search.webp"
                  alt="Search"
                  w={{ sm: 400, md: 500 }}
                  mx="auto"
                  mt={20}
                  style={{
                    filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                  }}
                />
              </StyledPaper>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper
              ref={card4 as React.RefObject<HTMLDivElement>}
              p={30}
              withBorder
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                overflow: "hidden",
                background: bg4,
              }}
            >
              <StyledPaper>
                <ThemeIcon
                  color="gray.3"
                  c="dark.4"
                  bg="gray.1"
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdExtension size={28} />
                </ThemeIcon>
                <Title order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Choose Your Format
                </Title>
                <Text fz={{ sm: 14, md: 18 }} fw={300} lts={0.4} c="dark.5" mt={10}>
                  Visualize and edit your data in multiple formats. JSON, YAML, CSV, XML, and TOML
                  are supported.
                </Text>
                <Grid gutter="lg" mt={20}>
                  <Grid.Col span={6}>
                    <Badge
                      w="100%"
                      mih={{ sm: 10, md: 40 }}
                      variant="light"
                      color="indigo"
                      radius="sm"
                      size="xl"
                    >
                      JSON
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Badge
                      w="100%"
                      mih={{ sm: 10, md: 40 }}
                      variant="light"
                      color="cyan"
                      radius="sm"
                      size="xl"
                    >
                      YAML
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Badge
                      w="100%"
                      mih={{ sm: 10, md: 40 }}
                      variant="light"
                      color="grape"
                      radius="sm"
                      size="xl"
                    >
                      CSV
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Badge
                      w="100%"
                      mih={{ sm: 10, md: 40 }}
                      variant="light"
                      color="red"
                      radius="sm"
                      size="xl"
                    >
                      XML
                    </Badge>
                  </Grid.Col>
                </Grid>
              </StyledPaper>
            </Paper>
          </Grid.Col>
        </Grid>
      </section>

      <PricingCards />
      <Center mt={80}>
        <Stack align="center">
          <StyledHeroText>More than an editor.</StyledHeroText>

          <a href="https://app.jsoncrack.com/sign-up">
            <Button size="lg" color="dark" rightSection={<MdOutlineArrowRightAlt />} fullWidth>
              Start using now
            </Button>
          </a>
        </Stack>
      </Center>
    </Layout>
  );
};

export default HomePage;
