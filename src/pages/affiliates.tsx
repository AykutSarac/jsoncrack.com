import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Image,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { MdChevronRight } from "react-icons/md";
import Layout from "src/layout/Layout";

const AFFILIATE_SINGUP_URL = "https://affiliates.lemonsqueezy.com/programs/jsoncrack";

const Affiliate = () => {
  return (
    <>
      <Head>
        <title>Affiliate Program - JSON Crack</title>
        <link rel="canonical" href="https://jsoncrack.com/affiliates" />
        <meta
          name="description"
          content="Monetize your website with JSON Crack's Affiliate Program. Promote JSON Crack to your audience earn up to $24 per commission! Join the program for free!"
        />
        <meta
          name="og:description"
          content="Monetize your website with JSON Crack's Affiliate Program. Promote JSON Crack to your audience earn up to $24 per commission! Join the program for free!"
        />
        <meta
          name="twitter:description"
          content="Monetize your website with JSON Crack's Affiliate Program. Promote JSON Crack to your audience earn up to $24 per commission! Join the program for free!"
        />
        <meta
          property="og:image"
          content="https://jsoncrack.com/assets/og/affiliates.png"
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content="https://jsoncrack.com/assets/og/affiliates.png"
          key="twimage"
        />
      </Head>
      <Layout>
        <Container
          pos="relative"
          py={100}
          pb={180}
          fluid
          style={{
            background:
              "linear-gradient(150deg, #2b2e4a, #3e345e, #57386e, #723b78, #903c7a, #af3d73, #cd3f63, #e84545)",
          }}
        >
          <Box mx="auto" maw={600}>
            <Title
              order={1}
              c="white"
              fz={{
                base: 36,
                xs: 42,
              }}
            >
              Join JSON Crack&apos;s Affiliate Program
            </Title>
            <Text
              c="gray.3"
              mt={32}
              fz={{
                base: 16,
                xs: 20,
              }}
            >
              Do you own a website, popular social media account, blog or YouTube channel? Promote
              JSON Crack with our affiliate program and earn commissions.
            </Text>
            <Link href={AFFILIATE_SINGUP_URL} target="_blank" rel="noopener">
              <Button
                mt="lg"
                color="orange"
                radius="md"
                size="lg"
                rightSection={<MdChevronRight size={30} />}
              >
                Apply now
              </Button>
            </Link>
            <Image
              pos="absolute"
              bottom={-1}
              left={0}
              src="./assets/steps-divider-round.svg"
              width="100%"
              alt="divider"
              style={{
                transform: "scaleY(-1) scaleX(-1)",
              }}
            />
          </Box>
        </Container>
        <Container size="lg">
          <Title
            fz={{
              base: 32,
              xs: 38,
            }}
            order={2}
            mt={100}
            mb={40}
          >
            How it works
          </Title>
          <SimpleGrid
            cols={{
              base: 1,
              xs: 2,
              sm: 3,
            }}
            spacing="xl"
          >
            <Box>
              <ThemeIcon radius="xl" size="lg" fw="bold" fz="lg" color="orange">
                1
              </ThemeIcon>
              <Title c="gray.8" order={3} mt={16}>
                Join our program
              </Title>
              <Text c="dark" mt={16}>
                Read our FAQ here below and apply via the link!
              </Text>
            </Box>
            <Box>
              <ThemeIcon radius="xl" size="lg" fw="bold" fz="lg" color="orange">
                2
              </ThemeIcon>
              <Title c="gray.8" order={3} mt={16}>
                Send traffic
              </Title>
              <Text c="dark" mt={16}>
                Promote content on your source! Promote JSON Crack via your YouTube channel, blog
                posts or newsletters.
              </Text>
            </Box>
            <Box>
              <ThemeIcon radius="xl" size="lg" fw="bold" fz="lg" color="orange">
                3
              </ThemeIcon>
              <Title c="gray.8" order={3} mt={16}>
                Earn commissions
              </Title>
              <Text c="dark" mt={16}>
                Earn up to $24.00 commission on every referral that results in a successful sale. No
                limit to how much you can make by promoting us.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
        <Container fluid bg="yellow.5" my={120} py={40}>
          <Container size="lg">
            <Title
              fz={{
                base: 32,
                xs: 38,
              }}
              order={2}
              mb={40}
            >
              FAQ
            </Title>
            <SimpleGrid
              cols={{
                base: 1,
                xs: 2,
                md: 4,
              }}
              spacing="xl"
            >
              <Box>
                <Title c="black" order={3} mt={16} fw="500">
                  How long does the cookie last?
                </Title>
                <Text c="black" mt={16}>
                  15 days.
                </Text>
              </Box>
              <Box>
                <Title c="black" order={3} mt={16} fw="500">
                  How do I make money as an affiliate?
                </Title>
                <Text c="black" mt={16}>
                  All you have to do is recommend us using your affiliate link on your website,
                  blog, and social media. We track your clicks and transactions so you can get paid.
                </Text>
              </Box>
              <Box>
                <Title c="black" order={3} mt={16} fw="500">
                  When do I get paid?
                </Title>
                <Text c="black" mt={16}>
                  We payout on NET30 terms to account for refunds and chargebacks. For example,
                  commissions generated in January would be paid out on March 15th (NET30).
                </Text>
              </Box>
              <Box>
                <Title c="black" order={3} mt={16} fw="500">
                  More questions?
                </Title>
                <Text c="black" mt={16}>
                  Contact us via
                  <br />
                  <Anchor
                    c="inherit"
                    td="underline"
                    href="mailto:contact@jsoncrack.com"
                    target="_blank"
                    rel="noopener"
                  >
                    contact@jsoncrack.com
                  </Anchor>
                </Text>
              </Box>
            </SimpleGrid>
          </Container>
        </Container>
        <Container size="lg">
          <Paper p={60} radius="lg" bg="dark" withBorder>
            <Title
              maw={800}
              fw={400}
              mx="auto"
              ta="center"
              c="white"
              fz={{
                base: 28,
                xs: 40,
              }}
              order={2}
            >
              Join our affiliate program for free and start monetize your traffic!
            </Title>
            <Center mt={40}>
              <Link href={AFFILIATE_SINGUP_URL} target="_blank" rel="noopener">
                <Button
                  mx="auto"
                  size="xl"
                  radius="xl"
                  color="orange"
                  rightSection={<MdChevronRight size={30} />}
                >
                  Apply now
                </Button>
              </Link>
            </Center>
          </Paper>
        </Container>
      </Layout>
    </>
  );
};

export default Affiliate;
