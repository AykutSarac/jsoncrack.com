import React from "react";
import Link from "next/link";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Button } from "@mantine/core";

export const LoginModal = ({ opened, onClose }: ModalProps) => {
  return (
    <Modal title="Sign In" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Button
          variant="default"
          component={Link}
          prefetch={false}
          href="/sign-in"
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
