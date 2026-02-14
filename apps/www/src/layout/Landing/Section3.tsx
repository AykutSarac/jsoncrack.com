import React from "react";
import {
  Button,
  Container,
  Flex,
  Image,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import styled from "styled-components";
import { LuBadgeCheck } from "react-icons/lu";

const StyledDottedContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 300px;
  max-width: 500px;
  border-radius: 15px;
  height: 460px;

  .jc {
    position: absolute;
    top: 0;
    left: 0;
    padding: 12px;
    border-radius: 15px;
    border: 1px solid #e0e0e0;
    background: #f3f3f3;
    --line-color-1: #e3e3e3;
    --line-color-2: #e5e5e5;
    background-image:
      linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
      linear-gradient(90deg, var(--line-color-1) 1.5px, transparent 1.5px),
      linear-gradient(var(--line-color-2) 1px, transparent 1px),
      linear-gradient(90deg, var(--line-color-2) 1px, transparent 1px);
    background-position:
      -1.5px -1.5px,
      -1.5px -1.5px,
      -1px -1px,
      -1px -1px;
    background-size:
      100px 100px,
      100px 100px,
      20px 20px,
      20px 20px;
  }

  @media only screen and (max-width: 1085px) {
    display: none;
  }
`;

export const Section3 = () => {
  return (
    <Container size="xl" py="80">
      <Flex justify="center" gap="80" align="center">
        <StyledDottedContainer>
          <Image
            className="jc"
            src="/assets/bf2-image.png"
            alt="json, csv, yaml, xml"
            loading="lazy"
          />
        </StyledDottedContainer>
        <Stack maw={634}>
          <Title
            lh="1.1"
            fz={{
              base: 26,
              xs: 32,
              sm: 42,
            }}
            maw={500}
            order={2}
            c="gray.9"
          >
            Visualize and convert to multiple formats
          </Title>
          <Text my="md" c="gray.7" fz={16} maw={510}>
            JSON Crack supports formats like TOML, CSV, YAML, and XML, making it easier to visualize
            your data, no matter the type.
          </Text>
          <List
            fz={{
              base: 16,
              xs: 18,
            }}
            fw={500}
            component={SimpleGrid}
            c="gray.8"
            icon={<LuBadgeCheck size="20" />}
          >
            <SimpleGrid w="fit-content" cols={2}>
              <List.Item>JSON to CSV</List.Item>
              <List.Item>YAML to JSON</List.Item>
              <List.Item>XML to JSON</List.Item>
              <List.Item>and more...</List.Item>
            </SimpleGrid>
          </List>
          <Button
            component="a"
            href="/converter/json-to-yaml"
            color="#202842"
            size="lg"
            radius="md"
            w="fit-content"
            mt="sm"
          >
            Open Converter
          </Button>
        </Stack>
      </Flex>
    </Container>
  );
};
