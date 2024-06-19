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
  ThemeIcon,
  Tooltip,
  Anchor,
} from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaArrowTrendDown } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { PiChats } from "react-icons/pi";
import { VscArrowRight, VscLinkExternal } from "react-icons/vsc";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";

export const PRICING = {
  MONTHLY: 6,
  ANNUAL: 5,
};

export const purchaseLinks = {
  monthly:
    "https://herowand.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?desc=0&enabled=67805",
  annual:
    "https://herowand.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?desc=0&enabled=82417",
};

const StyledPaper = styled(Paper)<{ $highlight?: boolean } & any>`
  padding: 1.5em;
  width: 350px;
  border-radius: 4px;
  border: 2px solid #e9e9e9;
  ${({ $highlight }) => $highlight && "border-top: 3px solid #28c417;"}
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const PricingCards = () => {
  const [isMonthly, setIsMonthly] = React.useState(true);

  return (
    <Stack gap="0" align="center">
      <Center my="lg">
        <SegmentedControl
          bg="gray.1"
          color="white"
          value={isMonthly ? "Monthly" : "Annual"}
          onChange={v => setIsMonthly(v === "Monthly")}
          size="md"
          data={["Monthly", "Annual"]}
          w={200}
          radius="lg"
          styles={{ label: { color: "black" } }}
        />
      </Center>
      <Flex
        gap="0"
        wrap="wrap"
        justify="center"
        w="fit-content"
        p={{
          xs: 4,
          md: 6,
        }}
        mx="auto"
      >
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fw={500} size="xl" c="black">
                Partner
              </Text>

              <ThemeIcon variant="transparent" size={59}>
                <PiChats color="black" size={50} />
              </ThemeIcon>
              <Text fz="xs" c="gray.7">
                Contact us for custom pricing
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            color="green"
            onClick={() => gaEvent("Pricing", "click partner plan")}
            href="mailto:contact@jsoncrack.com"
            target="_blank"
            size="lg"
            radius="md"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Contact Us
          </Button>
          <Text mt="xs" fz="xs" c="dimmed">
            Integrate JSON Crack into your applications and websites.
          </Text>
          <Flex direction="column" justify="space-between">
            <List
              spacing="md"
              size="sm"
              mt="xs"
              c="black"
              center
              icon={<IoIosCheckmarkCircle color="green" size="20" />}
            >
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Integrate premium graph visualization into your own website/apps using iframe"
                  maw={350}
                  multiline
                >
                  <Text
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    JSON Crack Premium Widget
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  1 Domain / Plan
                </Text>
              </List.Item>
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Listen for events like node click, hover, center etc. Display your own UI"
                  maw={350}
                  multiline
                >
                  <Text
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    Events API
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Customize the look and feel of the editor matching with your own branding"
                  maw={350}
                  multiline
                >
                  <Text
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    Custom Theming
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  White Labeling
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  Onboarding and engineering support
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  High-priority customer support
                </Text>
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>
        <StyledPaper $highlight>
          <Flex justify="space-between">
            <Stack gap="0">
              <Flex align="center">
                <Text fw={500} size="xl" c="black">
                  Premium
                </Text>
                {!isMonthly && (
                  <Badge
                    size="lg"
                    variant="light"
                    color="#ff0000"
                    ml="sm"
                    leftSection={<FaArrowTrendDown />}
                  >
                    16%
                  </Badge>
                )}
              </Flex>

              <Flex gap="xs" align="baseline">
                <Text fz={38} fw="bold" c="black">
                  ${isMonthly ? PRICING.MONTHLY : PRICING.ANNUAL}
                </Text>
                <Text fz="md" fw={500} c="gray.6">
                  / mo
                </Text>
              </Flex>
              <Text fz="xs" c="gray.7">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            color="green"
            onClick={() => gaEvent("Pricing", "click upgrade premium")}
            href={isMonthly ? purchaseLinks.monthly : purchaseLinks.annual}
            target="_blank"
            size="lg"
            radius="md"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Get Started
          </Button>
          <Text mt="xs" fz="xs" c="dimmed">
            Designed for individuals who works with data regularly and wants to save time.
          </Text>
          <Flex direction="column" justify="space-between">
            <List
              spacing="md"
              size="sm"
              mt="xs"
              c="black"
              center
              icon={<IoCheckmarkCircle color="green" size="20" />}
            >
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Visualize up to ~4 MB or above depending on your hardware"
                  maw={350}
                  multiline
                  withArrow
                >
                  <Text
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    Large data support
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Load data 5x faster and 50% smaller graph size. Only see what matters."
                  maw={350}
                  multiline
                  withArrow
                >
                  <Text
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    Compact Graphs & High Performance
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  Compare Data Differences
                </Text>
              </List.Item>
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Edit nodes directly on the graph reflecting to the data"
                  maw={350}
                  multiline
                >
                  <Text
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    Edit Nodes
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  Built-in tabs for multiple documents
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  Store 200 documents
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  AI powered data filter
                </Text>
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fw={500} size="xl" c="black">
                Free
              </Text>
              <Text fz={38} fw="bold" c="black">
                $0
              </Text>
              <Text fz="xs" c="gray.7">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component={Link}
            href="/editor"
            prefetch={false}
            size="lg"
            radius="md"
            variant="outline"
            color="dark"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Free forever
          </Button>
          <Text mt="xs" fz="xs" c="dimmed">
            For individuals who occasionally work with data and doesn&apos;t require advanced
            features.
          </Text>
          <Flex direction="column" justify="space-between">
            <List
              spacing="md"
              size="sm"
              mt="lg"
              c="black"
              center
              icon={<IoIosCheckmarkCircle color="green" size="20" />}
            >
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Visualize up to ~300 KB depending on your hardware"
                  maw={350}
                  multiline
                  withArrow
                >
                  <Text
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    Basic data size support
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Tooltip
                  color="blue"
                  label={
                    <Flex align="center" gap="xs">
                      Open source and free to use
                      <VscLinkExternal />
                    </Flex>
                  }
                  maw={350}
                  multiline
                >
                  <Anchor
                    href="https://github.com/AykutSarac/jsoncrack.com"
                    target="_blank"
                    c="gray.7"
                    fw={600}
                    fz="sm"
                    style={{ textDecoration: "underline", textDecorationStyle: "dashed" }}
                  >
                    Open Source
                  </Anchor>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={600} fz="sm">
                  Store 25 documents
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
        <Flex pt="sm" c="dimmed" justify="center" align="center" gap={4}>
          <AiOutlineInfoCircle />
          <Text size="sm">
            Payment email must be matching with the account registered to the JSON Crack.
          </Text>
        </Flex>
      </Layout>
    </>
  );
};

export default Pricing;
