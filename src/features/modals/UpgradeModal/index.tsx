import React from "react";
import Link from "next/link";
import type { FlexProps, ModalProps } from "@mantine/core";
import {
  Modal,
  Text,
  Flex,
  List,
  ThemeIcon,
  Divider,
  Button,
  Group,
  Anchor,
  Image,
  Box,
} from "@mantine/core";
import Cookie from "js-cookie";
import { LuCheck } from "react-icons/lu";
import { Logo } from "src/features/editor/Toolbar/Logo";
import useConfig from "src/store/useConfig";

export const UpgradeContent = (props: FlexProps) => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  return (
    <Flex direction="column" gap="0" {...props}>
      <Flex gap="xl">
        <List
          icon={
            <ThemeIcon color="green" variant="transparent">
              <LuCheck />
            </ThemeIcon>
          }
        >
          <List.Item>Load larger datasets (100x more)</List.Item>
          <List.Item>See parent-child relationships</List.Item>
          <List.Item>Modify data from diagrams</List.Item>
        </List>
        <List
          icon={
            <ThemeIcon color="green" variant="transparent">
              <LuCheck />
            </ThemeIcon>
          }
        >
          <List.Item>Customization options</List.Item>
          <List.Item>Improved UI & Tools</List.Item>
          <List.Item>
            <Anchor
              href="https://chromewebstore.google.com/detail/todiagram/gpcnkpjdmgihedngamkhendifclghjhn"
              rel="noopener"
              target="_blank"
              inherit
            >
              Chrome Extension
            </Anchor>
          </List.Item>
        </List>
      </Flex>
      <Box mt="lg">
        <Image
          src={`/assets/diagram-${darkmodeEnabled ? "dark" : "light"}.png`}
          alt="diagram"
          mah="120"
          fit="cover"
          mx="auto"
          width="auto"
          style={{
            filter: "drop-shadow(3px -3px 2px rgba(0, 0, 0, 0.2))",
            objectPosition: "top",
          }}
        />
        <Divider maw="600" w="100%" mb="lg" />
      </Box>
    </Flex>
  );
};

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const handleCloseModal = () => {
    Cookie.set("upgrade_shown", "true", { expires: 3 });
    onClose();
  };

  return (
    <Modal
      size="auto"
      opened={opened}
      onClose={handleCloseModal}
      zIndex={1001}
      centered
      radius="md"
      overlayProps={{ blur: 2 }}
      withCloseButton={false}
      closeOnClickOutside={false}
      title={
        <Flex align="center" gap="sm">
          <Logo />
          <Text fz="lg" fw="600">
            Upgrade to New Editor
          </Text>
        </Flex>
      }
    >
      <UpgradeContent />
      <Group justify="space-between">
        <Button onClick={handleCloseModal} color="gray" variant="subtle">
          Maybe later
        </Button>
        <Link
          href="https://todiagram.com/?utm_source=jsoncrack&utm_medium=upgrade_modal"
          rel="noopener"
          target="_blank"
        >
          <Button onClick={handleCloseModal} color="gray" variant="outline">
            Try for Free &rarr;
          </Button>
        </Link>
      </Group>
    </Modal>
  );
};
