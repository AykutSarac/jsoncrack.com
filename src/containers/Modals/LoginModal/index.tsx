import React from "react";
import Link from "next/link";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";

export const LoginModal: React.FC<ModalProps> = ({ setVisible, visible }) => {
  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Login</Modal.Header>
      <Modal.Content>
        <h2>Welcome Back!</h2>
        <p>Login to unlock full potential of JSON Crack!</p>
        <Link href="/sign-in">
          <Button onClick={() => setVisible(false)} status="SECONDARY" block>
            Sign In
          </Button>
        </Link>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
