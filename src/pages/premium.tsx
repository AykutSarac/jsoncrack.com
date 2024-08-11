import React from "react";
import Head from "next/head";
import {
  Container,
  Box,
  Title,
  Button,
  Image,
  Text,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Flex,
  Badge,
  Group,
  Radio,
  Stack,
} from "@mantine/core";
import styled from "styled-components";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { GrMultiple } from "react-icons/gr";
import { IoSparkles } from "react-icons/io5";
import {
  MdChevronRight,
  MdCompare,
  MdOutlinePhotoSizeSelectSmall,
  MdOutlineTimer,
  MdPalette,
  MdRocketLaunch,
  MdSpeed,
} from "react-icons/md";
import { RiRobot2Line } from "react-icons/ri";
import { PremiumPreview } from "src/containers/Landing/PremiumPreview";
import Layout from "src/layout/Layout";
import { gaEvent } from "src/lib/utils/gaEvent";
import { PRICING, purchaseLinks } from "./pricing";

const StyledRadioCard = styled(Radio.Card)`
  border-width: 2px;
  border-color: #efefef;
  min-width: 450px;
  transition: 0.2s;
  background: white;

  &[data-checked] {
    border-color: #535353;
  }

  &:hover:not([data-checked]) {
    border-color: #b9b9b9;
    background: #f9f9f9;
  }

  @media only screen and (max-width: 600px) {
    min-width: unset;
    max-width: 100%;
  }
`;

