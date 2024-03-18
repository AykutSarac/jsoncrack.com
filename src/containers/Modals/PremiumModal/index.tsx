import React from "react";
import {
  Modal,
  ModalProps,
  Title,
  Flex,
  Button,
  Stack,
  List,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { BsCheck } from "react-icons/bs";

export const PremiumModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  return (
    <Modal title="Your Plan" size="auto" opened={opened} onClose={onClose} centered zIndex={202}>
      <Flex gap="lg">
        <Stack gap="xs">
          <Title order={3}>Free plan</Title>
          <Button variant="filled" color="dark" size="md">
            Your current plan
          </Button>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="dark.6" size={20} radius="xl">
                <BsCheck size="1rem" />
              </ThemeIcon>
            }
          >
            <List.Item>Store/Share up to 15 files</List.Item>
            <List.Item>Visualize standard size data</List.Item>
          </List>
        </Stack>
        <Divider color="gray" orientation="vertical" />
        <Stack gap="xs">
          <Title order={3}>JSON Crack Plus</Title>
          <Button
            component="a"
            href="https://pro.jsoncrack.com/pricing"
            target="_blank"
            variant="filled"
            color="teal"
            size="md"
          >
            Upgrade plan
          </Button>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={20} radius="xl">
                <BsCheck size="1rem" />
              </ThemeIcon>
            }
          >
            <List.Item>Edit directly on graph</List.Item>
            <List.Item>JSON Schema support</List.Item>
            <List.Item>Visualize data at full capability</List.Item>
            <List.Item>Save & share up to 200 files</List.Item>
          </List>
        </Stack>
      </Flex>
    </Modal>
  );
};
