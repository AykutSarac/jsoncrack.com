import React from "react";
import { Title, Overlay, Paper, rem, Grid, Flex, Image, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import styled from "styled-components";
import { ReactCompareSlider } from "react-compare-slider";
import { FaBolt, FaExpand, FaLifeRing, FaParachuteBox, FaShapes } from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";
import { images } from "src/constants/landing";

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
  return (
    <section id="premium">
      <Title
        c="black"
        order={2}
        fz={{
          sm: 32,
          md: 42,
        }}
        fw={600}
        mb={80}
        ta="center"
      >
        Premium vs Free
      </Title>

      <StyledImageWrapper>
        <ReactCompareSlider
          style={{
            border: "1px solid #d5d5d5",
            borderRadius: 12,
          }}
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
        px={{
          sm: rem(10),
          md: rem(80),
        }}
        pb={rem(20)}
        maw={{
          xs: "95%",
        }}
        radius="xl"
        mx="auto"
        mt="-16.5rem"
        style={{
          textAlign: "center",
          background: "linear-gradient(rgb(255, 255, 255) 0%, rgb(7, 5, 90) 60%)",
        }}
      >
        <Title
          c="white"
          order={2}
          fz={{
            sm: 32,
            md: 42,
          }}
          fw={700}
          mb="md"
        >
          Optimized for user experience
        </Title>
        <Text
          mx="auto"
          fz={{
            sm: 12,
            md: 16,
          }}
          maw="80%"
          c="gray.4"
          mb={60}
        >
          Designed to help you navigate through your data with ease. The editor provides a clean and
          intuitive interface that allows you to focus on what matters most: your data.
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
            speed; currently supporting up to 4MB of data.
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

      <Paper w="95%" mt={100} mx="auto" radius="md" style={{ overflow: "hidden" }} visibleFrom="xs">
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
  );
};