const Premium = () => {
  const [plan, setPlan] = React.useState("monthly");

  const getUpgradeLink = () => {
    const link = new URL(purchaseLinks[plan]);

    gaEvent("Premium Page", "click select", plan);
    return link.toString();
  };

  return (
    <>
      <Head>
        <title>Premium - JSON Crack</title>
        <link rel="canonical" href="https://jsoncrack.com/premium" />
        <meta
          name="description"
          content="Rebuilt from the ground up — now faster, more powerful, and more visually stunning."
        />
        <meta
          property="og:description"
          content="Rebuilt from the ground up — now faster, more powerful, and more visually stunning."
        />
        <meta
          name="twitter:description"
          content="Rebuilt from the ground up — now faster, more powerful, and more visually stunning."
        />
      </Head>
      <Layout>
        <Container
          pos="relative"
          pt={100}
          pb={200}
          fluid
          style={{
            background:
              "linear-gradient(165deg, #000000, #010101, #080808, #171717, #272727, #383838, #4a4a4a, #5d5d5d)",
          }}
        >
          <Box mx="auto" maw={600}>
            <Title
              order={1}
              c="white"
              fz={{
                base: 38,
                xs: 50,
              }}
            >
              More than just a JSON Viewer.
            </Title>
            <Text
              c="gray.3"
              mt={32}
              fz={{
                base: 16,
                xs: 20,
              }}
            >
              Rebuilt from the ground up — now faster, more powerful, and more visually stunning.
            </Text>
            <Button
              component="a"
              href="#pricing"
              mt="lg"
              variant="white"
              color="gray"
              radius="md"
              size="lg"
              rightSection={<MdChevronRight size={30} />}
            >
              Get it now
            </Button>
            <Image
              pos="absolute"
              bottom={-1}
              left={0}
              src="./assets/premium-divider.svg"
              width="100%"
              alt="divider"
              style={{
                transform: "scaleY(-1) scaleX(-1)",
              }}
            />
          </Box>
        </Container>
        <PremiumPreview />
        <Container fluid bg="dark" my={120} py={40}>
          <Container size="xl">
            <Title
              fz={{
                base: 28,
                xs: 36,
              }}
              order={2}
              c="white"
            >
              Built for everyone.
            </Title>
            <Text c="gray.3" fz="xl" mb={40}>
              Zero technical knowledge required.
            </Text>
            <SimpleGrid
              cols={{
                base: 1,
                xs: 2,
                md: 4,
              }}
              spacing="xl"
            >
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="blue.3">
                    <Text fz="sm" fw={500}>
                      4 MB
                    </Text>
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    Larger Data
                  </Title>
                  <Text c="gray.3">From 300KB to ~4MB upgraded data size.</Text>
                </Flex>
              </Paper>
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="violet.1">
                    <MdOutlinePhotoSizeSelectSmall size="30" />
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    Compact Design
                  </Title>
                  <Text c="gray.3">
                    50% less graph size. Get rid of the redundant data and nodes, focus on
                    what&apos;s important.
                  </Text>
                </Flex>
              </Paper>
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="green.3">
                    <MdSpeed size="30" />
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    Faster
                  </Title>
                  <Text c="gray.3">
                    Load data faster. Navigate faster. Search faster. Everything is faster than
                    ever.
                  </Text>
                </Flex>
              </Paper>
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="orange.2">
                    <MdCompare size="30" />
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    Compare
                  </Title>
                  <Text c="gray.3">
                    Compare two data, highlight the differences directly on the graphs.
                  </Text>
                </Flex>
              </Paper>
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="violet.3">
                    <IoSparkles size="22" />
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    Edit Directly
                  </Title>
                  <Text c="gray.3">
                    Modify your data directly on the graph. No more switching between the editor and
                    the graph.
                  </Text>
                </Flex>
              </Paper>
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="yellow.2">
                    <MdPalette size="30" />
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    Customize
                  </Title>
                  <Text c="gray.3">
                    Customize the graph&apos;s colors to align with your brand or personal
                    preferences.
                  </Text>
                </Flex>
              </Paper>
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="grape.2">
                    <GrMultiple size="22" />
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    Tabs
                  </Title>
                  <Text c="gray.3">
                    Open multiple tabs, navigate between them easily. Save up to 200 documents to
                    the cloud.
                  </Text>
                </Flex>
              </Paper>
              <Paper bg="gray.8" p="lg" radius="md">
                <Flex gap="sm" align="center" justify="center" direction="column">
                  <ThemeIcon radius="xl" size="xl" variant="light" color="gray.1">
                    <RiRobot2Line size="22" />
                  </ThemeIcon>
                  <Title ta="center" c="white" order={3}>
                    AI-Powered
                  </Title>
                  <Text c="gray.3">
                    Ask it to translate your fields, filter out by age or name includes, and more.
                  </Text>
                </Flex>
              </Paper>
            </SimpleGrid>
          </Container>
        </Container>
        <Container pt="xl" component="section" id="pricing" size="xl">
          <Title
            maw={800}
            fw={500}
            mx="auto"
            ta="center"
            c="dark"
            fz={{
              base: 28,
              xs: 40,
            }}
            order={2}
          >
            Keep your expectations high.
          </Title>
          <Radio.Group maw={600} mx="auto" mt="xl" value={plan} onChange={setPlan}>
            <Stack>
              <StyledRadioCard value="monthly" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Flex align="center" gap="xs">
                    <Text fz="xl" c="gray.7" fw={600}>
                      Monthly
                    </Text>
                  </Flex>
                  <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                    <Text fw={600} fz="xl" c="gray.7">
                      ${PRICING.MONTHLY}
                    </Text>
                    /month
                  </Flex>
                </Group>
              </StyledRadioCard>
              <StyledRadioCard value="annual" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Flex align="center" gap="xs">
                    <Text fz="xl" c="gray.7" fw={600}>
                      Yearly
                    </Text>
                  </Flex>
                  <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                    <Text fw={600} fz="xl" c="gray.7">
                      ${PRICING.ANNUAL * 12}
                    </Text>
                    /year
                  </Flex>
                </Group>
              </StyledRadioCard>
              <StyledRadioCard value="ltd" radius="lg" px="xl" py="md">
                <Group align="center" justify="space-between">
                  <Flex align="center" gap="xs">
                    <Text fz="xl" c="gray.7" fw={600}>
                      Lifetime
                    </Text>
                    <Badge
                      variant="light"
                      size="sm"
                      radius="lg"
                      color="red"
                      leftSection={<MdOutlineTimer size="12" />}
                    >
                      Limited
                    </Badge>
                  </Flex>
                  <Flex fw={500} align="baseline" fz="sm" c="gray.5">
                    <Text fw={600} fz="xl" c="gray.7">
                      ${PRICING.LTD}
                    </Text>
                    /lifetime
                  </Flex>
                </Group>
              </StyledRadioCard>
            </Stack>
            <Button
              component="a"
              href={getUpgradeLink()}
              target="_blank"
              color="dark"
              fullWidth
              mt="xl"
              size="xl"
              radius="md"
              leftSection={<MdRocketLaunch />}
            >
              Upgrade
            </Button>
          </Radio.Group>
          <Flex pt="sm" c="dimmed" justify="center" align="center" gap={4}>
            <AiOutlineInfoCircle />
            <Text size="xs">
              Payment email must be matching with the account registered to the JSON Crack.
            </Text>
          </Flex>
        </Container>
      </Layout>
    </>
  );
};

export default Premium;
