import React from "react";
import Link from "next/link";
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
    <Modal title="Upgrade Plan" size="auto" opened={opened} onClose={onClose} centered zIndex={202}>
      <Flex gap="lg" justify="center" px="md">
        <Stack gap="xs">
          <Title order={3}>Free plan</Title>
          <Button variant="outline" color="dark" size="md">
            Your current plan
          </Button>
          <List
            mt="xs"
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="dark.6" size={20} radius="xl">
                <BsCheck size="1rem" />
              </ThemeIcon>
            }
          >
            <List.Item>Limited capability visualization</List.Item>
            <List.Item>Store/Share up to 15 files</List.Item>
          </List>
        </Stack>
        <Divider color="gray" orientation="vertical" />
        <Stack gap="xs">
          <Title order={3}>JSON Crack Pro</Title>
          <Button
            component={Link}
            prefetch={false}
            href="/pricing"
            target="_blank"
            variant="filled"
            color="teal"
            size="md"
          >
            Upgrade plan
          </Button>
          <List
            mt="xs"
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon color="teal" size={20} radius="xl">
                <BsCheck size="1rem" />
              </ThemeIcon>
            }
          >
            <List.Item>5X Faster visualizations, no lagging</List.Item>
            <List.Item>Accurate and compact graphs</List.Item>
            <List.Item>Edit data through visualizations</List.Item>
            <List.Item>Visualize data up to 5 MBs</List.Item>
            <List.Item>Compare data on graphs</List.Item>
            <List.Item>Save & share up to 200 files</List.Item>
          </List>
        </Stack>
      </Flex>
    </Modal>
  );
};
