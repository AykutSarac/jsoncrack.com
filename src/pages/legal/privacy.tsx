import React from "react";
import { Anchor, Container, Paper, Stack, Text, Title } from "@mantine/core";
import Layout from "src/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <Container my={50} size="sm">
        <Paper bg="transparent">
          <Title>Privacy Policy</Title>
          <Stack my="lg">
            <Text>
              This Privacy Policy describes how your personal information is collected, used, and
              shared when you visit or make a purchase from jsoncrack.com (the “Site”).
            </Text>
            <Title order={3}>To Whom Does This Policy Apply</Title>
            <Text>
              This Privacy Policy applies to customers and site visitors. Each customer is
              responsible for posting its own terms, conditions, and privacy policies, and ensuring
              compliance with all applicable laws and regulations.
            </Text>
            <Title order={3}>Changes To This Privacy Policy</Title>
            <Text>
              This Privacy Policy may change from time to time, as our Platform and our business may
              change. Your continued use of the Platform after any changes to this Privacy Policy
              indicates your agreement with the terms of the revised Privacy Policy.
            </Text>
            <Title order={3}>What Information Do We Collect</Title>
            <Text>
              We collect information directly from you when you provide it to us explicitly on our
              Site. We do not use third-party cookies on our Site.
            </Text>
            <Title order={3}>What We Use Your Information For</Title>
            <Text>
              We use your information to provide our Services, to improve our Platform, to
              understand how you use our Platform, and to communicate with you. We DO NOT share any
              personal information to third parties.
            </Text>
            <Title order={3}>How To Contact Us</Title>
            <Text>
              For privacy-related questions, please contact us at{" "}
              <Anchor href="mailto:contact@jsoncrack.com">contact@jsoncrack.com</Anchor>.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Privacy;
