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
  Text,
  Badge,
} from "@mantine/core";
import { BsCheck } from "react-icons/bs";

export const PremiumModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  return (
    <Modal title="Your Plan" size="auto" opened={opened} onClose={onClose} centered>
      <Flex gap="lg">
        <Stack spacing="xs">
          <Title order={3}>
            Free plan
            <Text size="sm" color="dimmed">
              (Free)
            </Text>
          </Title>
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
            <List.Item>Store up to 15 files</List.Item>
            <List.Item>Visualize standard size data</List.Item>
          </List>
        </Stack>
        <Divider color="gray" orientation="vertical" />
        <Stack spacing="xs">
          <Title order={3}>
            JSON Crack Plus
            <Text size="sm" color="dimmed">
              USD 5$/mo
            </Text>
          </Title>
          <Button
            component="a"
            href="https://www.patreon.com/join/herowand/checkout?rid=8549056"
            variant="filled"
            color="teal"
            size="md"
            target="_blank"
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
            <List.Item>JSON Schema support</List.Item>
            <List.Item>Visualize data at full capability</List.Item>
            <List.Item>Save & share up to 200 files</List.Item>
            <List.Item>No Ads</List.Item>
            <List.Item
              icon={
                <ThemeIcon color="dark.5" size={20} radius="xl">
                  <BsCheck size="1rem" />
                </ThemeIcon>
              }
            >
              Edit directly on graph <Badge>Soon</Badge>
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon color="dark.5" size={20} radius="xl">
                  <BsCheck size="1rem" />
                </ThemeIcon>
              }
            >
              Gerenate links from API <Badge>Soon</Badge>
            </List.Item>
          </List>
        </Stack>
      </Flex>
    </Modal>
  );
};
