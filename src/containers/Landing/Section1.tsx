import React from "react";
import Link from "next/link";
import {
  Button,
  Container,
  Flex,
  Image,
  JsonInput,
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
  background-color: #f3f3f3;
  background-image: radial-gradient(#e0e0e0 3px, transparent 0);
  background-size: 40px 40px;
  border: 1px solid #e0e0e0;

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
    transform: translate(-80px, 10%);
    border: 1px solid #000;
    box-shadow: 0px 4px 0px 0px #000;
    background: #f3f3f3;
    --line-color-1: #e3e3e3;
    --line-color-2: #e5e5e5;
    background-image: linear-gradient(var(--line-color-1) 1.5px, transparent 1.5px),
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

  .jcode {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(80%, 80%);
    width: 273px;
    border-radius: 15px;
    border: 1px solid #000;
    box-shadow: 0px 4px 0px 0px #000;
    overflow: hidden;
  }

  @media only screen and (max-width: 1085px) {
    display: none;
  }
`;

export const Section1 = () => {
  return (
    <Container size="xl" my="120">
      <Flex justify="center" align="center">
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
          >
            Understand complex data quickly
          </Title>
          <Text my="md" c="gray.6" fz={16} maw={510}>
            The days of getting lost in lines of code are over. JSON Crack gives you the most
            optimal view of your data so you can make insights faster than ever.
          </Text>
          <List
            fz={{
              base: 16,
              xs: 18,
            }}
            fw={500}
            component={SimpleGrid}
            icon={<LuBadgeCheck size="20" />}
          >
            <SimpleGrid w="fit-content" cols={2}>
              <List.Item>Fast decision-making</List.Item>
              <List.Item>Grasp patterns and relationships faster</List.Item>
              <List.Item>Clear, concise data presentation</List.Item>
              <List.Item>Share insights with teams easier</List.Item>
            </SimpleGrid>
          </List>
          <Link href="/editor" prefetch={false}>
            <Button color="#202842" size="lg" radius="md" w="fit-content" mt="sm">
              Use for free
            </Button>
          </Link>
        </Stack>
        <StyledDottedContainer>
          <Image className="jc" src="/assets/jsoncrack.svg" alt="json crack" />
          <JsonInput
            w={273}
            rows={12}
            className="jcode"
            styles={{
              input: {
                border: "none",
                fontSize: 12,
              },
            }}
            value={JSON.stringify(
              {
                squadName: "Super hero squad",
                homeTown: "Metro City",
                formed: 2016,
                secretBase: "Super tower",
                active: true,
                members: [
                  {
                    name: "Molecule Man",
                    age: 29,
                    secretIdentity: "Dan Jukes",
                  },
                  {
                    name: "Madame Uppercut",
                    age: 39,
                    secretIdentity: "Jane Wilson",
                  },
                  {
                    name: "Eternal Flame",
                    age: 1000000,
                    secretIdentity: "Unknown",
                  },
                ],
              },
              null,
              2
            )}
          />
        </StyledDottedContainer>
      </Flex>
    </Container>
  );
};
