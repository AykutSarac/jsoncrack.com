import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import {
  Accordion,
  Badge,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  List,
  Paper,
  Stack,
  Title,
  Text,
  Image,
  rem,
  Anchor,
  Overlay,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import styled from "styled-components";
import { ReactCompareSlider } from "react-compare-slider";
import {
  FaBolt,
  FaExpand,
  FaLifeRing,
  FaParachuteBox,
  FaShapes,
  FaShieldHalved,
} from "react-icons/fa6";
import { MdChevronRight } from "react-icons/md";
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
  padding: 4em 10%;
  overflow: hidden;
  backdrop-filter: blur(1.2px);
  -webkit-backdrop-filter: blur(1.2px);
  text-align: center;
  gap: 60px;
  min-height: 60vh;

  @media only screen and (max-width: 768px) {
    padding: 3em 16px;
  }
`;

const StyledHeroText = styled.p`
  font-size: 0.8rem;
  color: #898989;
  font-weight: 500;
  max-width: 100%;
  min-width: 400px;
  text-align: center;

  @media only screen and (min-width: 576px) {
    font-size: 1.2rem;
    max-width: 80%;
  }

  @media only screen and (min-width: 1400px) {
    font-size: 1.25rem;
    max-width: 60%;
  }
`;

const StyledHeroTitle = styled.h1`
  position: relative;
  font-size: 1.8rem;
  font-weight: 900;
  display: inline;
  color: #272727;
  width: fit-content;
  letter-spacing: -1px;
  line-height: 1.2;

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
    letter-spacing: -2px;
  }

  @media only screen and (min-width: 992px) {
    letter-spacing: -4px;
    font-size: 4rem;
  }

  @media only screen and (min-width: 1400px) {
    max-width: 75%;
    letter-spacing: -4px;
    font-size: 4rem;
  }
`;

const StyledImageWrapper = styled.div`
  max-width: 85%;
  margin: 0 auto;
  filter: drop-shadow(0px -4px 10px rgba(70, 70, 70, 0.25));

  @media only screen and (max-width: 768px) {
    max-width: 85%;
    margin: 0 auto;
  }
