import React from "react";
import Head from "next/head";
import { Flex, Stack, Button, List, ThemeIcon, Divider, Text, Paper, Badge } from "@mantine/core";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsCheck, BsX } from "react-icons/bs";
import { paymentURL } from "src/constants/data";
import Layout from "src/layout/Layout";

const Pricing = () => {
  return (
    <Layout>
      <Head>
        <title>Pricing - JSON Crack</title>
      </Head>
      <Flex gap="lg" wrap="wrap" justify="center" my={60} w="fit-content" p="lg" mx="auto">
        <Paper p="xl" radius="lg" withBorder w={325}>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fz="xl" fw="bold" c="dark">
                Free
              </Text>
              <Text fz="xs" fw="bold" c="gray.6">
                Free - forever.
              </Text>
            </Stack>
          </Flex>
          <Divider my="sm" />
          <Flex direction="column" justify="space-between" h={250}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={
                <ThemeIcon color="dark.6" size={20} radius="xl">
                  <BsCheck size="1rem" />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Text c="dark" fz="sm">
                  Maximum capability
                </Text>
              </List.Item>
              <List.Item>
                <Text c="dark" fz="sm">
                  Save & share up to 15 files
                </Text>
              </List.Item>
              <List.Item>
                <Text c="dark" fz="sm">
                  Visualize all data formats
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="gray.5" size={20} radius="xl">
                    <BsX size="1rem" />
                  </ThemeIcon>
                }
              >
                <Text c="gray.6" fz="sm">
                  JSON Schema
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="gray.5" size={20} radius="xl">
                    <BsX size="1rem" />
                  </ThemeIcon>
                }
              >
                <Text c="gray.6" fz="sm">
                  Edit data through graph
                </Text>
              </List.Item>
            </List>
            <Button size="md" radius="md" color="orange" variant="outline">
              Current
            </Button>
          </Flex>
        </Paper>

        <Paper p="xl" radius="lg" bg="#301e55" withBorder w={325}>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text c="white" fz="xl" fw="bold">
                Premium
              </Text>
              <Badge size="xs" mt="auto" color="violet" opacity={0.4}>
                Annual Save 20%
              </Badge>
            </Stack>
            <Paper py={5} px="sm" bg="#442f71">
              <Stack gap="0" align="center" justify="center">
                <Text fz="lg" c="white" fw="bolder">
                  $7
                </Text>
                <Text fz="xs" c="gray.4" fw="bold">
                  Per month
                </Text>
              </Stack>
            </Paper>
          </Flex>
          <Divider my="sm" />
          <Flex direction="column" justify="space-between" h={250}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={
                <ThemeIcon color="white" size={20} radius="xl">
                  <BsCheck size="1rem" color="black" />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Text c="white" fz="sm">
                  Maximum capability
                </Text>
              </List.Item>
              <List.Item>
                <Text c="white" fz="sm">
                  Save & share up to 200 files
                </Text>
              </List.Item>
              <List.Item>
                <Text c="white" fz="sm">
                  Visualize all data formats
                </Text>
              </List.Item>
              <List.Item>
                <Text c="white" fz="sm">
                  JSON Schema
                </Text>
              </List.Item>
              <List.Item>
                <Text c="white" fz="sm">
                  Edit data through graph
                </Text>
              </List.Item>
            </List>
            <Button
              component="a"
              href={paymentURL()}
              target="_blank"
              size="md"
              radius="md"
              color="orange"
            >
              Upgrade
            </Button>
          </Flex>
        </Paper>

        <Paper p="xl" radius="lg" withBorder w={325}>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fz="xl" fw="bold" c="dark">
                Enterprise
              </Text>
              <Text fz="xs" fw="bold" c="gray.6">
                For Teams & Organizations
              </Text>
            </Stack>
            <Paper py={5} px="sm" bg="gray.0" radius="xs">
              <Stack gap="0" align="center" justify="center">
                <Text fz="lg" fw="bolder" c="dark">
                  $120
                </Text>
                <Text fz="xs" c="gray.6" fw="bold">
                  Per month
                </Text>
              </Stack>
            </Paper>
          </Flex>
          <Divider my="sm" />
          <Flex direction="column" justify="space-between" h={250}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={
                <ThemeIcon color="dark.6" size={20} radius="xl">
                  <BsCheck size="1rem" />
                </ThemeIcon>
              }
              c="dark"
            >
              <List.Item>Everything from previous plans</List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="orange" size={20} radius="xl">
                    <BsCheck size="1rem" />
                  </ThemeIcon>
                }
                c="dark"
              >
                Unlimited premium accounts for work email
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="orange" size={20} radius="xl">
                    <BsCheck size="1rem" />
                  </ThemeIcon>
                }
                c="dark"
              >
                Shared cloud in app
              </List.Item>
            </List>
            <Button
              component="a"
              href={paymentURL()}
              target="_blank"
              size="md"
              radius="md"
              color="orange"
            >
              Upgrade
            </Button>
          </Flex>
        </Paper>
      </Flex>
      <Text size="sm" c="dimmed" style={{ textAlign: "center" }}>
        <AiOutlineInfoCircle style={{ marginRight: "4px" }} />
        Payment email must be matching with the account registered to the JSON Crack.
      </Text>
    </Layout>
  );
};

export default Pricing;
