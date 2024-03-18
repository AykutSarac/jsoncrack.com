import React from "react";
import { Modal, Button, ModalProps, Textarea, Divider, Group } from "@mantine/core";
import { decode } from "jsonwebtoken";
import useFile from "src/store/useFile";

export const JWTModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setContents = useFile(state => state.setContents);
  const [token, setToken] = React.useState("");

  const resolve = () => {
    if (!token) return;
    const json = decode(token);

    setContents({ contents: JSON.stringify(json, null, 2) });
    setToken("");
    onClose();
  };

  return (
    <Modal title="Decode JSON Web Token" opened={opened} onClose={onClose} centered>
      <Textarea
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikhlcm93YW5kIiwidXJsIjoiaHR0cHM6Ly9oZXJvd2FuZC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.Tmm3Miq6KWCF_QRn3iERhhXThJzv4LQPKYwBhYUld88"
        value={token}
        onChange={e => setToken(e.target.value)}
        autosize
        minRows={5}
        data-autofocus
      />
      <Divider my="md" />
      <Group justify="right">
        <Button onClick={resolve}>Resolve</Button>
      </Group>
    </Modal>
  );
};
