import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Text,
  List,
  Button,
  Modal,
  Flex,
  Box,
  Image,
  Stack,
  Title,
  CloseButton,
  ThemeIcon,
} from "@mantine/core";
import { LuCrown, LuPuzzle, LuTrendingUp } from "react-icons/lu";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal
      size="auto"
      opened={opened}
      onClose={onClose}
      zIndex={1001}
      centered
      radius="lg"
      withCloseButton={false}
      styles={{ body: { padding: 0 } }}
      overlayProps={{ blur: 1 }}
    >
      <Flex w="100%" direction="row" justify="space-between">
        <Image
          w="100%"
          maw="400"
          h="auto"
          src="/diagram.png"
          alt="ToDiagram"
          fit="cover"
          visibleFrom="md"
          style={{ borderRight: "1px solid #f0f0f0" }}
        />
        <Box maw="550" w="100%">
          <Flex p="20" justify="end">
            <CloseButton onClick={onClose} />
          </Flex>
          <Stack gap="24" px="40" pb="20">
            <Title c="bright" fw="500" fz="24">
              Upgrade to unlock all features
            </Title>
            <Title c="gray" order={2} fw="500" fz="16">
              Here&apos;s a peak at what you get with ToDiagram:
            </Title>
            <Flex gap="20">
              <ThemeIcon color="green" variant="light" size="xl" radius="xl">
                <LuCrown size="20" />
              </ThemeIcon>
              <Stack gap="4">
                <Title c="gray" order={3} fw="500" fz="16">
                  Accurate & beautiful diagrams
                </Title>
                <Text fz="14" c="dimmed">
                  New diagram structure helps you to understand the data, modify from diagrams,
                  customize colors, preview images.
                </Text>
              </Stack>
            </Flex>
            <Flex gap="20">
              <ThemeIcon color="green" variant="light" size="xl" radius="xl">
                <LuTrendingUp size="20" />
              </ThemeIcon>
              <Stack gap="4">
                <Title c="gray" order={3} fw="500" fz="16">
                  Larger file support, faster performance
                </Title>
                <Text fz="14" c="dimmed">
                  Load up to 4MB without performance issues, open multiple documents, and save work
                  faster.
                </Text>
              </Stack>
            </Flex>
            <Flex gap="20">
              <ThemeIcon color="green" variant="light" size="xl" radius="xl">
                <LuPuzzle size="20" />
              </ThemeIcon>
              <Stack gap="4">
                <Title c="gray" order={3} fw="500" fz="16">
                  The tools you need to succeed
                </Title>
                <Text fz="14" c="dimmed">
                  Compare data on diagrams, use AI-powered filters, and more. Get the tools you need
                  to succeed in your work.
                </Text>
              </Stack>
            </Flex>
            <Title c="bright" mb="-14" order={2} fw="500" fz="16">
              Ready to upgrade?
            </Title>
            <List fz="14">
              <List.Item>Cancel anytime. No risk, no hassle.</List.Item>
              <List.Item>7-day money back guarantee.</List.Item>
            </List>
            <Button
              component="a"
              href="https://todiagram.com/sign-up?utm_source=jsoncrack&utm_medium=upgrade_modal"
              target="_blank"
              mb="-16"
              color="green"
              size="md"
              radius="md"
            >
              Open ToDiagram Editor
            </Button>
            <Button size="md" variant="subtle" color="gray" radius="md">
              Maybe later
            </Button>
          </Stack>
        </Box>
      </Flex>
    </Modal>
  );
};
