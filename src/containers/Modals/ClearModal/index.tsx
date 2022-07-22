import React from "react";
import toast from "react-hot-toast";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";
import useConfig from "src/hooks/store/useConfig";

export const ClearModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const updateJson = useConfig((state) => state.updateJson);

  const handleClear = () => {
    updateJson("{}");
    toast.success(`Cleared JSON and removed from memory.`);
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
