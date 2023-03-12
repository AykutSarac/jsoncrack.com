import React from "react";
import { Modal, Stack, Button, Text, Title, ModalProps } from "@mantine/core";

export const LoginModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  return (
    <Modal title="Sign In" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Title order={2}>Welcome Back!</Title>
        <Text>Login to unlock full potential of JSON Crack!</Text>
        <Button component="a" href="/sign-in" size="md" fullWidth>
          Sign In
        </Button>
      </Stack>
    </Modal>
  );
};
