import React from "react";
import { Modal, Stack, Text, ScrollArea, ModalProps, Button } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import Editor from "@monaco-editor/react";
import { VscLock } from "react-icons/vsc";
import { isIframe } from "src/lib/utils/widget";
import useConfig from "src/store/useConfig";
import useFile from "src/store/useFile";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };

  return JSON.stringify(text, replacer, 2);
};

export const NodeModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const isPremium = useUser(state => state.premium);
  const editContents = useFile(state => state.editContents);
  const setVisible = useModal(state => state.setVisible);
  const darkmodeEnabled = useConfig(state => (state.darkmodeEnabled ? "vs-dark" : "light"));
  const nodeData = useGraph(state => dataToString(state.selectedNode?.text));
  const path = useGraph(state => state.selectedNode?.path || "");
  const isParent = useGraph(state => state.selectedNode?.data?.isParent);
  const [editMode, setEditMode] = React.useState(false);
  const [value, setValue] = React.useState(nodeData || "");

  const onUpdate = () => {
    if (!value) return setEditMode(false);
    if (!isPremium) return;
    editContents(path!, value, () => {
      setEditMode(false);
      onModalClose();
    });
  };

  const onModalClose = () => {
    setEditMode(false);
    setValue("");
    onClose();
  };

  const onEditClick = () => {
    if (isPremium) return setEditMode(true);
    setVisible("premium")(true);
  };

  const isEditVisible = React.useMemo(
    () => path !== "{Root}" && !isParent && !isIframe(),
    [isParent, path]
  );

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onModalClose} centered>
      <Stack py="sm" gap="sm">
        <Stack gap="xs">
          <Text fz="sm" fw={700}>
            Content
          </Text>
          {editMode ? (
            <Editor
              theme={darkmodeEnabled}
              defaultValue={nodeData}
              onChange={e => setValue(e!)}
              height={200}
              language="json"
              options={{
                readOnly: !editMode,
                minimap: {
                  enabled: false,
                },
              }}
            />
          ) : (
            <ScrollArea>
              <CodeHighlight
                code={nodeData}
                miw={350}
                mah={250}
                maw={600}
                language="json"
                withCopyButton
              />
            </ScrollArea>
          )}
        </Stack>
        {isEditVisible && (
          <Stack gap="xs">
            {editMode ? (
              <Button
                variant={value ? "filled" : "light"}
                color={value ? "green" : "blue"}
                onClick={onUpdate}
              >
                {value.length ? "Update Document" : "Cancel"}
              </Button>
            ) : (
              <Button
                onClick={onEditClick}
                leftSection={!isPremium && <VscLock />}
                variant="filled"
              >
                Edit
              </Button>
            )}
          </Stack>
        )}
        <Text fz="sm" fw={700}>
          Node Path
        </Text>
        <ScrollArea>
          <CodeHighlight
            code={path}
            miw={350}
            mah={250}
            language="json"
            copyLabel="Copy to clipboard"
            copiedLabel="Copied to clipboard"
            withCopyButton
          />
        </ScrollArea>
      </Stack>
    </Modal>
  );
};
