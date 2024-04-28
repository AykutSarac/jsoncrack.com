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
  Badge,
} from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { VscArrowRight } from "react-icons/vsc";
import Layout from "src/layout/Layout";
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
  border: 2px solid #e9e9e9;
`;

const StyledPaper = styled(Paper)`
  padding: 1.5em;
  width: 400px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(#ec85f5, #fb7eb0 28%, #fc9f96 53%, #ffbc88 78%, #ffc86a) border-box;
  border-radius: 1em;
  border: 2px solid transparent;
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
          color="dark"
          value={isMonthly ? "Monthly" : "Yearly"}
          onChange={v => setIsMonthly(v === "Monthly")}
          size="md"
          data={["Monthly", "Yearly"]}
          w={200}
          radius="xl"
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
            component="a"
            href="https://app.jsoncrack.com/sign-up"
            size="lg"
            radius="md"
            variant="outline"
            color="dark"
            fullWidth
            my="md"
          >
            Sign up
          </Button>
          <Flex direction="column" justify="space-between" h={250}>
            <List spacing="xs" size="sm" mt="lg" center icon="✦">
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Open Source
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Graph & Tree visualizations
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Small size graph visualizations
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Download as image
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
          </Flex>
          <Button
            component="a"
            href={paymentURL(isMonthly ? purchaseLinks.monthly : purchaseLinks.annual)}
            target="_blank"
            size="lg"
            radius="md"
            color="indigo"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Get Started
          </Button>
          <Flex direction="column" justify="space-between" h={250}>
            <List spacing="xs" size="sm" mt="lg" center icon="✦">
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Graphs: 5X faster, compact and smooth
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Compare data differences on graphs
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
                  Save up to 200 documents in the cloud
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
                  Visualize up to 4 MBs
                </Text>
              </List.Item>
              <List.Item>
                <Text c="gray.7" fw={500} fz="sm">
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
