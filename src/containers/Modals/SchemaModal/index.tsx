import React from "react";
import { Stack, Modal, Button, ModalProps, Text, Anchor, Group } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { toast } from "react-hot-toast";
import { VscLock } from "react-icons/vsc";
import useConfig from "src/store/useConfig";
import useFile from "src/store/useFile";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

export const SchemaModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const isPremium = useUser(state => state.premium);
  const showPremiumModal = useModal(state => state.setVisible("premium"));
  const setJsonSchema = useFile(state => state.setJsonSchema);
  const [schema, setSchema] = React.useState("");
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
        <Text fz="sm">
          Any validation failures are shown at the bottom toolbar of pane.{" "}
          <Anchor target="_blank" href="https://json-schema.org/">
            What is a JSON Schema?
          </Anchor>
        </Text>
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
        <Group position="right">
          <Button variant="outline" onClick={onClear} disabled={!schema}>
            Clear
          </Button>
          <Button onClick={onApply} disabled={!schema} rightIcon={!isPremium && <VscLock />}>
            Apply
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
