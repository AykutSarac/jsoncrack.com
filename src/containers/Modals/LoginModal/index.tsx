import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Button } from "@mantine/core";

export const LoginModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal title="Sign In" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Button
          variant="default"
          component="a"
          href="https://app.jsoncrack.com/sign-in"
          rel="noreferrer"
          size="md"
          fullWidth
        >
          Sign in to continue
        </Button>
      </Stack>
    </Modal>
  );
};
