import React from "react";
import { useRouter } from "next/router";
import type { ModalProps } from "@mantine/core";
import {
  TextInput,
  Stack,
  Modal,
  Button,
  CopyButton,
  Tooltip,
  ActionIcon,
  Text,
} from "@mantine/core";
import { event as gaEvent } from "nextjs-google-analytics";
import { FiExternalLink } from "react-icons/fi";
import { MdCheck, MdCopyAll } from "react-icons/md";

export const ShareModal = ({ opened, onClose }: ModalProps) => {
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
                  <ActionIcon
                    color={copied ? "teal" : "gray"}
                    onClick={() => {
                      copy();
                      gaEvent("copy_share_link");
                    }}
                  >
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
        <Button
          component="a"
          color="green"
          target="_blank"
          href="/docs"
          leftSection={<FiExternalLink />}
          fullWidth
        >
          Learn How to Embed
        </Button>
      </Stack>
    </Modal>
  );
};
