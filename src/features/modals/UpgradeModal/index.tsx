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
} from "@mantine/core";
import { LuCrown, LuTrendingUp } from "react-icons/lu";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal
      size="430"
      opened={opened}
      onClose={onClose}
      zIndex={1001}
      centered
      radius="lg"
      withCloseButton={false}
      styles={{ body: { padding: 0 } }}
      overlayProps={{ blur: 2 }}
    >
      <FocusTrap.InitialFocus />
      <Flex>
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
                New diagram structure
              </Title>
              <Text fz="14" c="dimmed">
                50% less size, faster & customizable!
              </Text>
            </Stack>
          </Flex>
          <Flex gap="20">
            <ThemeIcon color="violet" variant="light" size="xl" radius="xl">
              <LuTrendingUp size="20" />
            </ThemeIcon>
            <Stack gap="4">
              <Title c="gray" order={3} fw="500" fz="16">
                Powerful
              </Title>
              <Text fz="14" c="dimmed">
                Modify data, preview images, inspect nodes, and more!
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
            Try premium for free, no registration
          </Button>
          <Button size="md" variant="subtle" color="gray" radius="md" onClick={onClose}>
            Maybe later
          </Button>
        </Stack>
      </Flex>
    </Modal>
  );
};
