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
  Tooltip,
  Anchor,
  type PaperProps,
  Box,
} from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { VscArrowRight, VscLinkExternal } from "react-icons/vsc";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";

export const PRICING = {
  MONTHLY: 6,
  ANNUAL: 5,
  LTD: 120,
  getAnnualSave: () => Math.round(((PRICING.MONTHLY - PRICING.ANNUAL) / PRICING.MONTHLY) * 100),
};

export const purchaseLinks = {
  monthly:
    "https://jsoncrack.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?enabled=67805",
  annual:
    "https://jsoncrack.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?enabled=82417",
  ltd: "https://jsoncrack.lemonsqueezy.com/buy/b4d2515e-1ed2-4f32-a6ad-615f208a89eb?enabled=384328",
};

const StyledPaper = styled(Paper)<PaperProps & any>`
  padding: 1.5em;
  width: 350px;
  border-radius: 4px;
  border: 2px solid #e9e9e9;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const PricingCards = () => {
  const [isMonthly, setIsMonthly] = React.useState(true);

  return (
    <Stack gap="0" align="center" maw="720px" mx="auto">
      <Center my="lg">
        <SegmentedControl
          bg="gray.1"
          color="white"
          value={isMonthly ? "Monthly" : "Annual"}
          onChange={v => setIsMonthly(v === "Monthly")}
          size="md"
          data={["Monthly", "Annual"]}
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
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Flex align="center">
                <Text fw={500} size="xl" c="black">
                  Premium
                </Text>
                {!isMonthly && (
                  <Badge
                    fw={600}
                    size="md"
                    variant="light"
                    c="orange"
                    radius="sm"
                    color="orange"
                    ml="sm"
                  >
                    SAVE {PRICING.getAnnualSave()}%
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
            color="orange"
            onClick={() => gaEvent("Pricing", "click upgrade premium")}
            href={isMonthly ? purchaseLinks.monthly : purchaseLinks.annual}
            target="_blank"
            size="lg"
            radius="md"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Start 2-Days Free Trial
          </Button>
          <Text mt="xs" fz="xs" c="dimmed">
            Remake version with advanced features, better performance and smooth user interface.
          </Text>
          <Flex direction="column" justify="space-between">
            <List
              spacing="sm"
              size="sm"
              mt="xs"
              c="black"
              center
              icon={<FaCheck size="18" color="#E8580C" />}
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
                    Larger data support
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
                    Compact and Fast Visualization
                  </Text>
                </Tooltip>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Compare data
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Edit data on graph
                </Text>
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
            Start Free
          </Button>
          <Text mt="xs" fz="xs" c="dimmed">
            Basic version of the editor with limited features, open-source.
          </Text>
          <Flex direction="column" justify="space-between">
            <List
              spacing="sm"
              size="sm"
              mt="lg"
              c="black"
              center
              icon={<FaCheck size="18" color="#E8580C" />}
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
              <List.Item icon={<FaXmark color="gray" size={20} />}>
                <Text c="gray.6" fw={500} fz="sm">
                  Edit data on graph
                </Text>
              </List.Item>
              <List.Item icon={<FaXmark color="gray" size={20} />}>
                <Text c="gray.6" fw={500} fz="sm">
                  AI-powered data filter
                </Text>
              </List.Item>
              <List.Item icon={<FaXmark color="gray" size={20} />}>
                <Text c="gray.6" fw={500} fz="sm">
                  Compact visualization
                </Text>
              </List.Item>
              <List.Item icon={<FaXmark color="gray" size={20} />}>
                <Text c="gray.6" fw={500} fz="sm">
                  Compare data
                </Text>
              </List.Item>
              <List.Item icon={<FaXmark color="gray" size={20} />}>
                <Text c="gray.6" fw={500} fz="sm">
                  Customize graph colors
                </Text>
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>
      </Flex>
      <Box id="buyonce" pt="lg">
        <StyledPaper w="100%" style={{ borderColor: "orange" }} visibleFrom="sm">
          <Stack px="xl">
            <Text fz="h2" fw={500} ta="center">
              Buy once,
              <Text ml={4} component="span" inherit c="orange">
                use forever
              </Text>
              !
            </Text>
            <Text>
              Gain lifetime access to JSON Crack, enjoy all the advantages of our Premium plan with
              this one-time deal.
            </Text>
            <Button
              component="a"
              href={purchaseLinks.ltd}
              target="_blank"
              w="fit-content"
              mx="auto"
              fw={500}
              size="md"
              color="orange"
              rightSection={<VscArrowRight />}
            >
              Get Lifetime Access for ${PRICING.LTD}
            </Button>
          </Stack>
        </StyledPaper>
      </Box>
    </Stack>
  );
};

const Pricing = () => {
  return (
    <>
      <Head>
        <title>Pricing - JSON Crack</title>
        <link rel="canonical" href="https://jsoncrack.com/pricing" />
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
