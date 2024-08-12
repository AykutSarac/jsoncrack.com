import React from "react";
import {
  Container,
  Flex,
  Title,
  Text,
  Paper,
  Center,
  Badge,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import { FaBolt, FaToolbox } from "react-icons/fa";
import { IoImages, IoShieldCheckmark } from "react-icons/io5";
import { MdOutlineFormatIndentIncrease, MdOutlineGeneratingTokens } from "react-icons/md";
import { TbTransformFilled } from "react-icons/tb";
import { VscJson } from "react-icons/vsc";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const features: FeatureItem[] = [
  {
    title: "Visualize",
    description:
      "Transform your data into interactive graphs or trees as you type. Supports JSON, YAML, CSV, XML, and TOML.",
    icon: <FaBolt size={20} />,
    color: "yellow",
  },
  {
    title: "Convert",
    description:
      "Convert JSON to CSV, YAML to JSON, XML to JSON, and more. Our JSON converter supports multiple formats for easy data exchange.",
    icon: <TbTransformFilled size={20} />,
    color: "orange",
  },
  {
    title: "Format & Validate",
    description:
      "Format and beautify your JSON data to make it more readable. Validate JSON, YAML, and CSV.",
    icon: <MdOutlineFormatIndentIncrease size={20} />,
    color: "green",
  },
  {
    title: "Generate Code",
    description: "Generate TypeScript interface, Golang structs and more.",
    icon: <MdOutlineGeneratingTokens size={20} />,
    color: "grape",
  },
  {
    title: "JSON Schema",
    description:
      "Generate JSON Schema, create mock data, and validate JSON Schema from various data formats like JSON, YAML, XML, and CSV.",
    icon: <VscJson size={20} />,
    color: "cyan",
  },
  {
    title: "Advanced JSON Tools",
    description: "Decode JWT, randomize data, execute jq (JSON Query), json path commands.",
    icon: <FaToolbox size={20} />,
    color: "teal.5",
  },
  {
    title: "Download & Share",
    description:
      "Export image of the graph, store your files in the cloud, and share them with others.",
    icon: <IoImages size={20} />,
    color: "blue.4",
  },
  {
    title: "Secure",
    description: "Your data is never stored on our servers. Everything happens on your device.",
    icon: <IoShieldCheckmark size={20} />,
    color: "gray",
  },
];

export const Features = () => {
  return (
    <Container component="section" id="features" fluid my={150}>
      <Container size="xl">
        <Center>
          <Badge
            fw="600"
            tt="none"
            variant="outline"
            c="gray.7"
            color="gray.3"
            bg="gray.0"
            size="lg"
          >
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

        <SimpleGrid
          cols={{
            base: 1,
            xs: 2,
            md: 4,
          }}
          spacing="xl"
        >
          {features.map((feature, index) => (
            <Paper key={index} bg="gray.1" p="lg" radius="md">
              <Flex gap="sm" align="center" justify="center" direction="column">
                <ThemeIcon radius="xl" size="xl" variant="light" color={feature.color}>
                  {feature.icon}
                </ThemeIcon>
                <Title ta="center" c="gray.9" order={3}>
                  {feature.title}
                </Title>
                <Text fz="sm" c="gray.8">
                  {feature.description}
                </Text>
              </Flex>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>
    </Container>
  );
};
