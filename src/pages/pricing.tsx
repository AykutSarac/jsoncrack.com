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
  Badge, // ThemeIcon,
  Tooltip,
  Anchor,
} from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { VscArrowRight, VscLinkExternal } from "react-icons/vsc";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";

export const PRICING = {
  MONTHLY: 9,
  ANNUAL: 5,
};

export const purchaseLinks = {
  monthly:
    "https://jsoncrack.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?desc=0&enabled=67805",
  annual:
    "https://jsoncrack.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?desc=0&enabled=82417",
};

const StyledPaper = styled(Paper)<{ $highlight?: boolean } & any>`
  padding: 1.5em;
  width: 350px;
  border-radius: 4px;
  border: 2px solid #e9e9e9;
  ${({ $highlight }) => $highlight && "border: 3px solid #28c417;"}
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  ${({ $highlight }) =>
    $highlight &&
    `
  &::before {
    content: "Recommended";
    background: #28c417;
    position: absolute;
    transform: translate(-27px, -61px);
    font-weight: 500;
    color: white;
    padding: 6px 8px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }
  `}
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
          miw={300}
          data={[
            {
              label: "Monthly",
              value: "Monthly",
            },
            {
              label: (
                <Flex align="center" gap="xs">
                  Annual{" "}
                  <Badge radius="sm" variant="light" color="green">
                    {Math.round(((PRICING.MONTHLY - PRICING.ANNUAL) / PRICING.MONTHLY) * 100)}% OFF
                  </Badge>
                </Flex>
              ),
              value: "Annual",
            },
          ]}
          w={200}
          radius="md"
          styles={{ label: { color: "black" } }}
          mb="xl"
        />
      </Center>
      <Flex
        gap="6"
        wrap="wrap"
        justify="center"
        w="fit-content"
        maw="100%"
        p={{
          xs: 4,
          md: 6,
        }}
        mx="auto"
      >
        {/* <StyledPaper>
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
                  withArrow
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
                  withArrow
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
                  withArrow
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
        </StyledPaper> */}
        <StyledPaper $highlight>
          <Flex justify="space-between">
            <Stack gap="0">
              <Flex align="center">
                <Text fw={500} size="xl" c="black">
                  Premium
                </Text>
                {!isMonthly && (
                  <Badge
                    fw={500}
                    size="lg"
                    variant="light"
                    c="#41B619"
                    radius="md"
                    color="green"
                    ml="sm"
                  >
                    SAVE {Math.round(((PRICING.MONTHLY - PRICING.ANNUAL) / PRICING.MONTHLY) * 100)}%
                  </Badge>
                )}
              </Flex>

              <Flex gap="xs" align="baseline">
                <Text fz={38} fw={600} c="black">
                  ${isMonthly ? PRICING.MONTHLY : PRICING.ANNUAL}
                </Text>
                <Text fz="md" c="gray.6">
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
            color="#2ba80f"
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
            Advanced features, better performance and optimized user interface.
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
                  label="Visualize up to 4 MB of data"
                  maw={350}
                  multiline
                  withArrow
                >
                  <Text
                    c="black"
                    fw={500}
                    fz="sm"
                    style={{
                      textDecoration: "underline",
                      textDecorationStyle: "dashed",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Large data support
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Load data 5x faster and 50% smaller graph size."
                  maw={350}
                  multiline
                  withArrow
                >
                  <Text
                    c="black"
                    fw={500}
                    fz="sm"
                    style={{
                      textDecoration: "underline",
                      textDecorationStyle: "dashed",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Compact Graphs & High Performance
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Compare Data Differences
                </Text>
              </List.Item>
              <List.Item>
                <Tooltip
                  color="blue"
                  label="Click on a node at graph to update data on editor."
                  maw={350}
                  multiline
                  withArrow
                >
                  <Text
                    c="black"
                    fw={500}
                    fz="sm"
                    style={{
                      textDecoration: "underline",
                      textDecorationStyle: "dashed",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Edit Data on Graph
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Built-in tabs for multiple documents
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Store 200 documents
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  AI-powered data filter
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Customize graph colors
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
              <Text fz={38} fw={600} c="black">
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
            Go to Editor
          </Button>
          <Text mt="xs" fz="xs" c="dimmed">
            Basic version of the editor with limited features.
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
                  label="Visualize up to ~300 KB of data"
                  maw={350}
                  multiline
                  withArrow
                >
                  <Text
                    c="black"
                    fw={500}
                    fz="sm"
                    style={{
                      textDecoration: "underline",
                      textDecorationStyle: "dashed",
                      textUnderlineOffset: "2px",
                    }}
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
                  withArrow
                >
                  <Anchor
                    href="https://github.com/AykutSarac/jsoncrack.com"
                    target="_blank"
                    c="black"
                    fw={500}
                    fz="sm"
                    style={{
                      textDecoration: "underline",
                      textDecorationStyle: "dashed",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    Open Source
                  </Anchor>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Store 25 documents
                </Text>
              </List.Item>
              <List.Item icon={<IoCloseCircle color="gray" size={20} />}>
                <Text c="gray.7" fw={500} fz="sm">
                  Compact Visualization
                </Text>
              </List.Item>
              <List.Item icon={<IoCloseCircle color="gray" size={20} />}>
                <Text c="gray.7" fw={500} fz="sm">
                  Compare Data
                </Text>
              </List.Item>
              <List.Item icon={<IoCloseCircle color="gray" size={20} />}>
                <Text c="gray.7" fw={500} fz="sm">
                  Edit Data on Graph
                </Text>
              </List.Item>
              <List.Item icon={<IoCloseCircle color="gray" size={20} />}>
                <Text c="gray.7" fw={500} fz="sm">
                  AI-powered data filter
                </Text>
              </List.Item>
              <List.Item icon={<IoCloseCircle color="gray" size={20} />}>
                <Text c="gray.7" fw={500} fz="sm">
                  Customize graph colors
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
