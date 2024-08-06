import React from "react";
import {
  Container,
  Grid,
  Flex,
  rem,
  Title,
  Text,
  Paper,
  Center,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import { FaBolt, FaMagic, FaToolbox } from "react-icons/fa";
import { GrSearchAdvanced } from "react-icons/gr";
import { MdOutlineGeneratingTokens } from "react-icons/md";
import { TbTransformFilled } from "react-icons/tb";

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
      <Center>
        <Badge variant="light" color="orange">
          Features
        </Badge>
      </Center>
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
        editor.
      </Text>

      <Grid
        px={{ base: 0, xs: "xs", sm: "xl", md: 0 }}
        mt={100}
        mx="auto"
        gutter={{
          base: 20,
          sm: 30,
        }}
      >
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <ThemeIcon color="yellow" variant="light" size="lg" radius="md">
                <FaBolt size={20} />
              </ThemeIcon>
              <Title order={3} c="gray.9" fz={{ base: 16, md: 16, lg: 22, xl: 24 }} fw={500}>
                Visualize Your JSON Data
              </Title>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 12,
                xs: 14,
              }}
              lh={1.7}
            >
              Transform complex JSON data into intuitive graphs and trees with JSON Crack&apos;s
              powerful visualizer. Easily understand data relationships, identify patterns, and
              debug issues. Our JSON graph and tree views provide unparalleled clarity for your JSON
              data.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <ThemeIcon color="orange" variant="light" size="lg" radius="md">
                <TbTransformFilled size={20} />
              </ThemeIcon>
              <Title order={3} c="gray.9" fz={{ base: 16, md: 16, lg: 22, xl: 24 }} fw={500}>
                Convert and Transform
              </Title>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 12,
                xs: 14,
              }}
              lh={1.7}
            >
              Seamlessly convert JSON to YAML, CSV, and other formats. Transform your data with our
              flexible tools, including JSON path, JSON query (jq), and JSON schema. Edit data
              directly within the graph or tree view for ultimate control.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }} visibleFrom="xs">
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <ThemeIcon color="green" variant="light" size="lg" radius="md">
                <FaMagic size={20} />
              </ThemeIcon>
              <Title order={3} c="gray.9" fz={{ base: 16, md: 16, lg: 22, xl: 24 }} fw={500}>
                Validate, Format, and Beautify
              </Title>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 12,
                xs: 14,
              }}
              lh={1.7}
            >
              Ensure data accuracy with our robust JSON validator. Format and beautify your JSON
              code for improved readability. Our JSON formatter and beautifier make your code
              cleaner and easier to maintain.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <ThemeIcon color="grape" variant="light" size="lg" radius="md">
                <MdOutlineGeneratingTokens size={24} />
              </ThemeIcon>
              <Title order={3} c="gray.9" fz={{ base: 16, md: 16, lg: 22, xl: 24 }} fw={500}>
                Generate Code and Schemas
              </Title>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 12,
                xs: 14,
              }}
              lh={1.7}
            >
              Generate code snippets, including TypeScript, Golang, and more, directly from your
              JSON data. Create JSON Schemas to define and validate your data structures.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }}>
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <ThemeIcon color="indigo" variant="light" size="lg" radius="md">
                <FaToolbox size={24} />
              </ThemeIcon>
              <Title order={3} c="gray.9" fz={{ base: 16, md: 16, lg: 22, xl: 24 }} fw={500}>
                Advanced JSON Tools
              </Title>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 12,
                xs: 14,
              }}
              lh={1.7}
            >
              Explore additional features like JWT decoding, data comparison, AI-powered filtering,
              and custom themes. Download your visualized data as an image for sharing or
              documentation.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6, md: 4 }} visibleFrom="xs">
          <Paper h="100%" p="lg" radius="md" bg="gray.0" withBorder>
            <Flex align="center" gap={8} mb={16}>
              <ThemeIcon color="lime" variant="light" size="lg" radius="md">
                <GrSearchAdvanced size={24} />
              </ThemeIcon>
              <Title order={3} c="gray.9" fz={{ base: 16, md: 16, lg: 22, xl: 24 }} fw={500}>
                Edit, Search, and Analyze
              </Title>
            </Flex>
            <Text
              c="gray.7"
              fz={{
                base: 12,
                xs: 14,
              }}
              lh={1.7}
            >
              Edit your JSON data directly within the graph or tree view. Search through your data
              effortlessly using our advanced search functionality. Gain deeper insights with our
              powerful JSON parser and editor.
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
