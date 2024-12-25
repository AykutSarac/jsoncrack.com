import React from "react";
import type { ModalProps } from "@mantine/core";
import { Button, Modal, FocusTrap, Image, Text, Group, Divider } from "@mantine/core";
import Cookie from "js-cookie";
import useConfig from "src/store/useConfig";

export const UpgradeModal = ({ opened, onClose }: ModalProps) => {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  const handleCloseModal = () => {
    Cookie.set("upgrade_shown", "true", { expires: 3 });
    onClose();
  };

  return (
    <Modal
      size="500"
      opened={opened}
      onClose={handleCloseModal}
      zIndex={1001}
      centered
      radius="md"
      overlayProps={{ blur: 2 }}
      withCloseButton={false}
      closeOnClickOutside={false}
    >
      <FocusTrap.InitialFocus />
      <Image
        src={`/assets/diagram-${darkmodeEnabled ? "dark" : "light"}.png`}
        alt="diagram"
        width="auto"
        style={{
          filter: "drop-shadow(4px -3px 3px rgba(0, 0, 0, 0.2))",
        }}
      />
      <Divider mx="-md" />
      <Text ta="center" fz="md" mt="lg">
        We&apos;ve been working on something big -{" "}
        <Text component="span" fw="bold" inherit>
          Ready to explore?
        </Text>
      </Text>
      <Group mt="md" justify="space-between">
        <Button variant="default" size="md" onClick={handleCloseModal}>
          Not now
        </Button>
        <Button
          component="a"
          href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=upgrade_modal"
          target="_blank"
          color="red"
          size="md"
          leftSection={
            <Image
              src="https://todiagram.com/logo.svg"
              alt="logo"
              w={20}
              style={{ filter: "grayscale(1) brightness(0) invert(1)" }}
            />
          }
        >
          Try ToDiagram!
        </Button>
      </Group>
    </Modal>
  );
};
