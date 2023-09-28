import React from "react";
import { Stack, Modal, Button, ModalProps, Text, Anchor, Group } from "@mantine/core";
import Editor from "@monaco-editor/react";
import jq from "jq-in-the-browser";
import { toast } from "react-hot-toast";
import { VscLinkExternal } from "react-icons/vsc";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";
import useStored from "src/store/useStored";

export const JQModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const [query, setQuery] = React.useState("");
  const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);

  const onApply = () => {
    try {
      const res = jq(query)(JSON.parse(getJson())) as object;
      setContents({ contents: JSON.stringify(res, null, 2) });
      onClose();
    } catch (error) {
      toast.error("Invalid JQ");
    }
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
          theme={lightmode}
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
