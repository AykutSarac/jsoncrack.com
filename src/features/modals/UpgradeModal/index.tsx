import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  Button,
  Modal,
  Flex,
  Stack,
  Title,
  CloseButton,
  FocusTrap,
  Image,
  Divider,
  List,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import Cookie from "js-cookie";
import { LuCheckCircle } from "react-icons/lu";
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
        <Stack gap="24" px="40" py="20" w="100%">
          <Flex justify="space-between" mr="-20">
            <Title c="bright" fw="500" fz="24">
              Try the new editor!
            </Title>
            <CloseButton onClick={handleCloseModal} />
          </Flex>
          <List
            spacing="4"
            icon={
              <ThemeIcon variant="transparent" radius="xl" size="sm" color="green">
                <LuCheckCircle size="16" />
              </ThemeIcon>
            }
          >
            <List.Item>Large data support</List.Item>
            <List.Item>Custom themes</List.Item>
            <List.Item>Cloud Storage</List.Item>
            <List.Item>Compare Data</List.Item>
            <List.Item>AI-Filter</List.Item>
            <List.Item>API Integration</List.Item>
            <List.Item>
              <Anchor
                href="https://chromewebstore.google.com/detail/todiagram/gpcnkpjdmgihedngamkhendifclghjhn"
                target="_blank"
                rel="noopener"
                c="inherit"
                td="underline"
              >
                Chrome Extension
              </Anchor>
            </List.Item>
          </List>
          <Button
            component="a"
            href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=upgrade_modal"
            target="_blank"
            color="green"
            size="md"
            radius="md"
            fullWidth
            leftSection={
              <Image
                src="https://todiagram.com/logo.svg"
                alt="logo"
                w={20}
                style={{ filter: "grayscale(1) brightness(0) invert(1)" }}
              />
            }
          >
            Open Editor
          </Button>
        </Stack>
      </Flex>
    </Modal>
  );
};
