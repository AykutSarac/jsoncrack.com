import React from "react";
import { Stack, Modal, Button, ModalProps, Text, Anchor, Group } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { VscLinkExternal } from "react-icons/vsc";
import useJsonQuery from "src/hooks/useJsonQuery";
import useConfig from "src/store/useConfig";

export const JQModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const { updateJson } = useJsonQuery();
  const [query, setQuery] = React.useState("");
  const darkmodeEnabled = useConfig(state => (state.darkmodeEnabled ? "vs-dark" : "light"));

  const onApply = () => {
    updateJson(query);
  };

  return (
    <Modal title="JSON Query" size="lg" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Text fz="sm">
          jq is a lightweight and flexible command-line JSON processor. JSON Crack uses simplified
          version of jq, not all features are supported.
          <br />
          <Anchor target="_blank" href="https://jqlang.github.io/jq/manual/">
            Read documentation. <VscLinkExternal />
          </Anchor>
        </Text>
        <Editor
          value={query ?? ""}
          theme={darkmodeEnabled}
          onChange={e => setQuery(e!)}
          height={300}
          language="markdown"
          options={{
            formatOnPaste: true,
            formatOnType: true,
            minimap: {
              enabled: false,
            },
          }}
        />
        <Group position="right">
          <Button onClick={onApply}>Display on Graph</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
