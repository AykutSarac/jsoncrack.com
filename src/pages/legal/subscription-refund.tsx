import React from "react";
import Head from "next/head";
import { Anchor, Container, List, Paper, Stack, Text, Title } from "@mantine/core";
import Layout from "src/layout/Layout";

const SubscriptionRefund = () => {
  return (
    <Layout>
      <Head>
        <title>Subscription & Refund - JSON Crack</title>
      </Head>
      <Container my={50} size="sm" pb="lg">
        <Paper bg="transparent">
          <Title c="gray.8">Subscription & Refund</Title>
          <Stack my="lg">
            <Text c="gray.8">
              This document delineates the Subscription Cancellation and Refund Policy for users of
              jsoncrack.com (the “Site”). It provides guidance on the cancellation process. For
              inquiries or assistance related to cancellations, users are encouraged to contact the
              customer support team at{" "}
              <Anchor href="mailto:contact@jsoncrack.com">contact@jsoncrack.com</Anchor>.
            </Text>
            <Title order={3} c="gray.8">
              Cancellation Policy
            </Title>
            <Text c="gray.8">
              You have the right to cancel your subscription at any time. When you cancel, your
              subscription will remain active until the end of the current billing period. You will
              not be billed for any subsequent periods.
            </Text>
            <Title order={4} c="gray.8">
              How to Cancel:
            </Title>
            <Text c="gray.8">
              To cancel your subscription, follow these steps:
              <List type="ordered" my="lg">
                <List.Item>Log in to your account.</List.Item>
                <List.Item>Click on the account icon at the top right of the editor.</List.Item>
                <List.Item>Select the &quot;Unsubscribe&quot; option.</List.Item>
              </List>
              Please note that subscription cancellations made after the initial 3-day period are
              not eligible for a refund. However, you will still have access to the service until
              the end of the current billing period.
            </Text>
            <Title order={3} c="gray.8">
              Refund Policy
            </Title>
            <Text c="gray.8">
              If you cancel your subscription within 3 days of the initial purchase, you are
              eligible for a full refund. Refunds will be issued to the original payment method used
              during the purchase. For refund inquiries or assistance, please contact our customer
              support team at{" "}
              <Anchor href="mailto:contact@jsoncrack.com">contact@jsoncrack.com</Anchor>.
            </Text>
            <Title order={3} c="gray.8">
              Changes to this Policy
            </Title>
            <Text c="gray.8">
              We reserve the right to modify this subscription cancellation and refund policy at any
              time. Any changes will be effective immediately upon posting the updated policy on our
              website. It is your responsibility to review this policy periodically for changes. By
              subscribing to our service, you agree to abide by the terms and conditions outlined in
              this cancellation and refund policy. Thank you for choosing our service. We appreciate
              the opportunity to address any concerns and improve your experience.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Layout>
  );
};

export default SubscriptionRefund;
