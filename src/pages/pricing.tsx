import React from "react";
import Head from "next/head";
import {
  Flex,
  Stack,
  Button,
  List,
  ThemeIcon,
  Text,
  Paper,
  Badge,
  SegmentedControl,
  Center,
  Tooltip,
} from "@mantine/core";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsCheck, BsX } from "react-icons/bs";
import { FaBolt } from "react-icons/fa6";
import { VscArrowRight, VscInfo } from "react-icons/vsc";
import Layout from "src/layout/Layout";
import useUser from "src/store/useUser";

const purchaseLinks = {
  monthly:
    "https://herowand.lemonsqueezy.com/checkout/buy/ce30521f-c7cc-44f3-9435-995d3260ba22?media=0&enabled=67805%2C82417",
  annual:
    "https://herowand.lemonsqueezy.com/checkout/buy/577928ea-fb09-4076-9307-3e5931b35ad0?media=0&enabled=67805%2C82417",
};

const Pricing = () => {
  const email = useUser(state => state.user?.email);
  const [isMonthly, setIsMonthly] = React.useState(true);

  const paymentURL = (url: string) => {
    if (email) url += `?checkout[email]=${email}`;
    return url;
  };

  return (
    <Layout>
      <Head>
        <title>Pricing - JSON Crack</title>
      </Head>
      <Center my="lg">
        <SegmentedControl
          onChange={v => setIsMonthly(v === "Monthly")}
          size="lg"
          data={["Monthly", "Yearly"]}
          w={200}
          radius="xl"
        />
      </Center>
      <Flex gap="lg" wrap="wrap" justify="center" w="fit-content" p="lg" mx="auto">
        <Paper bg="white" p="xl" radius="lg" withBorder w={325}>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fz="xl" fw="bold" c="black">
                Free
              </Text>
              <Text fz={32} fw="bold" c="black">
                $0
              </Text>
              <Text fz="xs" c="gray.6">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button my="md" size="md" radius="md" color="black" variant="outline" fullWidth>
            Free
          </Button>
          <Flex direction="column" justify="space-between" h={200}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={
                <ThemeIcon color="dark.6" size={20} radius="xl">
                  <BsCheck size="1rem" />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Text c="black" fz="sm">
                  Save & share up to 15 files
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fz="sm">
                  Visualize all data formats
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="gray.5" size={20} radius="xl">
                    <BsX size="1rem" />
                  </ThemeIcon>
                }
              >
                <Text c="gray.6" fz="sm">
                  Maximum Capability
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="gray.5" size={20} radius="xl">
                    <BsX size="1rem" />
                  </ThemeIcon>
                }
              >
                <Text c="gray.6" fz="sm">
                  JSON Schema
                </Text>
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="gray.5" size={20} radius="xl">
                    <BsX size="1rem" />
                  </ThemeIcon>
                }
              >
                <Text c="gray.6" fz="sm">
                  Edit data through graph
                </Text>
              </List.Item>
            </List>
          </Flex>
        </Paper>

        <Paper
          p="xl"
          radius="lg"
          bg="white"
          withBorder
          w={325}
          style={{ borderColor: "black", borderWidth: "2px" }}
        >
          <Flex justify="space-between">
            <Stack gap="0">
              <Flex align="center" gap="xs">
                <Text fz="xl" fw="bold" c="black">
                  Premium
                </Text>
                <Badge size="sm" color="red" leftSection={<FaBolt />}>
                  Most Popular
                </Badge>
              </Flex>
              <Flex gap="xs" align="center">
                <Text fz={32} fw="bold" c="black">
                  ${isMonthly ? "5" : "60"}
                </Text>
                <Text fz="md" fw="bold" c="dimmed" style={{ textDecoration: "line-through" }}>
                  ${isMonthly ? "7" : "84"}
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
            color="dark"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Upgrade
          </Button>
          <Flex direction="column" justify="space-between" h={200}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={
                <ThemeIcon color="dark.6" size={20} radius="xl">
                  <BsCheck size="1rem" />
                </ThemeIcon>
              }
            >
              <List.Item>
                <Text c="black" fz="sm">
                  Maximum capability
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fz="sm">
                  Save & share up to 200 files
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fz="sm">
                  Visualize all data formats
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fz="sm">
                  JSON Schema
                </Text>
              </List.Item>
              <List.Item>
                <Text c="black" fz="sm">
                  Edit data through graph
                </Text>
              </List.Item>
              <List.Item>
                <Text c="blue" fz="sm">
                  Join alpha test of JC AI{" "}
                  <Tooltip label="You will receive 10 credits per day.">
                    <ThemeIcon size="xs" variant="transparent" style={{ verticalAlign: "middle" }}>
                      <VscInfo />
                    </ThemeIcon>
                  </Tooltip>
                </Text>
              </List.Item>
            </List>
          </Flex>
        </Paper>

        <Paper bg="white" p="xl" radius="lg" withBorder w={325}>
          <Flex justify="space-between">
            <Stack gap="0">
              <Text fz="xl" fw="bold" c="black">
                Enterprise
              </Text>
              <Text fz={32} fw="bold" c="black">
                Custom
              </Text>
              <Text fz="xs" c="gray.6">
                billed {isMonthly ? "monthly" : "annually"}
              </Text>
            </Stack>
          </Flex>
          <Button
            component="a"
            href="mailto:contact@jsoncrack.com?subject=Enterprise%20Plan%20Inquiry&body=Please%20replace%20this%20text%20with%20your%20inquiry%20content."
            target="_blank"
            size="md"
            radius="md"
            variant="outline"
            color="dark"
            fullWidth
            my="md"
            rightSection={<VscArrowRight />}
          >
            Contact Us
          </Button>
          <Flex direction="column" justify="space-between" h={200}>
            <List
              spacing="xs"
              size="sm"
              mt="lg"
              center
              icon={
                <ThemeIcon color="dark.6" size={20} radius="xl">
                  <BsCheck size="1rem" />
                </ThemeIcon>
              }
              c="black"
            >
              <List.Item>Everything from previous plans</List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="dark.6" size={20} radius="xl">
                    <BsCheck size="1rem" />
                  </ThemeIcon>
                }
                c="black"
              >
                Unlimited premium accounts for work email
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon color="dark.6" size={20} radius="xl">
                    <BsCheck size="1rem" />
                  </ThemeIcon>
                }
                c="black"
              >
                Shared cloud in app
              </List.Item>
            </List>
          </Flex>
        </Paper>
      </Flex>
      <Text pt="sm" size="sm" c="dimmed" style={{ textAlign: "center" }}>
        <AiOutlineInfoCircle style={{ marginRight: "4px" }} />
        Payment email must be matching with the account registered to the JSON Crack.
      </Text>
    </Layout>
  );
};

export default Pricing;
