import React from "react";
import Link from "next/link";
import type { ModalProps } from "@mantine/core";
import { Text, Divider, List, Button, Modal } from "@mantine/core";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdChevronRight } from "react-icons/md";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal
      title={
        <Text c="bright" fz="h2" fw={600}>
          Upgrade
        </Text>
      }
      size="md"
      opened={opened}
      onClose={onClose}
      zIndex={1001}
      centered
    >
      <Divider mb="xs" fz="md" labelPosition="left" label="Included features" color="dimmed" />
      <List spacing="6" c="gray" icon={<IoMdCheckmarkCircleOutline size="24" color="#16a34a" />}>
        <List.Item>Larger data support up to 4 MB</List.Item>
        <List.Item>Edit data directly on visualizations</List.Item>
        <List.Item>Compare data differences on graphs</List.Item>
        <List.Item>AI-powered data filter</List.Item>
        <List.Item>Customizable graph colors</List.Item>
        <List.Item>Tabs for multiple documents</List.Item>
        <List.Item>...and more</List.Item>
      </List>
      <Link href="https://todiagram.com/#preview" target="_blank" passHref>
        <Button
          color="green"
          fullWidth
          mt="md"
          size="md"
          fw={500}
          radius="md"
          rightSection={<MdChevronRight size="24" />}
        >
          See more
        </Button>
      </Link>
    </Modal>
  );
};
