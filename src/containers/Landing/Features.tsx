import React from "react";
import { Container, Grid, Flex, rem, Title, Text, Paper } from "@mantine/core";
import { FaBolt, FaHeart, FaMagic, FaPalette, FaShapes } from "react-icons/fa";
import { FaShieldHalved } from "react-icons/fa6";

export const Features = () => {
  return (
    <Container
      pos="relative"
      component="section"
      id="features"
      px={{
        sm: rem(10),
        md: rem(80),
      }}
      w="100%"
      maw={rem(1700)}
      fluid
      my={150}
      mt={120}
    >
      <Title
        c="black"
        order={2}
        px="lg"
        fz={{
          base: 26,
          xs: 32,
          sm: 42,
        }}
        fw={600}
        mb={15}
        style={{ textAlign: "center" }}
      >
        Explore Your Data Visually
      </Title>
      <Text
        c="gray.7"
        fz={{
          sm: 14,
          md: 16,
        }}
        px="lg"
        w={{
          sm: "60%",
          md: "40%",
        }}
        mx="auto"
        ta="center"
        mb={50}
      >
        All in one tool for JSON, YAML, CSV, XML, and TOML. Formatter, validator, visualizer, and
        editor. Make smarter decisions faster.
      </Text>

      <Grid px={{ base: 0, xs: "xl", md: 0 }} mt={100} mx="auto" gutter={30}>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <FaBolt color="orange" size={24} />
              <Text c="gray.9" fz={{ base: 16, md: 18, lg: 24, xl: 26 }} fw={500}>
                Real-time Visualization
              </Text>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 14,
                xs: 16,
              }}
            >
              Transform into graphs as you type. Update your data from the graphs directly.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <FaHeart color="#ff5555" size={26} />
              <Text c="gray.9" fz={{ base: 16, md: 18, lg: 24, xl: 26 }} fw={500}>
                Simple
              </Text>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 14,
                xs: 16,
              }}
            >
              Designed for everyone. Clean, focused, and easy to use. No learning curve.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }} visibleFrom="xs">
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <FaMagic color="#8c0075" size={24} />
              <Text c="gray.9" fz={{ base: 16, md: 18, lg: 24, xl: 26 }} fw={500}>
                Generate
              </Text>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 14,
                xs: 16,
              }}
            >
              Generate JSON Schema and mock data, TypeScript interfaces, Golang structs, and more
              from your data with a single click.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <FaPalette color="#4890fd" size={24} />
              <Text c="gray.9" fz={{ base: 16, md: 18, lg: 24, xl: 26 }} fw={500}>
                Customizable
              </Text>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 14,
                xs: 16,
              }}
            >
              Besides the default light and dark themes, customize the editor&apos;s theme to your
              liking, matching your brand or personal preference.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <FaShieldHalved color="black" size={24} />
              <Text c="gray.9" fz={{ base: 16, md: 18, lg: 24, xl: 26 }} fw={500}>
                Privacy First
              </Text>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 14,
                xs: 16,
              }}
            >
              JSON Crack does not store your data unless you upload it manually. Your data remains
              completely private.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }} visibleFrom="xs">
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <FaShapes color="#00a571" size={24} />
              <Text c="gray.9" fz={{ base: 16, md: 18, lg: 24, xl: 26 }} fw={500}>
                Advanced Features
              </Text>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 14,
                xs: 16,
              }}
            >
              Unlock advanced features like JSON Path, AI data filter, Compare Data, Search on
              graph, Download as Image and many more!
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
