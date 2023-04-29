import React from "react";
import { Modal, Group, Button, MantineProvider, Image, Text, Paper } from "@mantine/core";
import { useDebouncedState, useSessionStorage } from "@mantine/hooks";

export const HerowandModal = () => {
  const [opened, setOpened] = useDebouncedState(false, 300);
  const [isNewsVisible, setNewsVisible] = useSessionStorage<boolean>({
    key: "news",
    defaultValue: true,
    getInitialValueInEffect: true,
  });

  React.useEffect(() => {
    if (isNewsVisible) setOpened(true);
    else setOpened(false);
  }, [isNewsVisible, setOpened]);

  const onClose = () => {
    setNewsVisible(false);
    setOpened(false);
  };

  return (
    <MantineProvider theme={{ colorScheme: "dark" }}>
      <Modal title="What's New?" opened={opened} onClose={onClose} centered>
        <Group>
          <Paper withBorder>
            <Image
              radius="md"
              mx="auto"
              src="assets/herowand_banner.webp"
              width={400}
              alt="herowand"
            />
          </Paper>
        </Group>
        <Text pt="lg">
          Introducing you something new...
          <hr />
          Herowand Editor - the ultimate tool for visualizing, editing, and sharing data in graph
          format. Import JSON, YAML, TOML, XML and manipulate data on the graph. Save to cloud,
          share, download as image, search through graph, accessibility features. Try it now!
        </Text>
        <Group pt="lg" position="right">
          <Button color="red" onClick={onClose}>
            Dismiss
          </Button>
          <Button component="a" href="https://editor.herowand.com/?ref=jsoncrack">
            Show me!
          </Button>
        </Group>
      </Modal>
    </MantineProvider>
  );
};
