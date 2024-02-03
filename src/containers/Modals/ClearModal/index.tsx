import React from "react";
import { useSearchParams, redirect } from "next/navigation";
import { Modal, Group, Button, Text, Divider, ModalProps } from "@mantine/core";
import { documentSvc } from "src/services/document.service";
import useJson from "src/store/useJson";

export const ClearModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setJson = useJson(state => state.setJson);
  const searchParams = useSearchParams();
  const queryJson = searchParams?.get("json");

  const handleClear = () => {
    setJson("{}");
    onClose();

    if (typeof queryJson === "string") {
      documentSvc.delete(queryJson);
      redirect("/editor");
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
