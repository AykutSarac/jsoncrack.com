import React from "react";
import { Title, Overlay, Paper, rem, Grid, Flex, Image, Text, Container } from "@mantine/core";
import styled from "styled-components";
import { ReactCompareSlider, ReactCompareSliderHandle } from "react-compare-slider";
import { FaBolt, FaExpand, FaLifeRing, FaParachuteBox, FaShapes } from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";

const StyledImageWrapper = styled.div`
  max-width: 85%;
  margin: 0 auto;
  filter: drop-shadow(0px -4px 10px rgba(70, 70, 70, 0.25));

  @media only screen and (max-width: 768px) {
    max-width: 85%;
    margin: 0 auto;
  }
`;

export const PremiumVsFree = () => {
  const [labelOpacity, setLabelOpacity] = React.useState(1);
  const labelStyle = {
    fontSize: "1rem",
    position: "absolute" as any,
    padding: "6px 12px",
    margin: "0 -6px",
    color: "white",
    opacity: labelOpacity,
    borderRadius: ".25rem",
    border: "1px solid white",
    backdropFilter: "blur(0.25rem) saturate(180%) contrast(80%) brightness(120%)",
    WebkitBackdropFilter: "blur(0.25rem) saturate(180%) contrast(80%) brightness(120%)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    transition: "opacity 0.25s ease-in-out",
  };

  return (
    <Container pos="relative" component="section" id="premium" fluid my={120}>
      <Paper
        pb={rem(260)}
        px={{
          sm: rem(10),
          md: rem(80),
        }}
        pt={rem(20)}
        maw={{
          xs: "95%",
        }}
        radius="xl"
        mx="auto"
        mb="-16.5rem"
        style={{
          textAlign: "center",
          background: "linear-gradient(rgb(7, 5, 90) 40%, rgb(255, 255, 255) 90%)",
        }}
      >
        <Title
          c="white"
          order={2}
          fz={{
            base: 26,
            xs: 32,
            sm: 42,
          }}
          fw={700}
          mb="md"
        >
          Premium vs Free
        </Title>
        <Text
          mx="auto"
          fz={{
            base: 14,
            xs: 16,
          }}
          maw={{
            base: "80%",
            sm: "70%",
          }}
          c="gray.4"
          mb={60}
        >
          Designed to help you navigate through your data with ease. The editor provides a clean and
          intuitive interface that allows you to focus on what matters most: your data.
        </Text>
      </Paper>

      <StyledImageWrapper>
        <ReactCompareSlider
          onPointerDown={() => setLabelOpacity(0)}
          onPointerUp={() => setLabelOpacity(1)}
          style={{
            border: "1px solid #d5d5d5",
            borderRadius: 12,
          }}
          itemOne={<Image loading="lazy" src="./assets/preview/1.webp" alt="Pro" />}
          itemTwo={
            <>
              <Overlay color="#000" backgroundOpacity={0.1} />
              <Image loading="lazy" src="./assets/preview/free.webp" alt="Free" />
            </>
          }
          handle={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ReactCompareSliderHandle />
              <div
                style={{
                  ...labelStyle,
                  translate: "-100% 0",
                  left: 0,
                }}
              >
                Premium
              </div>
              <div
                style={{
                  ...labelStyle,
                  translate: "100% 0",
                  right: 0,
                }}
              >
                Free
              </div>
            </div>
          }
        />
      </StyledImageWrapper>

      <Grid
        w={{ sm: "100%", md: "80%" }}
        px="xl"
        mt={100}
        mx="auto"
        gutter={{ base: 30, xs: 30, sm: 50 }}
      >
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Flex align="center" gap={8} mb={16}>
            <FaBolt color="orange" size={28} />
            <Text c="gray.8" fz={{ base: 16, md: 20, lg: 26, xl: 28 }} fw={600}>
              High Performance
            </Text>
          </Flex>
          <Text c="gray.6" fz={14}>
            Designed to handle large datasets with ease. It&apos;s optimized for performance and
            speed; currently supporting up to 4MB of data.
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Flex align="center" gap={8} mb={16}>
            <FaExpand color="blue" size={28} />
            <Text c="gray.8" fz={{ base: 16, md: 20, lg: 26, xl: 28 }} fw={600}>
              Clean & Focused
            </Text>
          </Flex>
          <Text c="gray.6" fz={14}>
            Compared to the free version, the premium version creates 50% less nodes on the graph
            and helps you to focus on what matters most.
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }} visibleFrom="xs">
          <Flex align="center" gap={8} mb={16}>
            <FaLifeRing color="#FF6B00" size={28} />
            <Text c="gray.8" fz={{ base: 16, md: 20, lg: 26, xl: 28 }} fw={600}>
              Quick Support
            </Text>
          </Flex>
          <Text c="gray.6" fz={14}>
            Get quick support from our team. We&apos;re here to help you with any issues or
            questions you may have. Usual response time is within 24 hours.
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }} visibleFrom="xs">
          <Flex align="center" gap={8} mb={16}>
            <FaParachuteBox color="#00848C" size={28} />
            <Text c="gray.8" fz={{ base: 16, md: 20, lg: 26, xl: 28 }} fw={600}>
              Always Improving
            </Text>
          </Flex>
          <Text c="gray.6" fz={14}>
            Have an idea? We&apos;re always looking to improve JSON Crack. We take your feedback
            seriously and are constantly working on new features.
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Flex align="center" gap={8} mb={16}>
            <FaShapes color="#A854A5" size={28} />
            <Text c="gray.8" fz={{ base: 16, md: 20, lg: 26, xl: 28 }} fw={600}>
              Advanced Features
            </Text>
          </Flex>
          <Text c="gray.6" fz={14}>
            Unlock advanced features such as data comparison, direct editing on the graph,
            customized themes and compact visualization style.
          </Text>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Flex align="center" gap={8} mb={16}>
            <FaShieldHalved color="black" size={28} />
            <Text c="gray.8" fz={{ base: 16, md: 20, lg: 26, xl: 28 }} fw={600}>
              Privacy First
            </Text>
          </Flex>
          <Text c="gray.6" fz={14}>
            JSON Crack does not store your data unless you upload it manually. Your data remains
            completely private.
          </Text>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
