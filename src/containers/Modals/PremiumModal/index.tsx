import React from "react";
import Link from "next/link";
import { Modal, Group, Button, Divider, ModalProps, Title, Image } from "@mantine/core";
import { IoRocketSharp } from "react-icons/io5";

export const PremiumModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  return (
    <Modal title="JSON Crack Premium" opened={opened} onClose={onClose} centered>
      <Group py="sm">
        <Title
          variant="gradient"
          order={3}
          gradient={{ from: "yellow", to: "hotpink" }}
          strikethrough
          align="center"
        >
          Enhance your experience, unlock full benefits of JSON Crack!
        </Title>
        <Image mx="auto" src="assets/bunny.png" width={150} alt="bunny" />
      </Group>
      <Divider py="xs" />
      <Group position="center">
        <Link href="/pricing" target="_blank" rel="noreferrer">
          <Button
            variant="gradient"
            gradient={{ from: "yellow", to: "hotpink" }}
            leftIcon={<IoRocketSharp />}
          >
            UPGRADE TO PREMIUM!
          </Button>
        </Link>
      </Group>
    </Modal>
  );
};
