import React from "react";
import { Stack, Modal, Button, ModalProps, Text, Anchor, Group, Divider } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { toast } from "react-hot-toast";
import { VscLinkExternal, VscLock } from "react-icons/vsc";
import useConfig from "src/store/useConfig";
import useFile from "src/store/useFile";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

export const SchemaModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const isPremium = useUser(state => state.premium);
  const showPremiumModal = useModal(state => state.setVisible("premium"));
  const setJsonSchema = useFile(state => state.setJsonSchema);
  const [schema, setSchema] = React.useState(
    JSON.stringify(
      {
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "Product",
        description: "A product from catalog",
        type: "object",
        properties: {
          id: {
            description: "The unique identifier for a product",
            type: "integer",
          },
        },
        required: ["id"],
      },
      null,
      2
    )
  );
  const darkmodeEnabled = useConfig(state => (state.darkmodeEnabled ? "vs-dark" : "light"));

  const onApply = () => {
    if (!isPremium) return showPremiumModal(true);

    try {
      const parsedSchema = JSON.parse(schema);

      setJsonSchema(parsedSchema);
      toast.success("Applied schema!");
      onClose();
    } catch (error) {
      toast.error("Invalid Schema");
    }
  };

  const onClear = () => {
    setJsonSchema(null);
    setSchema("");
    toast("Disabled JSON Schema");
    onClose();
  };

  return (
    <Modal title="JSON Schema" size="lg" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Text fz="sm">Any validation failures are shown at the bottom toolbar of pane.</Text>
        <Anchor fz="sm" target="_blank" href="https://niem.github.io/json/sample-schema/">
          View Examples <VscLinkExternal />
        </Anchor>
        <Editor
          value={schema ?? ""}
          theme={darkmodeEnabled}
          onChange={e => setSchema(e!)}
          height={300}
          language="json"
          options={{
            formatOnPaste: true,
            formatOnType: true,
            minimap: {
              enabled: false,
            },
          }}
        />
        <Divider my="xs" />
        <Group p="0" justify="right">
          <Button variant="outline" onClick={onClear} disabled={!schema}>
            Clear
          </Button>
          <Button onClick={onApply} disabled={!schema} rightSection={!isPremium && <VscLock />}>
            Apply
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
