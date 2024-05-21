import React from "react";
import Head from "next/head";
import { Box, Container, Paper, Stack, Text, Title } from "@mantine/core";
import Layout from "src/layout/Layout";
import privacy from "../../constants/privacy.json";

const Privacy = () => {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - JSON Crack</title>
      </Head>
      <Container my={50} size="md" pb="lg">
        <Paper bg="transparent">
          <Title ta="center" c="gray.8">
            Privacy Policy
          </Title>
          <Text c="gray.6" ta="center">
            Last updated: May 21, 2024
          </Text>

          <Stack mt={50} my="lg">
            {Object.keys(privacy).map((term, index) => (
              <Box component="section" mt="xl" key={index}>
                <Title order={2} mb="xl" c="gray.8">
                  {term}
                </Title>
                {privacy[term].map(term => (
                  <Text mt="md" c="gray.8" key={term} ml={term.startsWith("•") ? 15 : 0}>
                    {term}
                  </Text>
                ))}
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Privacy;
