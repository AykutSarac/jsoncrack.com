import React from "react";
import { Text, Title, Grid, Paper, Badge, Image } from "@mantine/core";
import styled from "styled-components";

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

export const Features = () => {
  return (
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
          sm: 14,
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
                Visualize and edit your data in multiple formats. JSON, YAML, CSV, XML, and TOML are
                supported.
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
  );
};
