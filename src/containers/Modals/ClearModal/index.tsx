import React from "react";
import { useRouter } from "next/router";
import type { ModalProps } from "@mantine/core";
import { Modal, Group, Button, Text, Divider } from "@mantine/core";
import { documentSvc } from "src/services/document.service";
import useJson from "src/store/useJson";

export const ClearModal = ({ opened, onClose }: ModalProps) => {
  const setJson = useJson(state => state.setJson);
  const { query, replace } = useRouter();

  const handleClear = () => {
    setJson("{}");
    onClose();

    if (typeof query.json === "string") {
      documentSvc.delete(query.json);
      replace("/editor");
    }
  };

  return (
    <Modal title="Delete JSON" opened={opened} onClose={onClose} centered>
      <Group py="sm">
        <Text>Are you sure you want to delete JSON?</Text>
      </Group>
      <Divider py="xs" />
      <Group justify="right">
        <Button color="red" onClick={handleClear}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};
