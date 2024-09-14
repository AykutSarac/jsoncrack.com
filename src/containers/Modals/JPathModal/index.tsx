import React from "react";
import type { ModalProps } from "@mantine/core";
import { Stack, Modal, Button, Text, Anchor, Group, TextInput } from "@mantine/core";
import { JSONPath } from "jsonpath-plus";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { VscLinkExternal } from "react-icons/vsc";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";

export const JPathModal = ({ opened, onClose }: ModalProps) => {
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);
  const [query, setQuery] = React.useState("");

  const evaluteJsonPath = () => {
    try {
      const json = getJson();
      const result = JSONPath({ path: query, json: JSON.parse(json) });

      setContents({ contents: JSON.stringify(result, null, 2) });
      gaEvent("run_json_path");
      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <Modal title="JSON Path" size="lg" opened={opened} onClose={onClose} centered>
      <Stack>
        <Text fz="sm">
          JsonPath expressions always refer to a JSON structure in the same way as XPath expression
          are used in combination with an XML document. The &quot;root member object&quot; in
          JsonPath is always referred to as $ regardless if it is an object or array.
          <br />
          <Anchor
            fz="sm"
            target="_blank"
            href="https://docs.oracle.com/cd/E60058_01/PDF/8.0.8.x/8.0.8.0.0/PMF_HTML/JsonPath_Expressions.htm"
          >
            Read documentation. <VscLinkExternal />
          </Anchor>
        </Text>
        <TextInput
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
          placeholder="Enter JSON Path..."
          data-autofocus
        />
        <Group justify="right">
          <Button onClick={evaluteJsonPath} disabled={!query.length}>
            Run
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
