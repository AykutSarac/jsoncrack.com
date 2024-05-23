import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { Accordion, Badge, Button, Container, Flex, List, Stack, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import styled from "styled-components";
import { FaGithub } from "react-icons/fa";
import { IoSparklesSharp } from "react-icons/io5";
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
  padding: 3em 10%;
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

const StyledCarouselWrapper = styled.section`
  max-width: 85%;
  position: relative;
  z-index: 1;
  margin: 60px auto;
  overflow: hidden;
  filter: drop-shadow(0px -4px 10px rgba(70, 70, 70, 0.25));

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

const FAQ = [
  {
    title: "What is JSON Crack?",
    content:
      "JSON Crack is a data visualization app capable of visualizing data formats such as JSON, YAML, XML, CSV and more, into interactive graphs. It helps you to understand, analyze and debug your data easily. JSON Crack is designed for developers, data analysts, and anyone who works with structured data formats. It's also helpful for creating documentation and presentations for your teams/customers.",
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
          <List.Item>Compare data on graphs</List.Item>
          <List.Item>Compact visualization style: see only what you need to</List.Item>
          <List.Item>Searching is faster and smoother</List.Item>
          <List.Item>Ask AI to filter your data</List.Item>
          <List.Item>Direct data editing on the graphs & tree view</List.Item>
        </List>
      </>
    ),
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
];

export const HomePage = () => {
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
            <Badge
              tt="none"
              size="xl"
              fw={500}
              color="#362EF3"
              variant="light"
              leftSection={<IoSparklesSharp />}
            >
              Transform data to graphs in 3 seconds
            </Badge>
            <StyledHeroTitle>Data into Clarity with Powerful Visualization</StyledHeroTitle>
            <StyledHeroText>
              Transform data into interactive graphs. See what you need.
            </StyledHeroText>
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
                href="/premium"
                size="lg"
                visibleFrom="sm"
                radius="lg"
                rightSection={<MdChevronRight size={30} />}
              >
                Explore Premium
              </Button>
              <Button
                component={Link}
                prefetch={false}
                variant="outline"
                color="dark.8"
                href="/editor"
                size="lg"
                visibleFrom="sm"
                radius="lg"
                leftSection={<FaGithub />}
              >
                Free Version
              </Button>
              <Button
                component={Link}
                href="/premium"
                size="md"
                variant="gradient"
                style={{ border: "1px solid #625BF6" }}
                rightSection={<MdChevronRight size={24} />}
                hiddenFrom="sm"
                radius="lg"
              >
                Explore Premium
              </Button>
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
          flex="1"
          height="100%"
          withIndicators
          loop
          style={{
            border: "3px solid #bdbdbd",
            borderRadius: "14px",
            overflow: "hidden",
          }}
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
      </StyledCarouselWrapper>

      <Title c="black" order={2} fz={42} fw={600} mt={50} mb={15} style={{ textAlign: "center" }}>
        Pricing
      </Title>
      <PricingCards />

      <Container id="faq" component="section">
        <Title
          c="black"
          order={2}
          fz={36}
          fw={600}
          mt={100}
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
