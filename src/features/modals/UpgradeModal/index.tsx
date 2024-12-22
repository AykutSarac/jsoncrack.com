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
import Cookie from "js-cookie";
import { LuCrown, LuTrendingUp } from "react-icons/lu";
import useConfig from "src/store/useConfig";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  const handleCloseModal = () => {
    Cookie.set("upgrade_shown", "true", { expires: 3 });
    onClose();
  };

  return (
    <Modal
      size="700"
      opened={opened}
      onClose={handleCloseModal}
      zIndex={1001}
      centered
      radius="lg"
      withCloseButton={false}
      styles={{ body: { padding: 0 } }}
      overlayProps={{ blur: 2 }}
    >
      <FocusTrap.InitialFocus />
      <Flex>
        <Image
          src={`/assets/hp-${darkmodeEnabled ? "dark" : "light"}.png`}
          alt="diagram"
          maw={300}
          height="auto"
          style={{ objectPosition: "left" }}
        />
        <Divider orientation="vertical" />
        <Stack gap="24" px="40" py="20">
          <Flex justify="space-between">
            <Title c="bright" fw="500" fz="24">
              Upgrade to unlock all features
            </Title>
            <CloseButton onClick={handleCloseModal} />
          </Flex>
          <Flex gap="20">
            <ThemeIcon color="violet" variant="light" size="xl" radius="xl">
              <LuCrown size="20" />
            </ThemeIcon>
            <Stack gap="4">
              <Title c="gray" order={3} fw="500" fz="16">
                Load larger files
              </Title>
              <Text fz="14" c="dimmed">
                We made it easy to visualize, format, and explore JSON data, faster than ever.
              </Text>
            </Stack>
          </Flex>
          <Flex gap="20">
            <ThemeIcon color="violet" variant="light" size="xl" radius="xl">
              <LuTrendingUp size="20" />
            </ThemeIcon>
            <Stack gap="4">
              <Title c="gray" order={3} fw="500" fz="16">
                Powerful, colorful editor
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
          <Button size="md" variant="subtle" color="gray" radius="md" onClick={handleCloseModal}>
            Maybe later
          </Button>
        </Stack>
      </Flex>
    </Modal>
  );
};
