import React from "react";
import { Stack, Modal, Button, ModalProps, Textarea } from "@mantine/core";
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
      <Stack py="sm">
        <Textarea
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikhlcm93YW5kIiwidXJsIjoiaHR0cHM6Ly9oZXJvd2FuZC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.Tmm3Miq6KWCF_QRn3iERhhXThJzv4LQPKYwBhYUld88"
          value={token}
          onChange={e => setToken(e.target.value)}
          fz="sm"
          fw={700}
          minRows={8}
          data-autofocus
        >
          Share Link
        </Textarea>
        <Button onClick={resolve} fullWidth>
          Resolve
        </Button>
      </Stack>
    </Modal>
  );
};
