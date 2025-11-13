import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";
import { modify, applyEdits, parse } from "jsonc-parser";


const normalizeNodeData = (nodeRows: NodeData["text"]) => {
  if (!nodeRows || nodeRows.length === 0) return "{}";
  if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

  const obj = {};
  nodeRows?.forEach(row => {
    if (row.type !== "array" && row.type !== "object") {
      if (row.key) obj[row.key] = row.value;
    }
  });
  return JSON.stringify(obj, null, 2);
};

const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

interface EditorModalProps extends ModalProps {
    currentNode?: NodeData;
}


export const EditorModal = ({ opened, onClose, currentNode }: EditorModalProps) => {
  const nodeData = currentNode ??useGraph(state => state.selectedNode);
  const [editedData, setEditedData] = React.useState(nodeData?.text ?? []);
  React.useEffect(() => {
      if(nodeData?.text){
        setEditedData(nodeData.text);
      }
  }, [nodeData])

  React.useEffect(() => {
    if(!opened && nodeData?.text){
      setEditedData(nodeData.text);
    }
  }, [opened, nodeData]);
  
  const handleSave = async () => {
      if (!nodeData) return;

      const currentJSONString = useJson.getState().json;
      let currentJSONObject: any = {};
      try {
        currentJSONObject = typeof currentJSONString === "string" ? JSON.parse(currentJSONString) : currentJSONString ?? {};
      } catch (err) {
        console.error("Failed to parse JSON:", err);
      }

      try {
        let currentText = useFile.getState().contents ?? (typeof currentJSONString === "string" ? currentJSONString : JSON.stringify(currentJSONObject, null, 2));

        const formattingOptions = { tabSize: 2, insertSpaces: true };

        const parseValue = (v: any) => {
          if (typeof v !== "string") return v;
          try {
            return JSON.parse(v);
          } catch {
            return v;
          }
        };

        const originalRows = nodeData.text ?? [];

        if (nodeData.text.length === 1 && !nodeData.text[0].key) {
          const newVal = parseValue(editedData[0]?.value ?? nodeData.text[0].value);

          if (!nodeData.path || nodeData.path.length === 0) {
            const newJsonStr = JSON.stringify(newVal, null, 2);
            useJson.getState().setJson(newJsonStr);
            useFile.getState().setContents({ contents: newJsonStr, hasChanges: false, skipUpdate: true });
            onClose();
            return;
          }

          const edits = modify(currentText, nodeData.path as Array<string | number>, newVal, { formattingOptions });
          currentText = applyEdits(currentText, edits);
        } else {
          for (let i = 0; i < editedData.length; i++) {
            const { key, value } = editedData[i] ?? {};
            if (!key) continue;
            const orig = originalRows[i]?.value;
            if (value === orig || (String(value) === String(orig))) continue;
            const newVal = parseValue(value);
            const path = ([...(nodeData.path ?? [])] as Array<string | number>).concat(key);
            const edits = modify(currentText, path, newVal, { formattingOptions });
            currentText = applyEdits(currentText, edits);
          }
        }

        parse(currentText);

        useJson.getState().setJson(currentText);
        useFile.getState().setContents({ contents: currentText, hasChanges: false, skipUpdate: true });
      } catch (err) {
        console.error("Failed to apply minimal JSON edits:", err);
        const finalJsonStr = JSON.stringify(currentJSONObject, null, 2);
        useJson.getState().setJson(finalJsonStr);
        useFile.getState().setContents({ contents: finalJsonStr, hasChanges: false, skipUpdate: true });
      }

  try {
    const prevPath = nodeData.path;
    const nodes = useGraph.getState().nodes;
    let matched: NodeData | undefined;
    if (prevPath && prevPath.length > 0) {
      matched = nodes.find(n => {
        if (!n.path) return false;
        if (n.path.length !== prevPath.length) return false;
        return n.path.every((seg, i) => seg === prevPath[i]);
      });
    } else {
      const prevNorm = normalizeNodeData(nodeData.text ?? []);
      matched = nodes.find(n => normalizeNodeData(n.text ?? []) === prevNorm);
    }

    if (matched) {
      useGraph.getState().setSelectedNode(matched);
    }
  } catch (err) {
    console.warn("Failed to restore graph selection:", err);
  }

  onClose();
  };


  return (
    <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="xs" align ="center">
            <Button fz="xs" fw={500} c = "white" bg = "green" onClick={handleSave}>
              Save
            </Button>
            <Button fz="xs" fw={500} c = "white" bg = "red" onClick ={onClose}>
              Cancel
            </Button>
            <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            <Stack>
                {nodeData?.text?.filter(row => row.type !== "array" && row.type !== "object")
                .map((row, index)=>(
                <Flex key={index} align="left" gap="xs" direction="column" mb="xs">
                    <Text fz ="sm" fw={500} >
                        {row.key}
                    </Text>
                    <textarea style={{maxHeight:"35px", flex: 1, border: "1px solid #ccccccbe", borderRadius: "4px", fontSize: "16px", color:"#d1cfcfe0", resize:"none", padding:"4px"
                    }} 
                    value={editedData[index]?.value ?? ""}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setEditedData(prevData =>
                            prevData.map((item, i)=>
                            i === index ? {...item, value: newValue} : item
                        )
                    );
                    }}
                    />
                </Flex>
            ))}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
        <Text fz="xs" fw={500}>
          JSON Path
        </Text>
        <ScrollArea.Autosize maw={600}>
          <CodeHighlight
            code={jsonPathToString(nodeData?.path)}
            miw={350}
            mah={250}
            language="json"
            copyLabel="Copy to clipboard"
            copiedLabel="Copied to clipboard"
            withCopyButton
          />
        </ScrollArea.Autosize>
      </Stack>
    </Modal>
  );
};

export default EditorModal;