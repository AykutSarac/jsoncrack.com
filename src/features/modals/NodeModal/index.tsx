import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import { contentToJson, jsonToContent } from "../../../lib/utils/jsonAdapter";
import { toast } from "react-hot-toast";

// return object from json removing array and object fields
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

// return json path in the format $["customer"]
const jsonPathToString = (path?: NodeData["path"]) => {
  if (!path || path.length === 0) return "$";
  const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
  return `$[${segments.join("][")}]`;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
  const nodeData = useGraph(state => state.selectedNode);
  const fileStore = useFile();

  const [isEditing, setIsEditing] = React.useState(false);
  const [draftContent, setDraftContent] = React.useState<string>("{}");
  const [liveContent, setLiveContent] = React.useState<string>(normalizeNodeData(nodeData?.text ?? []));

  React.useEffect(() => {
    const normalized = normalizeNodeData(nodeData?.text ?? []);
    setDraftContent(normalized);
    setLiveContent(normalized);
    setIsEditing(false);
  }, [nodeData]);

  return (
  <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
      <Stack pb="sm" gap="sm">
        <Stack gap="xs">
          <Flex justify="space-between" align="center">
            <Text fz="xs" fw={500}>
              Content
            </Text>
            <Flex gap="sm" align="center">
              {!isEditing && (
                <Button size="xs" variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
              {isEditing && (
                <>
                  <Button
                    size="xs"
                    color="green"
                    variant="filled"
                    onClick={async () => {
                      // Save handler
                      try {
                        const format = fileStore.getFormat ? fileStore.getFormat() : fileStore.format;
                        const contents = fileStore.getContents ? fileStore.getContents() : fileStore.contents;
                        const parsedFile = await contentToJson(contents, format);

                        let parsedDraft: any = undefined;
                        try {
                          parsedDraft = JSON.parse(draftContent);
                        } catch (e) {
                          // allow primitive values like string/number
                          try {
                            parsedDraft = JSON.parse(draftContent.trim());
                          } catch (err) {
                            toast.error("Invalid JSON in content. Please fix before saving.");
                            return;
                          }
                        }

                        // If no path provided, replace root
                        const path = nodeData?.path ?? [];
                        if (!path || path.length === 0) {
                          // replace whole document
                          const newContent = await jsonToContent(JSON.stringify(parsedDraft, null, 2), format);
                          fileStore.setContents({ contents: newContent });
                        } else {
                          // traverse to parent
                          let parent: any = parsedFile;
                          for (let i = 0; i < path.length - 1; i++) {
                            parent = parent[path[i] as any];
                            if (typeof parent === "undefined") break;
                          }
                          const last = path[path.length - 1] as any;
                          if (typeof parent !== "undefined") {
                            parent[last] = parsedDraft;
                            const newContent = await jsonToContent(JSON.stringify(parsedFile, null, 2), format);
                            fileStore.setContents({ contents: newContent });
                          } else {
                            toast.error("Unable to resolve JSON path for this node.");
                            return;
                          }
                        }

                        // update visible modal content immediately
                        setLiveContent(draftContent);
                        setIsEditing(false);
                        toast.success("Saved node content");
                      } catch (error) {
                        console.error(error);
                        toast.error("Failed to save node content");
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="filled"
                    onClick={() => {
                      // cancel edits: revert to the last visible/saved content (liveContent)
                      setDraftContent(liveContent);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <CloseButton onClick={onClose} />
            </Flex>
          </Flex>
          <ScrollArea.Autosize mah={250} maw={600}>
            {!isEditing ? (
              <CodeHighlight
                code={liveContent}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
            ) : (
              <Textarea
                minRows={4}
                maxRows={12}
                value={draftContent}
                onChange={e => setDraftContent(e.currentTarget.value)}
                styles={{ input: { fontFamily: "monospace" } }}
              />
            )}
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
