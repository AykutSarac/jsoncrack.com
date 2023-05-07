import React from "react";
import {
  Modal,
  Group,
  Button,
  MantineProvider,
  Image,
  Text,
  Paper,
  ModalProps,
  Anchor,
} from "@mantine/core";

export const HerowandModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <Modal title="What's New?" opened={opened} onClose={onClose} centered>
        <Group>
          <Anchor href="https://editor.herowand.com">
            <Paper withBorder>
              <Image
                radius="md"
                mx="auto"
                src="assets/herowand_banner.webp"
                width={400}
                alt="herowand"
              />
            </Paper>
          </Anchor>
        </Group>
        <Text pt="lg">
          Introducing you something new...
          <hr />
          Now, you can visualize not only JSON but also other data formats. Explore Herowand Editor.
        </Text>
        <Group pt="lg" position="right">
          <Button color="red" onClick={onClose}>
            Dismiss
          </Button>
          <Button onClick={onClose} component="a" href="https://editor.herowand.com/?ref=jsoncrack">
            Show me!
          </Button>
        </Group>
      </Modal>
    </MantineProvider>
  );
};
