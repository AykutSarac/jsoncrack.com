import React from "react";
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
  Badge,
} from "@mantine/core";
import styled from "styled-components";
import Cookie from "js-cookie";
import { FaPlay } from "react-icons/fa6";
import { GoDependabot } from "react-icons/go";
import { LuCheck, LuGitCompareArrows, LuInfinity, LuPencilRuler } from "react-icons/lu";
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

const StyledFeatureItem = styled.div`
  @property --gradient-1 {
    syntax: "<number>";
    initial-value: 0;
    inherits: false;
  }
  @property --gradient-2 {
    syntax: "<number>";
    initial-value: 0;
    inherits: false;
  }
  @property --gradient-3 {
    syntax: "<number>";
    initial-value: 0;
    inherits: false;
  }

  background-image:
    radial-gradient(
      65% 110% at 50% 0,
      rgba(168, 92, 92, var(--gradient-1)) 0,
      rgba(103, 69, 69, 0) 100%
    ),
    radial-gradient(
      66% 135% at 77% 23%,
      rgba(4, 0, 255, var(--gradient-2)) 0,
      hsla(68, 15%, 59%, 0) 80%
    ),
    radial-gradient(
      125% 234% at 10% 142%,
      rgba(217, 126, 75, var(--gradient-3)) 0,
      hsla(0, 0%, 100%, 0) 37%
    );
  transition:
    --gradient-1 0.3s,
    --gradient-2 0.3s,
    --gradient-3 0.3s;
  padding: 12px 16px;
  background-color: rgba(27, 23, 40, 0.025);
  border: 1px solid rgba(142, 142, 142, 0.35);
  border-radius: 0.5rem;
  max-width: 350px;
  cursor: pointer;

  &.selected {
    --gradient-1: 0.1;
    --gradient-2: 0.15;
    --gradient-3: 0.15;
    border-color: rgba(130, 174, 255, 0.567);
  }

  &:hover {
    --gradient-1: 0.1;
    --gradient-2: 0.15;
    --gradient-3: 0.15;
  }
`;

const FeatureCard = (props: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}) => {
  return (
    <StyledFeatureItem className={props.selected ? "selected" : ""} onClick={props.onClick}>
      <Flex gap="md" align="flex-start">
        <ThemeIcon variant="light" color="grape" radius="xl" size="36">
          {props.icon}
        </ThemeIcon>
        <Stack gap="4">
          <Flex justify="space-between" align="center">
            <Text fz="md" fw="600" c="bright">
              {props.title}
            </Text>
            <ThemeIcon variant="transparent" color="grape">
              {props.selected ? <LuCheck size={20} /> : null}
            </ThemeIcon>
          </Flex>
          <Text fz="sm" c="gray" opacity={0.8}>
            {props.description}
          </Text>
        </Stack>
      </Flex>
    </StyledFeatureItem>
  );
};

const FEATURES = [
  {
    title: "No File Size Limits",
    description: "Load and edit even the largest data files without restrictions.",
    icon: <LuInfinity size={20} />,
  },
  {
    title: "Visual Data Editing",
    description: "Edit JSON, YAML, CSV, and XML directly on the diagram.",
    icon: <LuPencilRuler size={20} />,
  },
  {
    title: "Live JSON Schema Validation",
    description: "Instantly see invalid fields highlighted in red on the diagram.",
    icon: <LuGitCompareArrows size={20} />,
  },
  {
    title: "AI Assistant",
    description: "Use AI to filter and transform data based on your needs.",
    icon: <GoDependabot size={20} />,
  },
];

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const [selectedFeature, setSelectedFeature] = React.useState(0);

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
    >
      <FocusTrap.InitialFocus />
      <Flex>
        <Stack>
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              onClick={() => setSelectedFeature(index)}
              selected={selectedFeature === index}
            />
          ))}
        </Stack>
        <Divider orientation="vertical" mx="md" />
        <Box>
          <Flex justify="center" align="center" gap="xs">
            <Badge size="xl" radius="sm" variant="light" color="teal" ml="auto">
              🔥 NEW
            </Badge>
            <Text fz="24" fw="700" c="bright">
              ToDiagram Editor
            </Text>
            <CloseButton ml="auto" onClick={handleCloseModal} />
          </Flex>
          <Image
            mt="sm"
            src={`/assets/td-${selectedFeature + 1}.webp`}
            w="100%"
            maw="385"
            radius="md"
            alt="upgrade"
            fit="contain"
          />
          <Group justify="center" gap="xs" mt="md">
            <Button
              component="a"
              href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=upgrade_modal"
              rel="noopener"
              target="_blank"
              radius="lg"
              size="lg"
              c="black"
              autoContrast
              variant="gradient"
              gradient={{ from: "#FF75B7", to: "#FED761" }}
              leftSection={<FaPlay />}
              fullWidth
              fw="600"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.12) 0px -3px 0px 0px inset",
                border: "none",
              }}
            >
              Upgrade now
            </Button>
          </Group>
        </Box>
      </Flex>
    </Modal>
  );
};
