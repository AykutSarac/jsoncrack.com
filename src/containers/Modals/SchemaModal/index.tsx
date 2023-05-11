import React from "react";
import { Stack, Modal, Button, ModalProps, Text } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { toast } from "react-hot-toast";
import useFile from "src/store/useFile";
import useStored from "src/store/useStored";

export const SchemaModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const setJsonSchema = useFile(state => state.setJsonSchema);
  const [schema, setSchema] = React.useState("");
  const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));

  const onApply = () => {
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
    <Modal title="JSON Schema" opened={opened} onClose={onClose} centered>
      <Stack py="sm">
        <Text fz="sm">Any validation failures are shown at the bottom toolbar of pane.</Text>
        <Editor
          value={schema ?? ""}
          theme={lightmode}
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
        <Button onClick={onApply} disabled={!schema} fullWidth>
          Apply
        </Button>
        <Button variant="outline" onClick={onClear} disabled={!schema} fullWidth>
          Clear
        </Button>
      </Stack>
    </Modal>
  );
};
