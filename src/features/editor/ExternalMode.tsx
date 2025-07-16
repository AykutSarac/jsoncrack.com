import React from "react";
import { Accordion, Anchor, Code, Flex, FocusTrap, Group, Modal, Text } from "@mantine/core";

const ExternalMode = () => {
  const [isExternal, setExternal] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_EXTERNAL_MODE === "false") {
      if (typeof window !== "undefined") {
        if (window.location.pathname.includes("widget")) return setExternal(false);
        if (window.location.host !== "jsoncrack.com") return setExternal(true);
        return setExternal(false);
      }
    }
  }, []);

  if (!isExternal) return null;

  return (
    <Modal
      title="Thanks for using JSON Crack"
      opened={isExternal}
      onClose={() => setExternal(false)}
      centered
      size="lg"
    >
      <FocusTrap.InitialFocus />
      <Group>
        <Accordion variant="separated" w="100%">
          <Accordion.Item value="1">
            <Accordion.Control>How can I change the file size limit?</Accordion.Control>
            <Accordion.Panel>
              The main reason for the file size limit is to prevent performance issues, not to push
              you to upgrade. You can increase the limit by setting{" "}
              <Code>NEXT_PUBLIC_NODE_LIMIT</Code> in your <Code>.env</Code> file.
              <br />
              <br />
              If you&apos;d like to work with even larger files and unlock additional features, you
              can upgrade to the{" "}
              <Anchor
                href="https://todiagram.com?utm_source=jsoncrack&utm_medium=external-mode"
                rel="noopener"
                target="_blank"
              >
                Pro
              </Anchor>{" "}
              version.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="2">
            <Accordion.Control>How can I stop this dialog from appearing?</Accordion.Control>
            <Accordion.Panel>
              You can disable this dialog by setting <Code>NEXT_PUBLIC_DISABLE_EXTERNAL_MODE</Code>{" "}
              to <Code>true</Code> in your <Code>.env.development</Code> file.
              <br />
              <br />
              If you want to re-enable it, simply remove or set the value to <Code>false</Code>.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="3">
            <Accordion.Control>What are the license terms?</Accordion.Control>
            <Accordion.Panel>
              Read the full license terms on{" "}
              <Anchor
                href="https://github.com/AykutSarac/jsoncrack.com/blob/main/LICENSE.md"
                rel="noopener"
                target="_blank"
              >
                GitHub
              </Anchor>
              .
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="4">
            <Accordion.Control>How do I report a bug or request a feature?</Accordion.Control>
            <Accordion.Panel>
              You can report bugs or request features by opening an issue on our{" "}
              <Anchor
                href="https://github.com/AykutSarac/jsoncrack.com/issues"
                rel="noopener"
                target="_blank"
              >
                GitHub Issues page
              </Anchor>
              .
              <br />
              <br />
              Please provide as much detail as possible to help us address your feedback quickly.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="5">
            <Accordion.Control>How do I contribute to the project?</Accordion.Control>
            <Accordion.Panel>
              We welcome contributions! Visit our{" "}
              <Anchor
                href="https://github.com/AykutSarac/jsoncrack.com"
                rel="noopener"
                target="_blank"
              >
                GitHub repository
              </Anchor>{" "}
              and read the{" "}
              <Anchor
                href="https://github.com/AykutSarac/jsoncrack.com/blob/main/CONTRIBUTING.md"
                rel="noopener"
                target="_blank"
              >
                contributing guide
              </Anchor>{" "}
              to get started.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="6">
            <Accordion.Control>
              What is the difference between JSON Crack and ToDiagram?
            </Accordion.Control>
            <Accordion.Panel>
              JSON Crack is a free and open-source tool for visualizing JSON data. ToDiagram is the
              professional version that offers advanced features, higher limits, and the ability to
              edit data directly from diagrams. You can learn more or upgrade at{" "}
              <Anchor
                href="https://todiagram.com?utm_source=jsoncrack&utm_medium=external-mode"
                rel="noopener"
                target="_blank"
              >
                todiagram.com
              </Anchor>
              .
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Group>
      <Flex justify="center" align="center" gap="sm" mt="md">
        <Anchor
          href="https://github.com/AykutSarac/jsoncrack.com"
          rel="noopener"
          target="_blank"
          fz="sm"
        >
          GitHub
        </Anchor>
        <Text c="dimmed">•</Text>
        <Anchor href="https://todiagram.com" rel="noopener" target="_blank" fz="sm">
          ToDiagram
        </Anchor>
        <Text c="dimmed">•</Text>
        <Anchor href="https://x.com/aykutsarach" rel="noopener" target="_blank" fz="sm">
          Aykut Saraç (@aykutsarach)
        </Anchor>
      </Flex>
    </Modal>
  );
};

export default ExternalMode;
