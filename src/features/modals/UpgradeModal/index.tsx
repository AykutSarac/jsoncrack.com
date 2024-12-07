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
  CloseButton,
  FocusTrap,
  Image,
  Divider,
} from "@mantine/core";
import { LuCrown, LuTrendingUp } from "react-icons/lu";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal
      size="800"
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
      <Flex>
        <Image src="./assets/todiagram_img.webp" alt="todiagram" w="350" fit="contain" px="lg" />
        <Divider orientation="vertical" />
        <Stack gap="24" px="40" py="20">
          <Flex justify="space-between">
            <Title c="bright" fw="500" fz="24">
              Upgrade to unlock all features
            </Title>
            <CloseButton onClick={onClose} />
          </Flex>
          <Flex gap="20">
            <ThemeIcon color="violet" variant="light" size="xl" radius="xl">
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
            <ThemeIcon color="violet" variant="light" size="xl" radius="xl">
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
          <Button
            component="a"
            href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=upgrade_modal"
            target="_blank"
            mb="-16"
            color="violet"
            size="md"
            radius="md"
            leftSection={<LuCrown />}
          >
            Try premium for free
          </Button>
          <Button size="md" variant="subtle" color="gray" radius="md" onClick={onClose}>
            Maybe later
          </Button>
        </Stack>
      </Flex>
    </Modal>
  );
};
