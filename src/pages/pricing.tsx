import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Flex,
  Stack,
  Button,
  List,
  Text,
  Paper,
  SegmentedControl,
  Center,
  Badge,
  Anchor,
} from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { VscArrowRight } from "react-icons/vsc";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";
import useUser from "src/store/useUser";

const purchaseLinks = {
  monthly:
    "https://herowand.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?enabled=67805",
  annual:
    "https://herowand.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?enabled=82417",
};

const StyledPaperFree = styled(Paper)`
  padding: 1.5em;
  width: 400px;
  border-radius: 1em;
  border: 3px solid #e9e9e9;
  background: white;
  box-shadow:
    12.5px 12.5px 10px rgba(0, 0, 0, 0.005),
    100px 100px 80px rgba(0, 0, 0, 0.01);
`;

const StyledPaper = styled(Paper)`
  padding: 1.5em;
  width: 400px;
  border-radius: 1em;
  border: 3px solid #424242;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const PricingCards = () => {
  const email = useUser(state => state.user?.email);
  const [isMonthly, setIsMonthly] = React.useState(true);

  const paymentURL = (url: string) => {
    if (email) url += `?checkout[email]=${email}`;
    return url;
  };

  return (
    <Stack component="section" id="pricing" gap="0" align="center">
      <Center my="lg">
        <SegmentedControl
          bg="gray.1"
          color="white"
          value={isMonthly ? "Monthly" : "Yearly"}
          onChange={v => setIsMonthly(v === "Monthly")}
          size="md"
          data={["Monthly", "Yearly"]}
          w={200}
          radius="lg"
          styles={{ label: { color: "black" } }}
        />
      </Center>
      <Flex gap="lg" wrap="wrap" justify="center" w="fit-content" p="lg" mx="auto" maw="100%">
        <StyledPaperFree>
          <Flex justify="space-between">
            <Stack gap="0">
              <Badge mb="lg" size="lg" variant="outline" color="gray.3" c="dark">
                Free
              </Badge>

              <Flex gap="xs" align="baseline">
                <Text fz={32} fw="bold" c="dark">
                  $0
                </Text>
                <Text fz="sm" fw={500} c="gray.8">
                  / month
                </Text>
              </Flex>
              <Text fz="xs" c="gray.7">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component={Link}
            prefetch={false}
            href="/editor"
            size="lg"
            radius="md"
            variant="outline"
            color="dark"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Start for Free
          </Button>
          <Flex direction="column" justify="space-between">
            <List spacing="xs" size="sm" mt="lg" c="black" center icon="✦">
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Graph/Tree visualizations
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Basic data size support
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Download as Image
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Generate types
                </Text>
                <Text c="dimmed" fz="xs">
                  TypeScript, Go, Rust, JSON Schema and more...
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Multiple format support
                </Text>
                <Text c="dimmed" fz="xs">
                  JSON, YAML, TOML, XML, CSV, and more...
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Store 25 documents
                </Text>
              </List.Item>
            </List>
          </Flex>
        </StyledPaperFree>
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Badge mb="lg" size="lg" variant="outline" color="gray.3" c="dark" leftSection="✦">
                Premium
              </Badge>

              <Flex gap="xs" align="baseline">
                <Text fz={32} fw="bold" c="dark">
                  ${isMonthly ? "6" : "5"}
                </Text>
                <Text fz="sm" fw={500} c="gray.8">
                  / month
                </Text>
              </Flex>
              <Text fz="xs" c="gray.7">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
            <Anchor c="dark" fz="sm" component={Link} h="fit-content" href="/#preview">
              Preview
            </Anchor>
          </Flex>
          <Button
            component="a"
            onClick={() => gaEvent("Pricing", "click upgrade premium")}
            href={paymentURL(isMonthly ? purchaseLinks.monthly : purchaseLinks.annual)}
            target="_blank"
            size="lg"
            radius="md"
            color="dark"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Start Free Trial
          </Button>
          <Text mt="xs" fz="xs" c="dimmed">
            Designed for individuals who works with data regularly.
          </Text>
          <Flex direction="column" justify="space-between">
            <List spacing="xs" size="sm" mt="xs" c="black" center icon="✦">
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Larger data support
                </Text>
                <Text c="dimmed" fz="xs">
                  (Up to ~4 MB)
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Compact graph visualizations & faster rendering
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Compare data differences
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  AI powered data filter
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Edit data directly on visualizations
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Built-in tabs for multiple documents
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Store 200 documents
                </Text>
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>
      </Flex>
    </Stack>
  );
};

const Pricing = () => {
  return (
    <>
      <Head>
        <title>Pricing - JSON Crack</title>
      </Head>
      <Layout>
        <PricingCards />
        <Text pt="sm" size="sm" c="dimmed" style={{ textAlign: "center" }}>
          <AiOutlineInfoCircle style={{ marginRight: "4px" }} />
          Payment email must be matching with the account registered to the JSON Crack.
        </Text>
      </Layout>
    </>
  );
};

export default Pricing;
