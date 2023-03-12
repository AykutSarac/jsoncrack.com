import React from "react";
import { useRouter } from "next/router";
import { Modal, Group, Button, Text, Divider, ModalProps } from "@mantine/core";
import { deleteJson } from "src/services/db/json";
import useJson from "src/store/useJson";

export const ClearModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setJson = useJson(state => state.setJson);
  const { query, replace } = useRouter();

  const handleClear = () => {
    setJson("{}");
    onClose();

    if (typeof query.json === "string") {
      deleteJson(query.json);
      replace("/editor");
    }
  };

  return (
    <Modal title="Delete JSON" opened={opened} onClose={onClose} centered>
      <Group py="sm">
        <Text>Are you sure you want to delete JSON?</Text>
      </Group>
      <Divider py="xs" />
      <Group position="right">
        <Button color="red" onClick={handleClear}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
};
