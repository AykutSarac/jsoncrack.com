import { useEffect, useState } from "react";
import { Modal, Button, Text, Stack, List, ThemeIcon, Title, SimpleGrid } from "@mantine/core";
import { LuPencil, LuSparkles, LuHardDrive, LuMaximize, LuMessageSquare } from "react-icons/lu";
import { TbCode, TbBrandOpenSource, TbHistory, TbFile } from "react-icons/tb";

const SESSION_KEY = "editor_choice_shown";

export const EditorChoiceModal = () => {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const dismissed = document.cookie.split("; ").some(c => c === `${SESSION_KEY}=true`);
    if (process.env.NEXT_PUBLIC_DISABLE_EXTERNAL_MODE !== "true" && !dismissed) {
      setOpened(true);
    }
  }, []);

  const handleDismiss = () => {
    setOpened(false);
    document.cookie = `${SESSION_KEY}=true; path=/; max-age=86400`;
  };

  if (!opened) return null;

  return (
    <Modal
      opened={opened}
      onClose={handleDismiss}
      closeOnEscape={false}
      centered
      size={600}
      radius="lg"
      withCloseButton={false}
      title={
        <Stack gap={2} align="center" w="100%">
          <Title order={3}>Choose your editor</Title>
          <Text size="sm" c="dimmed">
            You won&apos;t see this today again
          </Text>
        </Stack>
      }
      styles={{
        body: { padding: "0 24px 24px" },
        header: { padding: "24px 24px 12px", justifyContent: "center" },
        title: { flex: "none" },
      }}
    >
      <SimpleGrid cols={2} spacing="md" mt="xs">
        {/* ToDiagram Card */}
        <Stack
          gap={0}
          style={{
            border: "2px solid var(--mantine-color-pink-6)",
            borderRadius: "var(--mantine-radius-md)",
            overflow: "hidden",
          }}
        >
          <Text
            size="xs"
            fw={700}
            c="white"
            ta="center"
            py={6}
            style={{
              background: "var(--mantine-color-pink-6)",
            }}
          >
            Recommended
          </Text>
          <Stack gap="md" p="lg">
            <Stack gap={4}>
              <Text fw={700} size="lg">
                ToDiagram
              </Text>
              <Text size="sm" c="dimmed">
                Next-gen editor with high-performance, AI Copilot and more
              </Text>
            </Stack>

            <Button
              component="a"
              href="https://todiagram.com/editor?utm_source=jsoncrack&utm_medium=promotion_modal&utm_campaign=editor_redirect"
              target="_blank"
              rel="noopener noreferrer"
              color="pink"
              size="md"
              radius="md"
              fullWidth
              onClick={handleDismiss}
            >
              Open ToDiagram
            </Button>

            <List
              spacing="xs"
              size="sm"
              center
              listStyleType="none"
              styles={{ root: { paddingLeft: 0 } }}
            >
              <List.Item
                icon={
                  <ThemeIcon variant="transparent" size="sm" c="dimmed">
                    <LuPencil />
                  </ThemeIcon>
                }
              >
                Visual editor
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon variant="transparent" size="sm" c="dimmed">
                    <LuSparkles />
                  </ThemeIcon>
                }
              >
                AI-powered features
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon variant="transparent" size="sm" c="dimmed">
                    <LuHardDrive />
                  </ThemeIcon>
                }
              >
                Cloud storage
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon variant="transparent" size="sm" c="dimmed">
                    <LuMaximize />
                  </ThemeIcon>
                }
              >
                Limitless diagram size
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon variant="transparent" size="sm" c="dimmed">
                    <LuMessageSquare />
                  </ThemeIcon>
                }
              >
                Collaboration tools
              </List.Item>
            </List>
          </Stack>
        </Stack>

        {/* JSON Crack Card */}
        <Stack
          gap="md"
          p="lg"
          pt={50}
          style={{
            border: "1px solid var(--mantine-color-default-border)",
            borderRadius: "var(--mantine-radius-md)",
          }}
        >
          <Stack gap={4}>
            <Text fw={700} size="lg">
              Open Source
            </Text>
            <Text size="sm" c="dimmed">
              Code only, no login, always free. Best for small files and quick edits
            </Text>
          </Stack>

          <Button variant="default" size="md" radius="md" fullWidth onClick={handleDismiss}>
            Stay on JSON Crack
          </Button>

          <List
            spacing="xs"
            size="sm"
            center
            listStyleType="none"
            styles={{ root: { paddingLeft: 0 } }}
          >
            <List.Item
              icon={
                <ThemeIcon variant="transparent" size="sm" c="dimmed">
                  <TbCode />
                </ThemeIcon>
              }
            >
              Code editor
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon variant="transparent" size="sm" c="dimmed">
                  <TbBrandOpenSource />
                </ThemeIcon>
              }
            >
              Open source
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon variant="transparent" size="sm" c="dimmed">
                  <TbHistory />
                </ThemeIcon>
              }
            >
              No account needed
            </List.Item>
            <List.Item
              icon={
                <ThemeIcon variant="transparent" size="sm" c="dimmed">
                  <TbFile />
                </ThemeIcon>
              }
            >
              Works with small files
            </List.Item>
          </List>
        </Stack>
      </SimpleGrid>
      <Text size="xs" c="dimmed" ta="center" mt="md">
        <a
          href="https://todiagram.com/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          ToDiagram Privacy Policy
        </a>
      </Text>
    </Modal>
  );
};
