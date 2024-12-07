import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Text,
  Button,
  Modal,
  Flex,
  Stack,
  Title,
  ThemeIcon,
  AspectRatio,
  Paper,
  CloseButton,
  FocusTrap,
} from "@mantine/core";
import { LuCrown, LuTrendingUp } from "react-icons/lu";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal
      size="550"
      opened={opened}
      onClose={onClose}
      zIndex={1001}
      centered
      radius="lg"
      withCloseButton={false}
      styles={{ body: { padding: 0 } }}
      overlayProps={{ blur: 1 }}
    >
      <FocusTrap.InitialFocus />
      <Stack gap="24" px="40" py="20">
        <Flex justify="space-between">
          <Title c="bright" fw="500" fz="24">
            Upgrade to unlock all features
          </Title>
          <CloseButton onClick={onClose} />
        </Flex>
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
        <Paper
          p={0}
          w="100%"
          h="fit-content"
          bg="transparent"
          style={{
            overflow: "hidden",
            borderRadius: "12px",
            border: "1px solid #e5e5e5",
            boxShadow:
              "rgba(25, 86, 88, 0.06) 0px 17px 37px 0px, rgba(25, 86, 88, 0.05) 0px 67px 67px 0px",
          }}
        >
          <AspectRatio ratio={1000 / 528} w="100%" h="100%">
            <video
              autoPlay
              muted
              loop
              preload="auto"
              playsInline
              poster="https://todiagram.com/images/meta/design-tokens.webp"
              style={{ display: "block" }}
            >
              <source src="https://todiagram.com/videos/diagrams.mp4" type="video/mp4" />
            </video>
          </AspectRatio>
        </Paper>
        <Button
          component="a"
          href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=upgrade_modal"
          target="_blank"
          mb="-16"
          color="green"
          size="md"
          radius="md"
        >
          Try premium for free
        </Button>
        <Button size="md" variant="subtle" color="gray" radius="md" onClick={onClose}>
          Maybe later
        </Button>
      </Stack>
    </Modal>
  );
};
