import React from "react";
import { Modal, Stack, Text, ScrollArea, ModalProps, Button } from "@mantine/core";
import { Prism } from "@mantine/prism";
import Editor from "@monaco-editor/react";
import vsDark from "prism-react-renderer/themes/vsDark";
import vsLight from "prism-react-renderer/themes/vsLight";
import { VscLock } from "react-icons/vsc";
import { shallow } from "zustand/shallow";
import useFile from "src/store/useFile";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";
import useStored from "src/store/useStored";
import useUser from "src/store/useUser";
import { isIframe } from "src/utils/widget";

const dataToString = (data: any) => {
  const text = Array.isArray(data) ? Object.fromEntries(data) : data;
  const replacer = (_: string, v: string) => {
    if (typeof v === "string") return v.replaceAll('"', "");
    return v;
  };

  return JSON.stringify(text, replacer, 2);
};

const CodeBlock: React.FC<{ children: any; [key: string]: any }> = ({
  format,
  children,
  ...props
}) => {
  return (
    <ScrollArea>
      <Prism
        miw={350}
        mah={250}
        language="json"
        copyLabel="Copy to clipboard"
        copiedLabel="Copied to clipboard"
        withLineNumbers
        getPrismTheme={(_theme, colorScheme) => (colorScheme === "light" ? vsLight : vsDark)}
        {...props}
      >
        {children}
      </Prism>
    </ScrollArea>
  );
};

export const NodeModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const isPremium = useUser(state => state.premium);
  const editContents = useFile(state => state.editContents);
  const setVisible = useModal(state => state.setVisible);
  const lightmode = useStored(state => (state.lightmode ? "light" : "vs-dark"));
  const [nodeData, path, isParent] = useGraph(
    state => [
      dataToString(state.selectedNode.text),
      state.selectedNode.path,
      state.selectedNode.data?.isParent,
    ],
    shallow
  );
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
    onModalClose();
  };

  const isEditVisible = React.useMemo(
    () => path !== "{Root}" && !isParent && !isIframe(),
    [isParent, path]
  );

  return (
    <Modal title="Node Content" size="auto" opened={opened} onClose={onModalClose} centered>
      <Stack py="sm" spacing="sm">
        <Stack spacing="xs">
          <Text fz="sm" fw={700}>
            Content
          </Text>
          {editMode ? (
            <Editor
              theme={lightmode}
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
            <CodeBlock maw={600}>{nodeData}</CodeBlock>
          )}
        </Stack>
        {isEditVisible && (
          <Stack spacing="xs">
            {editMode ? (
              <Button
                variant={value ? "filled" : "light"}
                color={value ? "green" : "blue"}
                onClick={onUpdate}
              >
                {value.length ? "Update Document" : "Cancel"}
              </Button>
            ) : (
              <Button onClick={onEditClick} leftIcon={!isPremium && <VscLock />} variant="filled">
                Edit
              </Button>
            )}
          </Stack>
        )}
        <Text fz="sm" fw={700}>
          Node Path
        </Text>
        <CodeBlock>{path}</CodeBlock>
      </Stack>
    </Modal>
  );
};
