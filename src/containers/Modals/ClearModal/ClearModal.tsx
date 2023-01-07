import React from "react";
import { useRouter } from "next/router";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";
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
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Delete JSON</Modal.Header>
      <Modal.Content>Are you sure you want to delete JSON?</Modal.Content>
      <Modal.Controls setVisible={setVisible}>
        <Button status="DANGER" onClick={handleClear}>
          Confirm
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
