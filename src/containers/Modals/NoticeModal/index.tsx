import React from "react";
import type { ModalProps } from "@mantine/core";
import { Anchor, Button, Center, Divider, Group, Modal, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

export const NoticeModal = (props: ModalProps) => {
  const isAuthenticated = useUser(state => state.isAuthenticated);
  const setVisible = useModal(state => state.setVisible);
  const [seenModal, setSeenModal] = useLocalStorage({
    key: "seenNoticeModal",
    defaultValue: false,
    getInitialValueInEffect: false,
  });

  const closeModal = () => {
    setSeenModal(true);
    props.onClose?.();
  };

  if (!isAuthenticated) return null;

  return (
    <Modal
      title={
        <Text c="red" fw={600} fz="lg">
          Important Notice: Changes to Free Version
        </Text>
      }
      opened={!seenModal || props.opened}
      onClose={closeModal}
      centered
      zIndex={1000}
      size="lg"
    >
      <Center></Center>
      <Text>
        Hello,
        <br />
        <br />
        We want to inform you that starting from <b>1 October 2024</b>, the following features will
        be removed from the free version of our service:
        <br />
        <br />
        • Sign-in / Sign-up
        <br />
        • Cloud Storage
        <br />
        • Share
        <br />
        <br />
        <Text fw={500}>
          Any cloud-stored data that has not been accessed in the past 4 months will be
          automatically deleted at 1 October 2024.
        </Text>
        <br />
        To ensure you don&apos;t lose any important data, please download your data before the
        deadline. If you wish to continue using these features, we recommend upgrading to{" "}
        <Anchor href="https://todiagram.com" target="_blank">
          ToDiagram
        </Anchor>
        , which will allow you to retain full access to these services and more.
        <br />
        <br />
        Thank you for your understanding and continued support.
      </Text>
      <Divider my="xs" />
      <Group justify="right">
        <Button color="gray" variant="subtle" onClick={closeModal}>
          Close
        </Button>
        <Button
          variant="default"
          onClick={() => {
            setVisible("cloud")(true);
            closeModal();
          }}
        >
          Open Cloud
        </Button>
      </Group>
    </Modal>
  );
};
