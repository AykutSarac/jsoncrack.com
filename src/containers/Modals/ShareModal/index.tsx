import React from "react";
import { useRouter } from "next/router";
import {
  TextInput,
  Stack,
  Modal,
  Button,
  CopyButton,
  Tooltip,
  ActionIcon,
  Text,
  ModalProps,
} from "@mantine/core";
import { MdCheck, MdCopyAll } from "react-icons/md";

export const ShareModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const { query } = useRouter();
  const shareURL = `https://jsoncrack.com/editor?json=${query.json}`;

  return (
    <Modal title="Create a Share Link" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Text fz="sm" fw={700}>
          Share Link
        </Text>
        <TextInput
          value={shareURL}
          type="url"
          readOnly
          rightSection={
            <CopyButton value={shareURL} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                  <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                    {copied ? <MdCheck size="1rem" /> : <MdCopyAll size="1rem" />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          }
        />
        <Text fz="sm" fw={700}>
          Embed into your website
        </Text>
        <Button component="a" color="green" target="_blank" href="/docs" fullWidth>
          Learn How to Embed
        </Button>
      </Stack>
    </Modal>
  );
};
