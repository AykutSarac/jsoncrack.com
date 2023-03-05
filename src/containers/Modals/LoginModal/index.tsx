import React from "react";
import { Modal, Stack, Button, Text, Title } from "@mantine/core";
import { ModalProps } from "src/components/Modal";

export const LoginModal: React.FC<ModalProps> = ({ setVisible, visible }) => {
  return (
    <Modal title="Sign In" opened={visible} onClose={() => setVisible(false)} centered>
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
