import React from "react";
import { useRouter } from "next/router";
import { Modal, Group, Button, Text, Divider } from "@mantine/core";
import { ModalProps } from "src/components/Modal";
import { deleteJson } from "src/services/db/json";
import useJson from "src/store/useJson";

export const ClearModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const setJson = useJson(state => state.setJson);
  const { query, replace } = useRouter();

  const handleClear = () => {
    setJson("{}");
    setVisible(false);

    if (typeof query.json === "string") {
      deleteJson(query.json);
      replace("/editor");
    }
  };

  return (
    <Modal title="Delete JSON" opened={visible} onClose={() => setVisible(false)} centered>
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
