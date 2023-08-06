import React from "react";
import Head from "next/head";
import {
  Flex,
  Stack,
  Title,
  Button,
  List,
  ThemeIcon,
  Divider,
  Badge,
  Text,
  Container,
  Center,
  Paper,
} from "@mantine/core";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { paymentURL } from "src/constants/data";
import Layout from "src/layout/Layout";

const Pricing = () => {
  return (
    <Layout>
      <Head>
        <title>JSON Crack | Pricing</title>
      </Head>
      <Container py={100}>
        <Center>
          <Stack>
            <Flex gap="lg">
              <Paper p="lg" withBorder>
                <Stack spacing="xs">
                  <Title color="dark" order={3}>
                    Free plan
                    <Text size="sm" color="dimmed">
                      (Free)
                    </Text>
                  </Title>
                  <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                      <ThemeIcon color="dark.6" size={20} radius="xl">
                        <BsCheck size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <List.Item>Store/Share up to 15 files</List.Item>
                    <List.Item>Visualize standard size data</List.Item>
                  </List>
                </Stack>
              </Paper>

              <Divider color="gray" orientation="vertical" />
              <Paper p="lg" withBorder>
                <Stack spacing="xs">
                  <Title color="dark" order={3}>
                    JSON Crack Plus
                    <Text size="sm" color="dimmed">
                      USD 5$/mo
                    </Text>
                  </Title>
                  <Button
                    component="a"
                    href={paymentURL()}
                    variant="filled"
                    color="teal"
                    size="md"
                    target="_blank"
                  >
                    Upgrade plan
                  </Button>
                  <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                      <ThemeIcon color="teal" size={20} radius="xl">
                        <BsCheck size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <List.Item>Edit directly on graph</List.Item>
                    <List.Item>JSON Schema support</List.Item>
                    <List.Item>Visualize data at full capability</List.Item>
                    <List.Item>Save & share up to 200 files</List.Item>
                  </List>
                </Stack>
              </Paper>

              <Divider color="gray" orientation="vertical" />
              <Paper p="lg" withBorder>
                <Stack spacing="xs">
                  <Title color="dark" order={3}>
                    JSON Crack Enterprise
                    <Text size="sm" color="dimmed">
                      USD 150$/mo
                    </Text>
                  </Title>
                  <Button
                    component="a"
                    href={paymentURL()}
                    variant="filled"
                    color="teal"
                    size="md"
                    target="_blank"
                  >
                    Upgrade plan
                  </Button>
                  <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                      <ThemeIcon color="teal" size={20} radius="xl">
                        <BsCheck size="1rem" />
                      </ThemeIcon>
                    }
                  >
                    <List.Item w={200}>Enable premium to all accounts with work email</List.Item>
                    <List.Item>Everything in previous tiers</List.Item>
                    <List.Item
                      icon={
                        <ThemeIcon color="dark.5" size={20} radius="xl">
                          <BsCheck size="1rem" />
                        </ThemeIcon>
                      }
                    >
                      API Access <Badge>Soon</Badge>
                    </List.Item>
                  </List>
                </Stack>
              </Paper>
            </Flex>
            <Text align="center" size="sm" color="dimmed">
              <AiOutlineInfoCircle style={{ marginRight: "4px" }} />
              Payment email must be matching with the account registered to the JSON Crack.
            </Text>
          </Stack>
        </Center>
      </Container>
    </Layout>
  );
};

export default Pricing;
