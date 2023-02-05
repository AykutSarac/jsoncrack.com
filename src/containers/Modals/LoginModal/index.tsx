import React from "react";
import { useRouter } from "next/router";
import { Button } from "src/components/Button";
import { Modal, ModalProps } from "src/components/Modal";

export const LoginModal: React.FC<ModalProps> = ({ setVisible, visible }) => {
  const { replace } = useRouter();

  const onSignIn = () => {
    replace("/sign-in");
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Login</Modal.Header>
      <Modal.Content>
        <h2>Welcome Back!</h2>
        <p>Login to unlock full potential of JSON Crack!</p>
        <Button onClick={onSignIn} status="SECONDARY" block>
          Sign In
        </Button>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible} />
    </Modal>
  );
};
