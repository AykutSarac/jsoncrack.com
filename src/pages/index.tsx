import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import {
  Badge,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  rem,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import styled from "styled-components";
import { FaGithub } from "react-icons/fa";
import { MdChevronRight, MdCompare, MdImage, MdOutlineArrowRightAlt } from "react-icons/md";
import { MdRebaseEdit, MdOutlineSearch } from "react-icons/md";
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

export const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>JSON Crack | Best JSON Visualizer, Formatter and Viewer for everyone</title>
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
                href="/pricing"
                size="xl"
                fw="bold"
                color="indigo"
                rightSection={<MdChevronRight size={30} />}
                visibleFrom="sm"
                radius="md"
              >
                Get Pro Editor
              </Button>
              <Button
                component={Link}
                href="/pricing"
                fw="bold"
                size="md"
                color="indigo"
                rightSection={<MdChevronRight size={24} />}
                hiddenFrom="sm"
                radius="md"
              >
                Get Pro Editor
              </Button>

              <Tooltip
                position="bottom"
                label="Free version has different visualization interface, performance, experience and features managed by the open-source community."
                maw={400}
                multiline
                withArrow
              >
                <Button
                  component={Link}
                  prefetch={false}
                  href="/editor"
                  size="xl"
                  fw="bold"
                  variant="outline"
                  color="gray.7"
                  leftSection={<FaGithub />}
                  visibleFrom="sm"
                  radius="md"
                >
                  <Stack gap={0}>
                    Use Free Version
                    <Text fz={12} c="gray.5">
                      (No registration needed)
                    </Text>
                  </Stack>
                </Button>
              </Tooltip>

              <Button
                component={Link}
                prefetch={false}
                href="/editor"
                fw="bold"
                size="md"
                variant="outline"
                color="gray.7"
                leftSection={<FaGithub />}
                hiddenFrom="sm"
                radius="md"
              >
                Use Free Version
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
            <img width="1440" height="760" src="./assets/preview/1.webp" alt="Preview 1" />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
              loading="lazy"
              width="1440"
              height="760"
              src="./assets/preview/2.webp"
              alt="Preview 2"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
              loading="lazy"
              width="1440"
              height="760"
              src="./assets/preview/3.webp"
              alt="Preview 3"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
              loading="lazy"
              width="1440"
              height="760"
              src="./assets/preview/4.webp"
              alt="Preview 4"
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img
              loading="lazy"
              width="1440"
              height="760"
              src="./assets/preview/5.webp"
              alt="Preview 5"
            />
          </Carousel.Slide>
        </Carousel>
      </StyledCarouselWrapper>
      <Paper
        component="section"
        id="features"
        pt={rem(280)}
        px={rem(80)}
        pb={rem(100)}
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
        <Grid justify="space-between" gutter="xl" mx="auto" style={{ textAlign: "center" }}>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Flex gap="xs" justify="center" align="center">
              <ThemeIcon variant="transparent" size="md" color="gray.4">
                <MdRebaseEdit size="24" />
              </ThemeIcon>
              <Text fz={28} c="gray.4">
                Modify
              </Text>
            </Flex>
            <Text fz={16} c="dimmed">
              Directly modify your data through the graphs, without wasting time on manual editing.
            </Text>
          </Grid.Col>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Flex gap="xs" justify="center" align="center">
              <ThemeIcon variant="transparent" size="md" color="gray.4">
                <MdOutlineSearch size="24" />
              </ThemeIcon>
              <Text fz={28} c="gray.4">
                Search
              </Text>
            </Flex>
            <Text fz={16} c="dimmed">
              Highlight and search what you need in your data, without any hassle.
            </Text>
          </Grid.Col>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Flex gap="xs" justify="center" align="center">
              <ThemeIcon variant="transparent" size="md" color="gray.4">
                <MdImage size="24" />
              </ThemeIcon>
              <Text fz={28} c="gray.4">
                Download
              </Text>
            </Flex>
            <Text fz={16} c="dimmed">
              Export as image, use at your presentations, documentations or share with your team.
            </Text>
          </Grid.Col>
          <Grid.Col span={{ sm: 6, md: 3 }}>
            <Flex gap="xs" justify="center" align="center">
              <ThemeIcon variant="transparent" size="md" color="gray.4">
                <MdCompare size="24" />
              </ThemeIcon>
              <Text fz={28} c="gray.4">
                Compare
              </Text>
            </Flex>
            <Text fz={16} c="dimmed">
              Compare and analyze your data smoothly with the interactive graphs. See the
              differences at a glance.
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>
      <Divider label="◆" color="dimmed" mt={120} mb={40} w="40%" mx="auto" />
      <PricingCards />
      <Divider color="dimmed" my={80} w="70%" mx="auto" />
      <Center>
        <Stack align="center">
          <StyledHeroText>More than an editor.</StyledHeroText>

          <Link href="/sign-up" prefetch={false}>
            <Button size="lg" color="dark" rightSection={<MdOutlineArrowRightAlt />} fullWidth>
              Start using now
            </Button>
          </Link>
        </Stack>
      </Center>
    </Layout>
  );
};

export default HomePage;
