import React from "react";
import { altogic } from "src/api/altogic";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";

export const LoginModal: React.FC<ModalProps> = ({ setVisible, visible }) => {
  const handleLoginClick = () => {
    altogic.auth.signInWithProvider("google");
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Login</Modal.Header>
      <Modal.Content>
        <h2>Welcome Back!</h2>
        <p>Login to unlock full potential of JSON Crack!</p>
        <Button onClick={handleLoginClick} status="SECONDARY" block>
          Login
        </Button>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
