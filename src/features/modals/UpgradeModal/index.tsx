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
  CloseButton,
  FocusTrap,
} from "@mantine/core";
import Cookie from "js-cookie";
import { LuCheck, LuZap } from "react-icons/lu";
import useConfig from "../../../store/useConfig";

export const UpgradeContent = (props: FlexProps) => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  return (
    <Flex direction="column" gap="0" {...props}>
      <Flex justify="center" gap="60" px="sm">
        <List
          center
          c="bright"
          fz="lg"
          spacing="xs"
          icon={
            <ThemeIcon color="green" variant="transparent">
              <LuCheck size="18" />
            </ThemeIcon>
          }
        >
          <List.Item>No size limit</List.Item>
          <List.Item>Editable diagrams</List.Item>
          <List.Item>Fast and optimized</List.Item>
        </List>
        <List
          center
          c="bright"
          fz="lg"
          spacing="xs"
          icon={
            <ThemeIcon color="green" variant="transparent">
              <LuCheck size="18" />
            </ThemeIcon>
          }
        >
          <List.Item>Custom themes</List.Item>
          <List.Item>Modern UI</List.Item>
          <List.Item>
            <Anchor
              href="https://chromewebstore.google.com/detail/todiagram/gpcnkpjdmgihedngamkhendifclghjhn"
              rel="noopener"
              target="_blank"
              inherit
              c="teal"
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
      size="lg"
      opened={opened}
      onClose={handleCloseModal}
      zIndex={1001}
      centered
      radius="md"
      overlayProps={{ blur: 2 }}
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <FocusTrap.InitialFocus />
      <Flex justify="center" align="center" gap="xs">
        <Image
          ml="auto"
          pl="28"
          src="https://todiagram.com/logo-64x64.png"
          alt="todiagram"
          width={30}
          height={30}
        />
        <Text fz="24" fw="600" c="bright">
          Try JSON Crack 2.0
        </Text>
        <CloseButton ml="auto" onClick={handleCloseModal} />
      </Flex>
      <UpgradeContent direction="column-reverse" />
      <Group justify="center" gap="lg" mt="xl">
        <Button size="md" onClick={handleCloseModal} color="gray" variant="light">
          Maybe later
        </Button>
        <Link
          href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=upgrade_modal"
          rel="noopener"
          target="_blank"
        >
          <Button size="md" onClick={handleCloseModal} leftSection={<LuZap />} color="teal">
            Try for free &rarr;
          </Button>
        </Link>
      </Group>
    </Modal>
  );
};
