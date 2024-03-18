import React from "react";
import Head from "next/head";
import { Flex, Stack, Button, List, Text, Paper, SegmentedControl, Center } from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { VscArrowRight } from "react-icons/vsc";
import Layout from "src/layout/Layout";
import useUser from "src/store/useUser";

const purchaseLinks = {
  monthly:
    "https://herowand.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?enabled=67805",
  annual:
    "https://herowand.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?enabled=82417",
};

const StyledPaper = styled(Paper)`
  padding: 1.5em;
  border-radius: 1rem;
  width: 400px;
  background: rgb(14, 14, 14);

  background: linear-gradient(
    180deg,
    rgba(48, 48, 48, 0.5) 0%,
    rgba(0, 0, 0, 1) 25%,
    rgba(0, 0, 0, 1) 50%,
    rgba(0, 0, 0, 1) 90%,
    rgba(101, 0, 94, 0.5) 100%
  );

  border-bottom: 1px solid rgba(101, 0, 94, 1);
  border-top: 1px solid rgba(48, 48, 48, 1);
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.01);
  }
`;

export const PricingCards = () => {
  const email = useUser(state => state.user?.email);
  const [isMonthly, setIsMonthly] = React.useState(true);

  const paymentURL = (url: string) => {
    if (email) url += `?checkout[email]=${email}`;
    return url;
  };

  return (
    <Stack gap="0" align="center">
      <Center my="lg">
        <SegmentedControl
          color="dark"
          onChange={v => setIsMonthly(v === "Monthly")}
          size="lg"
          data={["Monthly", "Yearly"]}
          w={200}
          radius="xl"
        />
      </Center>
      <Flex gap="lg" wrap="wrap" justify="center" w="fit-content" p="lg" mx="auto">
        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fz="xl" fw="bold" c="white">
                Free
              </Text>
              <Text fz={32} fw="bold" c="white">
                $0
              </Text>
              <Text fz="xs" c="gray.6">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            href="https://jsoncrack.com"
            target="_blank"
            my="md"
            size="md"
            radius="md"
            color="gray.6"
            variant="outline"
            fullWidth
          >
            Free
          </Button>
          <Flex direction="column" justify="space-between" h={270}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={<FaCheck color="white" size="1rem" />}
            >
              <List.Item>
                <Text c="white" fz="sm">
                  Open Source
                </Text>
              </List.Item>
              <List.Item>
                <Text c="white" fz="sm">
                  Visualize multiple data formats
                </Text>
                <Text c="dimmed" fz="xs">
                  JSON, YAML, CSV, XML, TOML
                </Text>
              </List.Item>
              <List.Item>
                <Text c="white" fz="sm">
                  Download graph as image
                </Text>
              </List.Item>
              <List.Item>
                <Text c="white" fz="sm">
                  Generate types
                </Text>
                <Text c="dimmed" fz="xs">
                  TypeScript, Rust, Go, etc.
                </Text>
              </List.Item>
            </List>
          </Flex>
        </StyledPaper>

        <StyledPaper>
          <Flex justify="space-between">
            <Stack gap="0">
              <Flex align="center" gap="xs">
                <Text fz="xl" fw="bold" c="white">
                  Premium
                </Text>
              </Flex>
              <Flex gap="xs" align="center">
                <Text fz={32} fw="bold" c="white">
                  ${isMonthly ? "6" : "5"}
                </Text>
                <Text fz="md" fw={500} c="gray.5">
                  / month
                </Text>
              </Flex>
              <Text fz="xs" c="gray.6">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            href={paymentURL(isMonthly ? purchaseLinks.monthly : purchaseLinks.annual)}
            target="_blank"
            size="md"
            radius="md"
            color="white"
            bg="grape"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Upgrade
          </Button>
          <Flex direction="column" justify="space-between" h={300}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={<ImCheckmark color="white" size="1rem" />}
            >
              <List.Item>
                <Text c="gray.4" fz="sm">
                  Lightning speed graph visualization
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.4" fz="sm">
                  Smooth user interface & experience
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.4" fz="sm">
                  Modify data directly through the graph
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.4" fz="sm">
                  Switch tabs within the editor
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.4" fz="sm">
                  Save up to 200 documents in the cloud
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.4" fz="sm">
                  JSON Schema
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.4" fz="sm">
                  Bigger dataset support
                </Text>
                <Text c="dimmed" fz="xs">
                  Supports up to 4 MB.
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.4" fz="sm">
                  Join alpha test of AI
                </Text>
                <Text c="dimmed" fz="xs">
                  (10 credits/day)
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
