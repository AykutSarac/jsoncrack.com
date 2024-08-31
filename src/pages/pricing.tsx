import React from "react";
import Head from "next/head";
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
import { FaArrowRightLong, FaCircleCheck } from "react-icons/fa6";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";

export const PRICING = {
  MONTHLY: 7,
  ANNUAL: 6,
  LTD: null,
  getAnnualSave: () => Math.round(((PRICING.MONTHLY - PRICING.ANNUAL) / PRICING.MONTHLY) * 100),
};

export const purchaseLinks = {
  monthly:
    "https://jsoncrack.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?enabled=67805",
  annual:
    "https://jsoncrack.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?enabled=82417",
  ltd: "https://jsoncrack.lemonsqueezy.com/buy/b4d2515e-1ed2-4f32-a6ad-615f208a89eb?enabled=384328",
};

const StyledPaper = styled(Paper)<PaperProps & any & { $highlight?: boolean }>`
  padding: 1.5rem;
  width: 350px;
  flex: 350px;
  border-radius: 8px;
  background: ${({ $highlight }) => ($highlight ? "#202842" : "#ffffff")};
  box-shadow:
    0px 0px 1px rgba(3, 7, 18, 0.09),
    0px 0px 6px rgba(3, 7, 18, 0.07),
    0px 0px 13px rgba(3, 7, 18, 0.05),
    0px 0px 22px rgba(3, 7, 18, 0.04),
    0px 0px 35px rgba(3, 7, 18, 0.02);
`;

export const PricingCards = () => {
  const [isMonthly, setIsMonthly] = React.useState(true);

  return (
    <Stack gap="0" align="center" w="fit-content" mx="auto">
      <Center my="lg">
        <SegmentedControl
          bg="gray.2"
          color="white"
          value={isMonthly ? "Monthly" : "Annual"}
          onChange={v => setIsMonthly(v === "Monthly")}
          size="md"
          w={280}
          radius="xl"
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
          styles={{
            label: {
              color: "#202842",
            },
          }}
        />
      </Center>
      <Flex gap="lg" wrap="wrap" justify="space-between" maw="100%" mx="auto">
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fw={600} size="md" c="#202842">
                Free
              </Text>
              <Flex gap="xs" align="baseline">
                <Text fz={36} fw={600} c="#202842">
                  $0
                </Text>
                <Text fz="md" fw={500} c="gray.6">
                  / month
                </Text>
              </Flex>
              <Text h="19" fz="xs" c="gray.6">
                free forever
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            href="/editor"
            target="_blank"
            variant="outline"
            size="md"
            radius="xl"
            color="#202842"
            fullWidth
            my="lg"
          >
            Start free
          </Button>
          <Flex direction="column" justify="space-between">
            <List
              spacing="sm"
              size="sm"
              c="black"
              center
              icon={<FaCircleCheck size="18" color="#202842" />}
            >
              <List.Item>
                <Text component="span" c="#4669dc" fw={500} inherit>
                  25{" "}
                </Text>
                Documents Storage
              </List.Item>
              <List.Item>
                <Text component="span" c="#4669dc" fw={500} inherit>
                  300 KB{" "}
                </Text>
                Data Support
              </List.Item>
              <List.Item>
                <Anchor
                  href="https://github.com/AykutSarac/jsoncrack.com"
                  target="_blank"
                  rel="noreferrer"
                  c="#4669dc"
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
        <StyledPaper $highlight>
          <Flex justify="space-between">
            <Stack gap="0" w="100%">
              <Flex align="center">
                <Text fw={600} size="md" c="gray.1">
                  Premium
                </Text>
              </Flex>

              <Flex gap="xs" align="baseline">
                <Text fz={36} fw={600} c="white">
                  ${isMonthly ? PRICING.MONTHLY : PRICING.ANNUAL}
                </Text>
                <Text fz="md" fw={500} c="gray.6">
                  / month
                </Text>
              </Flex>
              <Flex h="19" justify="space-between">
                <Text fz="xs" c="gray.6">
                  billed {isMonthly ? "monthly" : "yearly"}
                </Text>
              </Flex>
            </Stack>
          </Flex>
          <Button
            component="a"
            variant="white"
            fw={600}
            color="#202842"
            onClick={() => gaEvent("Pricing", "click upgrade premium")}
            href={isMonthly ? purchaseLinks.monthly : purchaseLinks.annual}
            target="_blank"
            size="md"
            radius="xl"
            fullWidth
            my="lg"
          >
            Upgrade
          </Button>
          <Flex direction="column" justify="space-between">
            <List
              spacing="sm"
              size="sm"
              c="gray.2"
              center
              icon={<FaCircleCheck size="18" color="#ffffff" />}
            >
              <List.Item>Edit Data from Visualizations</List.Item>
              <List.Item>Multi-Document Tabs</List.Item>
              <List.Item>Compare Data & Highlight Changes</List.Item>
              <List.Item>Customizable Themes</List.Item>
              <List.Item>AI-Powered Data Filtering</List.Item>
              <List.Item>
                <Text component="span" c="lime.4" fw={500} inherit>
                  4 MB{" "}
                </Text>
                Data Support
              </List.Item>
              <List.Item>
                <Text component="span" c="lime.4" fw={500} inherit>
                  200{" "}
                </Text>
                Documents Storage
              </List.Item>
              <List.Item>
                <Text component="span" c="lime.4" fw={500} inherit>
                  5x
                </Text>{" "}
                Faster Loading
              </List.Item>
              <List.Item>
                <Text component="span" c="lime.4" fw={500} inherit>
                  50%{" "}
                </Text>
                Smaller Graphs
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>
      </Flex>
      {PRICING.LTD && (
        <Box w="100%">
          <StyledPaper withBorder p="xs" w="100%">
            <Flex wrap="wrap" gap="xs" align="end" justify="space-between">
              <Stack gap="5">
                <Text c="dark" fz="md" fw={500}>
                  Buy once,
                  <Text ml={4} component="span" inherit c="brightBlue.5">
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
                color="brightBlue"
                rightSection={<FaArrowRightLong />}
              >
                Get Lifetime Access for ${PRICING.LTD}
              </Button>
            </Flex>
          </StyledPaper>
        </Box>
      )}
      <Flex mt="sm" c="dimmed" justify="center" align="center" gap={4}>
        <AiOutlineInfoCircle />
        <Text size="sm">
          Payment email must be matching with the account registered to the JSON Crack.
        </Text>
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
      </Layout>
    </>
  );
};

export default Pricing;
