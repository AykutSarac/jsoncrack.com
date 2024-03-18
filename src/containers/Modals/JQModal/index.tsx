import React from "react";
import {
  Stack,
  Modal,
  Button,
  ModalProps,
  Text,
  Anchor,
  Group,
  TextInput,
  Divider,
} from "@mantine/core";
import { VscLinkExternal } from "react-icons/vsc";
import useJsonQuery from "src/hooks/useJsonQuery";

export const JQModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const { updateJson } = useJsonQuery();
  const [query, setQuery] = React.useState("");

  return (
    <Modal title="JSON Query" size="lg" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Text fz="sm">
          jq is a lightweight and flexible command-line JSON processor. JSON Crack uses simplified
          version of jq, not all features are supported.
          <br />
          <Anchor fz="sm" target="_blank" href="https://jqlang.github.io/jq/manual/">
            Read documentation. <VscLinkExternal />
          </Anchor>
        </Text>
        <TextInput
          leftSection="jq"
          placeholder="Enter jq query"
          value={query}
          onChange={e => setQuery(e.currentTarget.value)}
        />
        <Divider my="xs" />
        <Group justify="right">
          <Button onClick={() => updateJson(query, onClose)}>Display on Graph</Button>
        </Group>
      </Stack>
    </Modal>
  );
};
