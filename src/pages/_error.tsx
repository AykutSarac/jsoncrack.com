import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Stack, Text, Title } from "@mantine/core";
import Layout from "src/layout/Layout";

const Custom500 = () => {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Unexpected Error Occured | JSON Crack</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Stack mt={100} justify="center" align="center">
        <Title fz={150} style={{ fontFamily: "monospace" }}>
          500
        </Title>
        <Title order={2}>Something bad just happened...</Title>
        <Text c="dimmed" maw={800} style={{ textAlign: "center" }}>
          Our servers could not handle your request. Don&apos;t worry, our development team was
          already notified. Try refreshing the page.
        </Text>
        <Button size="lg" color="gray" type="button" onClick={() => router.reload()}>
          Refresh the page
        </Button>
      </Stack>
    </Layout>
  );
};

export default Custom500;