`;

const StyledPaper = styled.div`
  position: relative;
  z-index: 1;

  &:before {
    position: absolute;
    z-index: -1;
    opacity: 0.4;
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

const FAQ = [
  {
    title: "What is JSON Crack?",
    content:
      "JSON Crack is a data visualization app capable of visualizing data formats such as JSON, YAML, XML, CSV and more, into interactive graphs. It helps you to understand, analyze and debug your data easily. JSON Crack is designed for developers, data analysts, and anyone who works with structured data formats. It's also helpful for creating documentation and presentations for your teams/customers.",
  },
  {
    title: "Who is it for and what are the use-cases?",
    content:
      "JSON Crack is for developers, data analysts, and anyone who works with data. It's useful for visualizing data structures, debugging, and understanding complex data. It's also helpful for creating documentation and presentations for your teams/customers.",
  },
  {
    title: "Do you see my data pasted on the editor?",
    content:
      "No, JSON Crack does not store your data anywhere unless you upload it manually. When you paste your data into the editor, it's processed on your device only to create the visualization. Your data remains completely private.",
  },
  {
    title: "What are the advantages of the premium plan?",
    content: (
      <>
        The key features are:
        <List mt="lg">
          <List.Item>Expanded support for larger datasets</List.Item>
          <List.Item>Compare data on graphs</List.Item>
          <List.Item>Compact visualization style: see only what you need to</List.Item>
          <List.Item>Searching is faster and smoother</List.Item>
          <List.Item>Ask AI to filter your data</List.Item>
          <List.Item>Direct data editing on the graphs & tree view</List.Item>
        </List>
        <Text mt="sm" inherit>
          You may visit the <Anchor href="#pricing">pricing page</Anchor> for more details.
        </Text>
      </>
    ),
  },
];

export const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>JSON Crack | Best JSON Viewer, Formatter and Visualizer for everyone</title>
        <meta name="description" content={metaDescription} key="description" />
        <meta property="og:description" content={metaDescription} key="ogdescription" />
        <meta name="twitter:description" content={metaDescription} key="twdescription" />
      </Head>
      <StyledHeroSection id="hero-section">
        <StyledHeroSectionBody>
          <Stack flex="1" miw={250} mx="auto" align="center">
            <StyledHeroTitle>Data into Clarity with Powerful Visualization</StyledHeroTitle>
            <StyledHeroText>Transform data into interactive graphs.</StyledHeroText>
            <Flex gap="xs">
              <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
                JSON
              </Badge>
              <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
                YAML
              </Badge>
              <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
                CSV
              </Badge>
              <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
                XML
              </Badge>
              <Badge size="xs" color="gray.7" autoContrast radius="sm" variant="light">
                TOML
              </Badge>
            </Flex>
            <Flex gap="md" mt="lg">
              <Button
                onClick={() => gaEvent("Hero Section", "click upgrade premium")}
                component={Link}
                variant="gradient"
                style={{ border: "1px solid #625BF6" }}
                href="/#pricing"
                size="lg"
                visibleFrom="sm"
                radius="lg"
                rightSection={<MdChevronRight size={30} />}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                href="/#pricing"
                size="md"
                variant="gradient"
                style={{ border: "1px solid #625BF6" }}
                rightSection={<MdChevronRight size={24} />}
                hiddenFrom="sm"
                radius="lg"
              >
                Get Started
              </Button>
            </Flex>
          </Stack>
        </StyledHeroSectionBody>
      </StyledHeroSection>

      <StyledImageWrapper id="preview">
        <Image
          loading="eager"
          src="./assets/compare/free.webp"
          alt="JSON Crack Preview"
          w="100%"
          h="100%"
          radius="md"
        />
      </StyledImageWrapper>

      <section id="features">
        <Title
          c="black"
          order={2}
          px="lg"
          fz={{
            sm: 32,
            md: 42,
          }}
          fw={600}
          mt={120}
          mb={15}
          style={{ textAlign: "center" }}
        >
          An intuitive and user-friendly interface
        </Title>
        <Text
          c="gray.6"
          fz={{
            sm: 12,
            md: 16,
          }}
          px="lg"
          w={{
            sm: "80%",
            md: "60%",
          }}
          mx="auto"
          ta="center"
          mb={50}
        >
          Enhance your workflow with JSON Crack, the ultimate JSON editor! Effortless formatting,
          robust validation, and intuitive visualizations in one platform. Make smarter decisions
          faster.
        </Text>

        <Grid w="80%" gutter={24} mt={50} mb={150} mx="auto">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Paper
              pos="relative"
              p={30}
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              withBorder
              style={{ overflow: "hidden" }}
            >
              <StyledPaper>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Graphs
                </Title>
                <Text fz={{ sm: 14, md: 18 }} c="dark.5" mt={10}>
                  Visualize your data in a graph format to understand and analyze it better.
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
              p={30}
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              withBorder
              style={{ overflow: "hidden" }}
            >
              <StyledPaper>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Generate Types
                </Title>
                <Text fz={{ sm: 14, md: 18 }} c="dark.5" my={10}>
                  Generate types for your data with a single click: TypeScript, Go, Rust & more.
                </Text>
                <Paper
                  withBorder
                  shadow="sm"
                  radius={5}
                  w="fit-content"
                  mx="auto"
                  style={{ borderColor: "gray" }}
                >
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
              p={30}
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              withBorder
              style={{ overflow: "hidden" }}
            >
              <StyledPaper>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Search
                </Title>
                <Text fz={{ sm: 14, md: 18 }} c="dark.5" mt={10}>
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
              p={30}
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              withBorder
              style={{ overflow: "hidden" }}
            >
              <StyledPaper>
                <Title c="black" order={3} fw={500} fz={{ sm: 20, md: 28 }}>
                  Choose Your Format
                </Title>
                <Text fz={{ sm: 14, md: 18 }} c="dark.5" mt={10}>
                  Visualize and edit your data in multiple formats. JSON, YAML, CSV, XML, and TOML
                  are supported.
                </Text>
                <Grid gutter="lg" mt={50}>
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

      <Divider w="80%" my={100} mx="auto" />

      <section id="premium">
        <Title c="black" order={2} fz={42} fw={600} mb={80} ta="center">
          Premium vs Free
        </Title>

        <StyledImageWrapper>
          <ReactCompareSlider
            itemOne={<Image loading="lazy" src="./assets/compare/pro.webp" alt="Pro" />}
            itemTwo={
              <>
                <Overlay color="#000" backgroundOpacity={0.1} />
                <Image loading="lazy" src="./assets/compare/free.webp" alt="Free" />
              </>
            }
          />
        </StyledImageWrapper>

        <Paper
          pt={rem(300)}
          px={rem(80)}
          pb={rem(20)}
          maw="95%"
          radius="xl"
          mx="auto"
          mt="-16.5rem"
          style={{
            textAlign: "center",
            background: "linear-gradient(rgb(255, 255, 255) 0%, rgb(7, 5, 90) 60%)",
          }}
          visibleFrom="sm"
        >
          <Title c="white" order={2} fz={42} fw={700} mb="md">
            Optimized for user experience
          </Title>
          <Text mx="auto" fz={16} maw="80%" c="gray.4" mb={60}>
            Designed to help you navigate through your data with ease. The editor provides a clean
            and intuitive interface that allows you to focus on what matters most: your data.
          </Text>
        </Paper>

        <Grid
          w={{ sm: "100%", md: "80%" }}
          px={{ sm: "xl", md: 0 }}
          mt={100}
          mx="auto"
          gutter={50}
          visibleFrom="sm"
        >
          <Grid.Col span={4}>
            <Flex align="center" gap={8} mb={16}>
              <FaBolt color="orange" size={28} />
              <Title c="black" order={3} fz={{ sm: 20, md: 28 }} fw={600}>
                High Performance
              </Title>
            </Flex>
            <Text c="gray.6" fz={{ sm: 12, md: 14 }}>
              Designed to handle large datasets with ease. It&apos;s optimized for performance and
              speed currently supporting up to 4MB of data.
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex align="center" gap={8} mb={16}>
              <FaExpand color="blue" size={28} />
              <Title c="black" order={3} fz={{ sm: 20, md: 28 }} fw={600}>
                Clean & Focused
              </Title>
            </Flex>
            <Text c="gray.6" fz={{ sm: 12, md: 14 }}>
              Compared to the free version, the premium version creates 50% less nodes on the graph
              and helps you to focus on what matters most.
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex align="center" gap={8} mb={16}>
              <FaLifeRing color="#FF6B00" size={28} />
              <Title c="black" order={3} fz={{ sm: 20, md: 28 }} fw={600}>
                Quick Support
              </Title>
            </Flex>
            <Text c="gray.6" fz={{ sm: 12, md: 14 }}>
              Get quick support from our team. We&apos;re here to help you with any issues or
              questions you may have. Usual response time is within 24 hours.
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex align="center" gap={8} mb={16}>
              <FaParachuteBox color="#00848C" size={28} />
              <Title c="black" order={3} fz={{ sm: 20, md: 28 }} fw={600}>
                Always Improving
              </Title>
            </Flex>
            <Text c="gray.6" fz={{ sm: 12, md: 14 }}>
              Have an idea? We&apos;re always looking to improve JSON Crack. We take your feedback
              seriously and are constantly working on new features.
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex align="center" gap={8} mb={16}>
              <FaShapes color="#A854A5" size={28} />
              <Title c="black" order={3} fz={{ sm: 20, md: 28 }} fw={600}>
                Advanced Features
              </Title>
            </Flex>
            <Text c="gray.6" fz={{ sm: 12, md: 14 }}>
              Unlock advanced features such as data comparison, direct editing on the graph,
              customized themes and compact visualization style.
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex align="center" gap={8} mb={16}>
              <FaShieldHalved color="black" size={28} />
              <Title c="black" order={3} fz={{ sm: 20, md: 28 }} fw={600}>
                Privacy First
              </Title>
            </Flex>
            <Text c="gray.6" fz={{ sm: 12, md: 14 }}>
              JSON Crack does not store your data unless you upload it manually. Your data remains
              completely private.
            </Text>
          </Grid.Col>
        </Grid>

        <Paper w="95%" mt={100} mx="auto" radius="md" style={{ overflow: "hidden" }}>
          <Carousel slideGap="md" slideSize="50%" height="100%" loop>
            {images.map(image => (
              <Carousel.Slide key={image.id}>
                <Image
                  src={`./assets/preview/${image.id}.jpeg`}
                  alt={image.alt}
                  loading="lazy"
                  radius="md"
                  style={{
                    border: "1px solid #d5d5d5",
                  }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Paper>
      </section>

      <section id="pricing">
        <Title c="black" order={2} fz={42} fw={600} mt={150} mb={15} ta="center">
          Pricing
        </Title>
        <PricingCards />
      </section>

      <Container id="faq" component="section">
        <Title
          c="black"
          order={2}
          fz={36}
          fw={600}
          mt={150}
          mb={60}
          style={{ textAlign: "center" }}
        >
          Frequently Asked Questions
        </Title>
        <Accordion
          variant="separated"
          styles={{
            panel: {
              background: "#f9f9f9",
              color: "#1d1d1d",
            },
            label: {
              color: "#1d1d1d",
              fontWeight: 500,
            },
            item: {
              background: "#f9f9f9",
              color: "#1d1d1d",
              overflow: "hidden",
              border: "1px solid #ededed",
              borderRadius: 12,
              fontWeight: 300,
            },
          }}
        >
          {FAQ.map(({ title, content }) => (
            <Accordion.Item key={title} value={title}>
              <Accordion.Control>{title}</Accordion.Control>
              <Accordion.Panel>{content}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </Layout>
  );
};

export default HomePage;
