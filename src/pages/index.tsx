import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import {
  Accordion,
  Badge,
  Button,
  Container,
  Flex,
  Grid,
  Image,
  List,
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
import { IoMdInformationCircle } from "react-icons/io";
import { MdChevronRight, MdCompare, MdExtension, MdRebaseEdit, MdSearch } from "react-icons/md";
import useBackgroundCursorPosition from "use-bg-cursor-pos";
import { images, metaDescription } from "src/constants/landing";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";

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
  color: #5b5b5b;
  font-weight: 400;
  max-width: 100%;
  min-width: 400px;
  text-align: center;

  @media only screen and (min-width: 576px) {
    font-size: 1.2rem;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 1.3rem;
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
  margin: 60px auto;
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

export const FAQ = Object.freeze([
  {
    title: "What is JSON Crack and what does it do?",
    content:
      "JSON Crack is an open-source free with paid option data visualization app capable of visualizing data formats such as JSON, YAML, XML, CSV and more, into interactive graphs. This makes it much simpler to analyze complex JSON structures.",
  },
  {
    title: "What are the advantages of the premium plan?",
    content: (
      <>
        JSON Crack Premium helps you to work with data easier than the free version; it&apos;s more
        compact, faster and smoother than ever. It&apos;s designed for anybody who works with data.
        Most significant features include:
        <List mt="lg">
          <List.Item>Expanded support for larger datasets</List.Item>
          <List.Item>Compact visualization style: what you see is what you need!</List.Item>
          <List.Item>Searching is faster and smoother</List.Item>
          <List.Item>Ask AI to filter your data</List.Item>
          <List.Item>Direct data editing within the graphs & tree view</List.Item>
        </List>
      </>
    ),
  },
  {
    title: "Who is it for and what are the use-cases?",
    content:
      "JSON Crack is for developers, data analysts, and anyone who works with JSON data. It's useful for visualizing JSON data structures, debugging, and understanding complex data. It's also helpful for creating documentation and presentations for your teams/customers.",
  },
  {
    title: "Do you see my data pasted on the editor?",
    content:
      "No, JSON Crack does not store your data anywhere unless you upload it manually. When you paste your data into the editor, it's processed on your device only to create the visualization. Your data remains completely private.",
  },
]);

export const HomePage = () => {
  const [card1, bg1] = useBackgroundCursorPosition("#fff7f7", "#ffecec", "300px");
  const [card2, bg2] = useBackgroundCursorPosition("#f7fff7", "#ecffec", "300px");
  const [card3, bg3] = useBackgroundCursorPosition("#fff7fe", "#ffecf7", "300px");
  const [card4, bg4] = useBackgroundCursorPosition("#f5fbff", "#e9f3ff", "300px");

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
            <Flex gap="xs">
              <Badge size="xs" color="dark" radius="sm" variant="light">
                JSON
              </Badge>
              <Badge size="xs" color="dark" radius="sm" variant="light">
                YAML
              </Badge>
              <Badge size="xs" color="dark" radius="sm" variant="light">
                CSV
              </Badge>
              <Badge size="xs" color="dark" radius="sm" variant="light">
                XML
              </Badge>
              <Badge size="xs" color="dark" radius="sm" variant="light">
                TOML
              </Badge>
            </Flex>
            <Button
              onClick={() => gaEvent("Hero Section", "click upgrade premium")}
              component={Link}
              href="/pricing"
              size="xl"
              fw="bold"
              color="orange.6"
              rightSection={<MdChevronRight size={30} />}
              visibleFrom="sm"
              radius="lg"
              mt="lg"
              style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              href="/pricing"
              fw="bold"
              size="md"
              color="orange.6"
              rightSection={<MdChevronRight size={24} />}
              hiddenFrom="sm"
              radius="lg"
              mt="lg"
            >
              Get Started
            </Button>
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
          flex="1"
          height="100%"
          withIndicators
          loop
          style={{ border: "5px solid #bdbdbd", borderRadius: "14px", overflow: "hidden" }}
        >
          {images.map(image => (
            <Carousel.Slide key={image.id}>
              <img
                src={`./assets/preview/${image.id}.jpeg`}
                alt={image.alt}
                loading={image.id === 1 ? "eager" : "lazy"}
                width="1440"
                height="760"
              />
            </Carousel.Slide>
          ))}
        </Carousel>
        <Flex justify="center" align="center" mt={10} gap={4}>
          <IoMdInformationCircle color="gray" />
          <Text c="dimmed" fz="sm" ta="center">
            Preview images are from the premium version
          </Text>
        </Flex>
      </StyledCarouselWrapper>

      <Paper
        pt={rem(300)}
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

          <Title
            c="dark"
            order={2}
            fz={{ sm: 36, md: 48 }}
            fw={600}
            mt={50}
            style={{ textAlign: "center" }}
          >
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
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdCompare size={28} />
                </ThemeIcon>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
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
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdRebaseEdit size={28} />
                </ThemeIcon>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
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
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdSearch size={28} />
                </ThemeIcon>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
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
                  variant="outline"
                  size="xl"
                  radius="md"
                  visibleFrom="md"
                  mb="md"
                >
                  <MdExtension size={28} />
                </ThemeIcon>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
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
                      c="indigo"
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
                      c="cyan"
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
                      c="grape"
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
                      c="red"
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

      <Container id="faq" component="section">
        <Title c="black" order={2} fz={36} fw={600} mt={100} style={{ textAlign: "center" }}>
          Frequently Asked Questions
        </Title>
        <Accordion bg="white" variant="contained" mt={60}>
          {FAQ.map(({ title, content }) => (
            <Accordion.Item key={title} value={title}>
              <Accordion.Control bg="white" c="dark">
                {title}
              </Accordion.Control>
              <Accordion.Panel bg="gray.1" c="dark">
                {content}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </Layout>
  );
};

export default HomePage;
