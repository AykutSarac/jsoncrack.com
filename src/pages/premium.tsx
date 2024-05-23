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
  Overlay,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
  Anchor,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import styled from "styled-components";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { BiChevronDown } from "react-icons/bi";
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
    max-width: 70%;
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

const StyledImgComparisonSlider = styled(ImgComparisonSlider)`
  --divider-width: 2px;
  --divider-color: #515151;
  --default-handle-opacity: 0.3;
  --default-handle-color: #000;
  overflow: hidden;
`;

const StyledCarouselWrapper = styled.section`
  position: relative;
  margin: 60px auto;

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
    title: "Who is JSON Crack Premium for?",
    content:
      "We coded the Premium Editor from scratch again to fix existing bugs and support new features. JSON Crack Premium is designed for individuals who work with data regularly. The key difference between JSON Crack Premium and the free version is the ability to work with larger datasets, compare data on graphs, and edit data directly on the graphs. If you use the free plan frequently, but want to be more flexible and productive, JSON Crack Premium is for you.",
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
  {
    title: "How can I upgrade to Premium?",
    content:
      "You can upgrade to JSON Crack Premium by clicking the 'Get Started' button on this page. You will be redirected to the pricing page, where you can choose the plan that suits you best. After the payment is completed, you will be able to use JSON Crack Premium immediately.",
  },
  {
    title: "Is JSON Crack Premium worth it?",
    content:
      "JSON Crack Premium is designed to help you navigate through your data with ease. The editor provides a clean and intuitive interface that allows you to focus on what matters most: your data. JSON Crack Premium is worth it if you work with data regularly and want to save time and effort.",
  },
  {
    title: "Can I cancel my subscription?",
    content:
      "Yes, you can cancel your subscription at any time. If you cancel your subscription, you will still have access to JSON Crack Premium until the end of your billing period. After that, you will be downgraded to the free version of JSON Crack.",
  },
  {
    title: "Can I use JSON Crack Premium on multiple devices?",
    content:
      "Yes, you can use JSON Crack Premium on multiple devices. Your subscription is tied to your account, not a specific device. You can log in to your account on any device and access JSON Crack Premium.",
  },
  {
    title: "Can I share my subscription with others?",
    content:
      "No, your JSON Crack Premium subscription is intended for personal use only. Account sharing is strongly discouraged. If you need multiple licenses for your team or organization, please contact us for more information.",
  },
];

export const Premium = () => {
  const [card1, bg1] = useBackgroundCursorPosition("#fff7f7", "#ffecec", "300px");
  const [card2, bg2] = useBackgroundCursorPosition("#f7fff7", "#ecffec", "300px");
  const [card3, bg3] = useBackgroundCursorPosition("#fff7fe", "#ffecf7", "300px");
  const [card4, bg4] = useBackgroundCursorPosition("#f5fbff", "#e9f3ff", "300px");

  return (
    <Layout>
      <Head>
        <title>JSON Crack Premium | Data into Clarity with Powerful Visualization</title>
        <meta name="description" content={metaDescription} key="description" />
        <meta property="og:description" content={metaDescription} key="ogdescription" />
        <meta name="twitter:description" content={metaDescription} key="twdescription" />
      </Head>
      <StyledHeroSection id="hero-section">
        <StyledHeroSectionBody>
          <Stack flex="1" miw={250} mx="auto" align="center">
            <StyledHeroTitle>Free vs Premium</StyledHeroTitle>
            <StyledHeroText>Designed for individuals who work with data regularly.</StyledHeroText>
            <Flex gap="xs">
              <Badge size="sm" color="gray.7" autoContrast radius="sm" variant="light">
                ~4 MB Data Support
              </Badge>
              <Badge size="sm" color="gray.7" autoContrast radius="sm" variant="light">
                4X Faster
              </Badge>
              <Badge size="sm" color="gray.7" autoContrast radius="sm" variant="light">
                50% Less Size
              </Badge>
              <Badge size="sm" color="gray.7" autoContrast radius="sm" variant="light">
                Compare
              </Badge>
              <Badge size="sm" color="gray.7" autoContrast radius="sm" variant="light">
                Edit
              </Badge>
            </Flex>
            <Flex gap="md" mt="lg">
              <Button
                onClick={() => gaEvent("Hero Section", "click upgrade premium")}
                component="a"
                variant="gradient"
                style={{ border: "1px solid #625BF6" }}
                href="#pricing"
                size="lg"
                visibleFrom="sm"
                radius="lg"
                rightSection={<MdChevronRight size={30} />}
              >
                Get started
              </Button>
              <Button
                component={Link}
                href="#pricing"
                size="md"
                variant="gradient"
                style={{ border: "1px solid #625BF6" }}
                rightSection={<MdChevronRight size={24} />}
                hiddenFrom="sm"
                radius="lg"
              >
                Get started
              </Button>
            </Flex>
          </Stack>
        </StyledHeroSectionBody>
      </StyledHeroSection>

      <Paper
        component="section"
        id="preview"
        mx="auto"
        bg="transparent"
        my="lg"
        w="fit-content"
        visibleFrom="sm"
        maw="80%"
      >
        <StyledImgComparisonSlider
          hover
          style={{
            border: "1px solid #999999",
            overflow: "hidden",
            borderRadius: 12,
          }}
        >
          <Overlay slot="first" backgroundOpacity={0.15} />
          <Image
            slot="first"
            width={600}
            src="./assets/compare/free.webp"
            loading="lazy"
            alt="Free Editor"
          />
          <Image
            slot="second"
            width={600}
            src="./assets/compare/pro.webp"
            loading="lazy"
            alt="Premium Editor"
          />
        </StyledImgComparisonSlider>
      </Paper>

      <Paper
        pt={rem(300)}
        px={rem(80)}
        pb={rem(20)}
        maw="95%"
        radius="xl"
        mx="auto"
        mt="-17.5rem"
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
          Designed to help you navigate through your data with ease. The editor provides a clean and
          intuitive interface that allows you to focus on what matters most: your data.
        </Text>
      </Paper>

      <StyledCarouselWrapper id="preview">
        <Carousel
          controlsOffset={80}
          slidesToScroll={1}
          slideGap="md"
          slideSize="50%"
          flex="1"
          height="100%"
          loop
        >
          {images.map(image => (
            <Carousel.Slide key={image.id}>
              <Image
                src={`./assets/preview/${image.id}.jpeg`}
                alt={image.alt}
                loading={image.id === 1 ? "eager" : "lazy"}
                width="1440"
                height="760"
                radius="md"
                style={{
                  border: "1px solid #999999",
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </StyledCarouselWrapper>

      <section id="features">
        <Stack mt={100} align="center" px="lg" mx="auto" maw={{ sm: "80%", md: "65%" }}>
          <ThemeIcon variant="transparent" color="dark" mx="auto" size="xl">
            <BiChevronDown size={40} />
          </ThemeIcon>

          <Title
            c="black"
            lts={-1}
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
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                border: "1px solid #ffc1c1",
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
                <Text fz={{ sm: 14, md: 18 }} c="dark.5" mt={10}>
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
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                border: "1px solid #bfffb5",
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
                <Text fz={{ sm: 14, md: 18 }} c="dark.5" my={10}>
                  Directly modify your data through the graphs, without wasting time on manual
                  editing.
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
              ref={card3 as React.RefObject<HTMLDivElement>}
              p={30}
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                border: "1px solid #dbb5ff",
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
              ref={card4 as React.RefObject<HTMLDivElement>}
              p={30}
              shadow="xs"
              radius="md"
              w="100%"
              h={{ sm: 300, md: 370 }}
              style={{
                border: "1px solid #b5f0ff",
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
                <Text fz={{ sm: 14, md: 18 }} c="dark.5" mt={10}>
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

export default Premium;
