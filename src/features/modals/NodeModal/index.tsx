import React, { useEffect, useState } from "react";

import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput, Group } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
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
  const updateNode = useGraph(state =>  state.setSelectedNode);
  const [editOpened, setEditOpened] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // initialize form values when selected node changes
  useEffect(() => {
    if (!nodeData?.text) {
      setFormValues({});
      return;
    }
    const values: Record<string, string> = {};
    nodeData.text.forEach(row => {
      if (row.type !== "array" && row.type !== "object" && row.key) {
        values[row.key] = row.value != null ? String(row.value) : "";
      }
    });
    setFormValues(values);
  }, [nodeData]);

  const onEdit = () => {
    setEditOpened(true);
  };

   const setContents = useFile(state => state.setContents);
  const contents = useFile(state => state.contents)
  const onSave = () => {
  if (!nodeData) {
    setEditOpened(false);
    return;
  }

  // Build updated text array by replacing values for keys present in formValues
  const newText = (nodeData.text ?? []).map(row => {
    if (row.key && Object.prototype.hasOwnProperty.call(formValues, row.key)) {
      const raw = formValues[row.key];
      let parsed: any = raw;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = raw;
      }
      return { ...row, value: parsed };
    }
    return row;
  });

  const updatedNode: NodeData = { ...nodeData, text: newText };

  // Update in-graph selection/store if available
  if (typeof updateNode === "function") {
    try {
      if (updateNode.length === 2 && "id" in nodeData) {
        // @ts-ignore
        updateNode((nodeData as any).id, updatedNode);
      } else {
        // @ts-ignore
        updateNode(updatedNode);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to call store update function:", err);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn("No update function found on useGraph store. Please add updateNode/updateSelectedNode/setSelectedNode/setNode.");
  }

  // Persist change into main file contents using useFile.setContents
  try {
    const nodeTextToValue = (text?: NodeData["text"], existingNodeValue?: any) => {
      if (!text || text.length === 0) return null;

      // single anonymous primitive value
      if (text.length === 1 && !text[0].key) {
        try {
          return JSON.parse(String(text[0].value));
        } catch {
          return text[0].value;
        }
      }

      // start from existing object to preserve children
      const base =
        existingNodeValue && typeof existingNodeValue === "object" && !Array.isArray(existingNodeValue)
          ? { ...existingNodeValue }
          : {};
      const obj: Record<string, any> = { ...base };

      text.forEach(row => {
        if (!row.key) return;
        if (row.type !== "array" && row.type !== "object") {
          // primitive attribute -> use typed value already stored on row.value
          obj[row.key] = row.value;
        } else {
          // object/array child -> preserve existing child if present, otherwise create empty placeholder
          if (existingNodeValue && typeof existingNodeValue === "object" && Object.prototype.hasOwnProperty.call(existingNodeValue, row.key)) {
            obj[row.key] = existingNodeValue[row.key];
          } else {
            obj[row.key] = row.type === "array" ? [] : {};
          }
        }
      });

      return obj;
    };

    if (typeof contents !== "string" || contents.trim() === "") {
      const newValue = nodeTextToValue(newText, undefined);
      setContents({ contents: JSON.stringify(newValue, null, 2), skipUpdate: false });
    } else {
      let root: any;
      try {
        root = JSON.parse(contents);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse editor contents - cannot persist node edit:", err);
        setEditOpened(false);
        return;
      }

      const path = nodeData.path ?? [];

      const getAtPath = (r: any, p: NodeData["path"]) => {
        if (!p || p.length === 0) return r;
        let cur = r;
        for (let i = 0; i < p.length; i++) {
          const seg = p[i];
          if (cur == null) return undefined;
          cur = cur[seg as any];
        }
        return cur;
      };

      const existingNodeValue = getAtPath(root, path);
      const newValue = nodeTextToValue(newText, existingNodeValue);

      if (!path || path.length === 0) {
        root = newValue;
      } else {
        let cur = root;
        for (let i = 0; i < path.length - 1; i++) {
          const seg = path[i];
          if (typeof seg === "number") {
            cur[seg] = cur[seg] ?? {};
            cur = cur[seg];
          } else {
            cur[seg] = cur[seg] ?? {};
            cur = cur[seg];
          }
        }
        const last = path[path.length - 1];
        if (typeof last === "number") {
          // ensure parent is array-like
          if (!Array.isArray(cur)) {
            // create array on parent if it wasn't an array
            // (attempt to set on parent object if possible)
            cur[last] = newValue;
          } else {
            cur[last] = newValue;
          }
        } else {
          cur[last] = newValue;
        }
      }

      const updatedContents = JSON.stringify(root, null, 2);
      setContents({ contents: updatedContents, skipUpdate: false });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to persist node edit to file contents:", err);
  }

  setEditOpened(false);
};
  return (
     <>
      <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
        <Stack pb="sm" gap="sm">
          <Stack gap="xs">
            <Flex justify="space-between" align="center">
              <Text fz="xs" fw={500}>
                Content
              </Text>
              {/* Edit + Close */}
              <Flex gap="xs" align="center">
                <Button size="xs" variant="outline" onClick={onEdit}>
                  Edit
                </Button>
                <CloseButton onClick={onClose} />
              </Flex>
            </Flex>
            <ScrollArea.Autosize mah={250} maw={600}>
              <CodeHighlight
                code={normalizeNodeData(nodeData?.text ?? [])}
                miw={350}
                maw={600}
                language="json"
                withCopyButton
              />
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

      {/* Edit Modal: shows each attribute with an input */}
      <Modal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        centered
        size="sm"
        withCloseButton
        title="Edit Node Attributes"
      >
        <Stack>
          {Object.keys(formValues).length === 0 && (
            <Text fz="sm" color="dimmed">No editable attributes found for this node.</Text>
          )}

          {Object.entries(formValues).map(([key, value]) => (
            <div key={key}>
              <Text fz="xs" fw={500} mb="xs">{key}</Text>
              <TextInput
                value={value}
                onChange={(e) => setFormValues(prev => ({ ...prev, [key]: e.currentTarget.value }))}
                placeholder={key}
                maw={420}
              />
            </div>
          ))}

          <Group mt="sm">
            <Button variant="default" onClick={() => setEditOpened(false)}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};








// import React, { useEffect, useState } from "react";

// import type { ModalProps } from "@mantine/core";
// import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button, TextInput, Group } from "@mantine/core";
// import { CodeHighlight } from "@mantine/code-highlight";
// import type { NodeData } from "../../../types/graph";
// import useGraph from "../../editor/views/GraphView/stores/useGraph";

// // return object from json removing array and object fields
// const normalizeNodeData = (nodeRows: NodeData["text"]) => {
//   if (!nodeRows || nodeRows.length === 0) return "{}";
//   if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

//   const obj = {};
//   nodeRows?.forEach(row => {
//     if (row.type !== "array" && row.type !== "object") {
//       if (row.key) obj[row.key] = row.value;
//     }
//   });
//   return JSON.stringify(obj, null, 2);
// };

// // return json path in the format $["customer"]
// const jsonPathToString = (path?: NodeData["path"]) => {
//   if (!path || path.length === 0) return "$";
//   const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
//   return `$[${segments.join("][")}]`;
// };

// export const NodeModal = ({ opened, onClose }: ModalProps) => {
//   const nodeData = useGraph(state => state.selectedNode);
//   const [editOpened, setEditOpened] = useState(false);
//   const [formValues, setFormValues] = useState<Record<string, string>>({});

//   // initialize form values when selected node changes
//   useEffect(() => {
//     if (!nodeData?.text) {
//       setFormValues({});
//       return;
//     }
//     const values: Record<string, string> = {};
//     nodeData.text.forEach(row => {
//       if (row.type !== "array" && row.type !== "object" && row.key) {
//         values[row.key] = row.value != null ? String(row.value) : "";
//       }
//     });
//     setFormValues(values);
//   }, [nodeData]);

//   const onEdit = () => {
//     setEditOpened(true);
//   };

//   const onSave = () => {
//     // TODO: wire this to your store/update action to persist changes
//     // For now we log the updated values
//     // eslint-disable-next-line no-console
//     console.log("Save node attributes:", formValues, "for node:", nodeData);
//     setEditOpened(false);
//   };
//   return (
//      <>
//       <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
//         <Stack pb="sm" gap="sm">
//           <Stack gap="xs">
//             <Flex justify="space-between" align="center">
//               <Text fz="xs" fw={500}>
//                 Content
//               </Text>
//               {/* Edit + Close */}
//               <Flex gap="xs" align="center">
//                 <Button size="xs" variant="outline" onClick={onEdit}>
//                   Edit
//                 </Button>
//                 <CloseButton onClick={onClose} />
//               </Flex>
//             </Flex>
//             <ScrollArea.Autosize mah={250} maw={600}>
//               <CodeHighlight
//                 code={normalizeNodeData(nodeData?.text ?? [])}
//                 miw={350}
//                 maw={600}
//                 language="json"
//                 withCopyButton
//               />
//             </ScrollArea.Autosize>
//           </Stack>
//           <Text fz="xs" fw={500}>
//             JSON Path
//           </Text>
//           <ScrollArea.Autosize maw={600}>
//             <CodeHighlight
//               code={jsonPathToString(nodeData?.path)}
//               miw={350}
//               mah={250}
//               language="json"
//               copyLabel="Copy to clipboard"
//               copiedLabel="Copied to clipboard"
//               withCopyButton
//             />
//           </ScrollArea.Autosize>
//         </Stack>
//       </Modal>

//       {/* Edit Modal: shows each attribute with an input */}
//       <Modal
//         opened={editOpened}
//         onClose={() => setEditOpened(false)}
//         centered
//         size="sm"
//         withCloseButton
//         title="Edit Node Attributes"
//       >
//         <Stack>
//           {Object.keys(formValues).length === 0 && (
//             <Text fz="sm" color="dimmed">No editable attributes found for this node.</Text>
//           )}

//           {Object.entries(formValues).map(([key, value]) => (
//             <div key={key}>
//               <Text fz="xs" fw={500} mb="xs">{key}</Text>
//               <TextInput
//                 value={value}
//                 onChange={(e) => setFormValues(prev => ({ ...prev, [key]: e.currentTarget.value }))}
//                 placeholder={key}
//                 maw={420}
//               />
//             </div>
//           ))}

//           <Group mt="sm">
//             <Button variant="default" onClick={() => setEditOpened(false)}>Cancel</Button>
//             <Button onClick={onSave}>Save</Button>
//           </Group>
//         </Stack>
//       </Modal>
//     </>
//   );
// };





























// import React from "react";
// import type { ModalProps } from "@mantine/core";
// import { Modal, Stack, Text, ScrollArea, Flex, CloseButton, Button } from "@mantine/core";
// import { CodeHighlight } from "@mantine/code-highlight";
// import type { NodeData } from "../../../types/graph";
// import useGraph from "../../editor/views/GraphView/stores/useGraph";

// // return object from json removing array and object fields
// const normalizeNodeData = (nodeRows: NodeData["text"]) => {
//   if (!nodeRows || nodeRows.length === 0) return "{}";
//   if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

//   const obj = {};
//   nodeRows?.forEach(row => {
//     if (row.type !== "array" && row.type !== "object") {
//       if (row.key) obj[row.key] = row.value;
//     }
//   });
//   return JSON.stringify(obj, null, 2);
// };

// // return json path in the format $["customer"]
// const jsonPathToString = (path?: NodeData["path"]) => {
//   if (!path || path.length === 0) return "$";
//   const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
//   return `$[${segments.join("][")}]`;
// };

// export const NodeModal = ({ opened, onClose }: ModalProps) => {
//   const nodeData = useGraph(state => state.selectedNode);
//   const onEdit = () => {
//     // placeholder: inspect in console or open an editor modal later
//     // eslint-disable-next-line no-console
//     console.log("Edit node clicked:", nodeData);
//   };
//   return (
//     <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
//       <Stack pb="sm" gap="sm">
//         <Stack gap="xs">
//           <Flex justify="space-between" align="center">
//             <Text fz="xs" fw={500}>
//               Content
//             </Text>
//             {/* added Edit button next to CloseButton */}
//             <Flex gap="xs" align="center">
//               <Button size="xs" variant="outline" onClick={onEdit}>
//                 Edit
//               </Button>
//               <CloseButton onClick={onClose} />
//             </Flex>
//           </Flex>
//           <ScrollArea.Autosize mah={250} maw={600}>
//             <CodeHighlight
//               code={normalizeNodeData(nodeData?.text ?? [])}
//               miw={350}
//               maw={600}
//               language="json"
//               withCopyButton
//             />
//           </ScrollArea.Autosize>
//         </Stack>
//         <Text fz="xs" fw={500}>
//           JSON Path
//         </Text>
//         <ScrollArea.Autosize maw={600}>
//           <CodeHighlight
//             code={jsonPathToString(nodeData?.path)}
//             miw={350}
//             mah={250}
//             language="json"
//             copyLabel="Copy to clipboard"
//             copiedLabel="Copied to clipboard"
//             withCopyButton
//           />
//         </ScrollArea.Autosize>
//       </Stack>
//     </Modal>
//   );
// };












// import React from "react";
// import type { ModalProps } from "@mantine/core";
// import { Modal, Stack, Text, ScrollArea, Flex, CloseButton } from "@mantine/core";
// import { CodeHighlight } from "@mantine/code-highlight";
// import type { NodeData } from "../../../types/graph";
// import useGraph from "../../editor/views/GraphView/stores/useGraph";

// // return object from json removing array and object fields
// const normalizeNodeData = (nodeRows: NodeData["text"]) => {
//   if (!nodeRows || nodeRows.length === 0) return "{}";
//   if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

//   const obj = {};
//   nodeRows?.forEach(row => {
//     if (row.type !== "array" && row.type !== "object") {
//       if (row.key) obj[row.key] = row.value;
//     }
//   });
//   return JSON.stringify(obj, null, 2);
// };

// // return json path in the format $["customer"]
// const jsonPathToString = (path?: NodeData["path"]) => {
//   if (!path || path.length === 0) return "$";
//   const segments = path.map(seg => (typeof seg === "number" ? seg : `"${seg}"`));
//   return `$[${segments.join("][")}]`;
// };

// export const NodeModal = ({ opened, onClose }: ModalProps) => {
//   const nodeData = useGraph(state => state.selectedNode);

//   return (
//     <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
//       <Stack pb="sm" gap="sm">
//         <Stack gap="xs">
//           <Flex justify="space-between" align="center">
//             <Text fz="xs" fw={500}>
//               Content
//             </Text>
//             <CloseButton onClick={onClose} />
//           </Flex>
//           <ScrollArea.Autosize mah={250} maw={600}>
//             <CodeHighlight
//               code={normalizeNodeData(nodeData?.text ?? [])}
//               miw={350}
//               maw={600}
//               language="json"
//               withCopyButton
//             />
//           </ScrollArea.Autosize>
//         </Stack>
//         <Text fz="xs" fw={500}>
//           JSON Path
//         </Text>
//         <ScrollArea.Autosize maw={600}>
//           <CodeHighlight
//             code={jsonPathToString(nodeData?.path)}
//             miw={350}
//             mah={250}
//             language="json"
//             copyLabel="Copy to clipboard"
//             copiedLabel="Copied to clipboard"
//             withCopyButton
//           />
//         </ScrollArea.Autosize>
//       </Stack>
//     </Modal>
//   );
// };
