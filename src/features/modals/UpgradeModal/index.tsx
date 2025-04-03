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
  Stack,
  Paper,
} from "@mantine/core";
import Cookie from "js-cookie";
import { GoDependabot } from "react-icons/go";
import {
  LuCheck,
  LuChevronRight,
  LuGitCompareArrows,
  LuInfinity,
  LuPencilRuler,
} from "react-icons/lu";
import useConfig from "../../../store/useConfig";

export const UpgradeContent = (props: FlexProps) => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  return (
    <Flex direction="column" gap="0" {...props}>
      <Flex justify="space-between" gap="4" px="sm" wrap="wrap">
        <List
          center
          c="bright"
          fz="lg"
          spacing="4"
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
          spacing="4"
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

const FeatureCard = (props: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <Paper withBorder p="xs" radius="md">
      <Flex gap="md" align="flex-start">
        <ThemeIcon variant="light" color="teal" radius="xl" size="36">
          {props.icon}
        </ThemeIcon>
        <Stack gap="4">
          <Text fz="md" fw="600" c="bright">
            {props.title}
          </Text>
          <Text fz="sm" c="gray" opacity={0.8}>
            {props.description}
          </Text>
        </Stack>
      </Flex>
    </Paper>
  );
};

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const handleCloseModal = () => {
    Cookie.set("upgrade_shown", "true", { expires: 3 });
    onClose();
  };

  return (
    <Modal
      size="xl"
      opened={opened}
      onClose={handleCloseModal}
      zIndex={1001}
      centered
      radius="md"
      overlayProps={{ blur: 2 }}
      withCloseButton={false}
    >
      <FocusTrap.InitialFocus />
      <Flex>
        <Stack>
          <FeatureCard
            title="No File Size Limits"
            description="Load and edit even the largest data files without restrictions."
            icon={<LuInfinity size={20} />}
          />
          <FeatureCard
            title="Visual Data Editing"
            description="Edit JSON, YAML, CSV, and XML directly on the diagram."
            icon={<LuPencilRuler size={20} />}
          />
          <FeatureCard
            title="Live JSON Schema Validation"
            description="Instantly see invalid fields highlighted in red on the diagram."
            icon={<LuGitCompareArrows size={20} />}
          />
          <FeatureCard
            title="AI Assistant"
            description="Use AI to filter and transform data based on your needs."
            icon={<GoDependabot size={20} />}
          />
        </Stack>
        <Divider orientation="vertical" mx="md" />
        <Box>
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
              JSON Crack 2.0
            </Text>
            <CloseButton ml="auto" onClick={handleCloseModal} />
          </Flex>
          <UpgradeContent direction="column-reverse" maw="400" />
          <Group justify="center" gap="xs" mt="md">
            <Button
              component={Link}
              href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=upgrade_modal"
              rel="noopener"
              target="_blank"
              fz="lg"
              fw="600"
              size="md"
              rightSection={<LuChevronRight />}
              color="green"
              fullWidth
            >
              Try now
            </Button>
          </Group>
        </Box>
      </Flex>
    </Modal>
  );
};
