import React from "react";
import { Box, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { NextSeo } from "next-seo";
import { SEO } from "src/constants/seo";
import privacy from "src/data/privacy.json";
import Layout from "src/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <NextSeo
        {...SEO}
        title="Privacy Policy - JSON Crack"
        description="JSON Crack Privacy Policy"
        canonical="https://jsoncrack.com/legal/privacy"
      />
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
