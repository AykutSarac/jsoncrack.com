import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, Stack, Text, Title } from "@mantine/core";
import Layout from "src/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <Head>
        <title>404 | JSON Crack</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Stack mt={100} justify="center" align="center">
        <Title fz={150} style={{ fontFamily: "monospace" }}>
          404
        </Title>
        <Title order={2}>Nothing to see here</Title>
        <Text c="dimmed" maw={800} style={{ textAlign: "center" }}>
          Page you are trying to open does not exist. You may have mistyped the address, or the page
          has been moved to another URL. If you think this is an error contact support.
        </Text>
        <Link href="/">
          <Button size="lg" color="gray" type="button">
            Go Home
          </Button>
        </Link>
      </Stack>
    </Layout>
  );
};

export default NotFound;
