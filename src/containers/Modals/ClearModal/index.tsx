import React from "react";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";
import useGraph from "src/store/useGraph";

export const ClearModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const setJson = useGraph(state => state.setJson);

  const handleClear = () => {
    setJson("{}");
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Clear JSON</Modal.Header>
      <Modal.Content>Are you sure you want to clear JSON?</Modal.Content>
      <Modal.Controls setVisible={setVisible}>
        <Button status="DANGER" onClick={handleClear}>
          Confirm
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
