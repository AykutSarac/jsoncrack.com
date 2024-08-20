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
  Anchor,
  type PaperProps,
  Box,
} from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaArrowRightLong, FaCheck } from "react-icons/fa6";
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
  padding: 1em;
  width: 320px;
  border-radius: 8px;
  border: 2px solid #dbdbdb;
  background: #fcfcfc;
`;

export const PricingCards = () => {
  const [isMonthly, setIsMonthly] = React.useState(true);

  return (
    <Stack gap="0" align="center" maw="665px" mx="auto">
      <Center my="lg">
        <SegmentedControl
          bg="gray.1"
          color="white"
          value={isMonthly ? "Monthly" : "Annual"}
          onChange={v => setIsMonthly(v === "Monthly")}
          size="md"
          w={280}
          data={[
            {
              label: "Monthly Billing",
              value: "Monthly",
            },
            {
              label: "Yearly Billing",
              value: "Annual",
            },
          ]}
          radius="xl"
          styles={{ label: { color: "#282828" } }}
        />
      </Center>
      <Flex
        gap="sm"
        wrap="wrap"
        justify="space-between"
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
              <Text fw={500} size="md" c="black">
                Free
              </Text>
              <Text fz={36} fw={600} c="black">
                $0
              </Text>
              <Text fz="xs" c="gray.7">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            href="https://app.jsoncrack.com/sign-up"
            target="_blank"
            size="md"
            radius="md"
            variant="default"
            color="dark"
            fullWidth
            my="md"
          >
            Sign Up
          </Button>
          <Flex direction="column" justify="space-between">
            <List
              spacing="sm"
              size="sm"
              c="black"
              center
              icon={<FaCheck size="18" color="#5fb409" />}
            >
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  <Text component="span" c="violet" inherit>
                    25{" "}
                  </Text>
                  Documents Storage
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  <Text component="span" c="violet" inherit>
                    300 KB{" "}
                  </Text>
                  Data Support
                </Text>
              </List.Item>
              <List.Item>
                <Anchor
                  href="https://github.com/AykutSarac/jsoncrack.com"
                  target="_blank"
                  rel="noreferrer"
                  c="violet"
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
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0" w="100%">
              <Flex align="center">
                <Text fw={500} size="md" c="black">
                  Premium
                </Text>
              </Flex>

              <Flex gap="xs" align="baseline">
                <Text fz={36} fw={600} c="black">
                  ${isMonthly ? PRICING.MONTHLY : PRICING.ANNUAL}
                </Text>
                <Text fz="md" fw={500} c="gray.6">
                  / month
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text fz="xs" c="gray.7">
                  billed {isMonthly ? "monthly" : "annually"}
                </Text>
                <Anchor component={Link} href="/premium" ml="sm" fz="xs" td="underline" c="dimmed">
                  see all features
                </Anchor>
              </Flex>
            </Stack>
          </Flex>
          <Button
            component="a"
            color="dark"
            onClick={() => gaEvent("Pricing", "click upgrade premium")}
            href={isMonthly ? purchaseLinks.monthly : purchaseLinks.annual}
            target="_blank"
            size="md"
            radius="md"
            fullWidth
            my="md"
          >
            Upgrade
          </Button>
          <Flex direction="column" justify="space-between">
            <List
              spacing="sm"
              size="sm"
              c="black"
              center
              icon={<FaCheck size="18" color="#5fb409" />}
            >
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Edit Data from Visualization
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Multi-Document Tabs
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Compare Data & Highlight Changes
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  Customizable Themes
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  AI-Powered Data Filtering
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  <Text component="span" c="violet" inherit>
                    4 MB{" "}
                  </Text>
                  Data Support
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  <Text component="span" c="violet" inherit>
                    200{" "}
                  </Text>
                  Documents Storage
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  <Text component="span" c="violet" inherit>
                    5x
                  </Text>{" "}
                  Faster Loading
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fw={500} fz="sm">
                  <Text component="span" c="violet" inherit>
                    50%{" "}
                  </Text>
                  Smaller Graphs
                </Text>
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>
        <Box w="100%">
          <StyledPaper withBorder p="xs" w="100%" visibleFrom="sm">
            <Flex gap="xs" align="end" justify="space-between">
              <Stack gap="5">
                <Text c="dark" fz="md" fw={500}>
                  Buy once,
                  <Text ml={4} component="span" inherit c="violet">
                    use forever
                  </Text>
                  !
                </Text>
                <Text c="gray.8" fz="sm" maw={400}>
                  Lifetime access. One-time payment. Free updates.
                </Text>
              </Stack>
              <Button
                component="a"
                href={purchaseLinks.ltd}
                target="_blank"
                fz="sm"
                size="md"
                variant="light"
                radius="md"
                color="violet"
                rightSection={<FaArrowRightLong />}
              >
                Get Lifetime Access for ${PRICING.LTD}
              </Button>
            </Flex>
          </StyledPaper>
        </Box>
      </Flex>
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
