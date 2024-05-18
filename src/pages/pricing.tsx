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
import { FaArrowTrendDown } from "react-icons/fa6";
import { MdCheck } from "react-icons/md";
import { VscArrowRight } from "react-icons/vsc";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";

export const PRICING = {
  MONTHLY: 5,
  ANNUAL: 4,
};

export const purchaseLinks = {
  monthly:
    "https://herowand.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?enabled=67805",
  annual:
    "https://herowand.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?enabled=82417",
};

const StyledPaperFree = styled(Paper)`
  padding: 1.5em;
  width: 400px;
  border-radius: 1em;
  border: 2px solid #e9e9e9;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledPaper = styled(Paper)`
  padding: 1.5em;
  width: 400px;
  border-radius: 1em;
  border: 2px solid #e9e9e9;
  border-top: 3px solid #625bf6;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const PricingCards = () => {
  const [isMonthly, setIsMonthly] = React.useState(true);

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
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Flex align="center" mb="lg">
                <Text fw={500} size="xl" c="black">
                  Premium
                </Text>
                <Badge
                  size="lg"
                  variant="light"
                  color="#ff0000"
                  ml="sm"
                  leftSection={<FaArrowTrendDown />}
                >
                  %{isMonthly ? 16 : 20}
                </Badge>
              </Flex>

              <Flex gap="xs" align="baseline">
                <Text fz={38} fw="bold" c="black">
                  ${isMonthly ? PRICING.MONTHLY : PRICING.ANNUAL}
                </Text>
                <Text fz="md" fw={500} c="gray.6">
                  / mo
                </Text>
                <Text fz="xl" lts={1} c="dark" td="line-through" style={{ alignSelf: "start" }}>
                  ${isMonthly ? PRICING.MONTHLY + 1 : PRICING.ANNUAL + 1}
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
            variant="gradient"
            style={{ border: "1px solid #625BF6" }}
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
            Designed for individuals who works with data regularly.
          </Text>
          <Flex direction="column" justify="space-between">
            <List
              spacing="md"
              size="sm"
              mt="xs"
              c="black"
              center
              icon={<MdCheck color="blue" size="18" />}
            >
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Large data support
                </Text>
                <Text c="dimmed" fz="xs">
                  (~4 MB)
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Store 200 documents
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Compact graph visualizations & fast rendering
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Edit directly on visualizations reflecting on data
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Built-in tabs for multiple documents
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
            </List>
          </Flex>
        </StyledPaper>
        <StyledPaperFree>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fw={500} mb="lg" size="xl" c="black">
                Free
              </Text>

              <Flex gap="xs" align="baseline">
                <Text fz={38} fw="bold" c="black">
                  $0
                </Text>
              </Flex>
              <Text fz="xs" c="gray.7">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            href="https://app.jsoncrack.com/sign-up"
            size="lg"
            radius="md"
            variant="outline"
            color="dark"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Get Started
          </Button>
          <Flex direction="column" justify="space-between">
            <List
              spacing="md"
              size="sm"
              mt="lg"
              c="black"
              center
              icon={<MdCheck size="18" color="blue" />}
            >
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Basic data support
                </Text>
                <Text c="dimmed" fz="xs">
                  (~300 KB)
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
