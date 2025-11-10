import React, { useEffect, useState } from "react";
import type { ModalProps } from "@mantine/core";
import {
    Modal,
    Stack,
    Text,
    ScrollArea,
    Flex,
    CloseButton,
    Button,
    Textarea,
    Group,
    TextInput,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import type { NodeData } from "../../../types/graph";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useJson from "../../../store/useJson";
import useFile from "../../../store/useFile";

// return object from json removing array and object fields
const normalizeNodeData = (nodeRows: NodeData["text"]) => {
    if (!nodeRows || nodeRows.length === 0) return "{}";
    if (nodeRows.length === 1 && !nodeRows[0].key) return `${nodeRows[0].value}`;

    const obj: Record<string, any> = {};
    nodeRows.forEach(row => {
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

const buildNodeTextFromParsed = (parsed: any): NodeData["text"] => {
    if (parsed === null || parsed === undefined) return [{ value: parsed, type: typeof parsed }];
    if (typeof parsed !== "object" || (Array.isArray(parsed) === false && Object.keys(parsed).length === 0)) {
        return [{ value: parsed, type: Array.isArray(parsed) ? "array" : typeof parsed }];
    }
    if (typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.keys(parsed).map(key => {
            const value = parsed[key];
            return {
                key,
                value,
                type: Array.isArray(value) ? "array" : typeof value === "object" ? "object" : typeof value,
            };
        });
    }
    return [{ value: parsed, type: "array" }];
};

// deep merge two plain objects (arrays are replaced)
const deepMerge = (a: any, b: any): any => {
    if (a === null || a === undefined) return b;
    if (b === null || b === undefined) return a;
    if (Array.isArray(a) || Array.isArray(b)) {
        // replace arrays
        return b;
    }
    if (typeof a !== "object" || typeof b !== "object") {
        return b;
    }
    const out: Record<string, any> = { ...a };
    Object.keys(b).forEach(k => {
        out[k] = deepMerge(a[k], b[k]);
    });
    return out;
};

// safer functional set-at-path with merge semantics at leaf
const setValueAtPath = (root: any, path: NodeData["path"] | undefined, value: any) => {
    if (!path || path.length === 0) {
        // replace whole root; if both objects merge
        if (typeof root === "object" && root && typeof value === "object" && value && !Array.isArray(root) && !Array.isArray(value)) {
            return deepMerge(root, value);
        }
        return value;
    }

    const setAt = (node: any, idx: number): any => {
        const seg = path![idx];
        const isLast = idx === path!.length - 1;

        if (typeof seg === "number") {
            const arr = Array.isArray(node) ? node.slice() : [];
            if (isLast) {
                const existing = arr[seg];
                if (existing && typeof existing === "object" && !Array.isArray(existing) && typeof value === "object" && !Array.isArray(value)) {
                    arr[seg] = deepMerge(existing, value);
                } else {
                    arr[seg] = value;
                }
            } else {
                arr[seg] = setAt(arr[seg], idx + 1);
            }
            return arr;
        } else {
            const obj = node && typeof node === "object" && !Array.isArray(node) ? { ...node } : {};
            if (isLast) {
                const existing = obj[seg as string];
                if (existing && typeof existing === "object" && !Array.isArray(existing) && typeof value === "object" && !Array.isArray(value)) {
                    obj[seg as string] = deepMerge(existing, value);
                } else {
                    obj[seg as string] = value;
                }
            } else {
                obj[seg as string] = setAt(obj[seg as string], idx + 1);
            }
            return obj;
        }
    };

    return setAt(root, 0);
};

// new helper: read value at path
const getValueAtPath = (root: any, path: NodeData["path"] | undefined) => {
    if (!path || path.length === 0) return root;
    let cursor = root;
    for (let i = 0; i < path.length; i++) {
        const seg = path[i];
        if (cursor == null) return undefined;
        cursor = typeof seg === "number" ? cursor[seg] : cursor[seg];
    }
    return cursor;
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
    const nodeData = useGraph((state: any) => state.selectedNode) as NodeData | undefined;

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(() => normalizeNodeData(nodeData?.text ?? []));

    // fields holds the editable form values when editing an object node
    const [fields, setFields] = useState<Record<string, string> | null>(null);
    // primitiveEditing indicates we should show a single primitive editor (Textarea) instead of fields
    const [primitiveEditing, setPrimitiveEditing] = useState(false);

    // sync when node changes and not editing
    useEffect(() => {
        if (!isEditing) {
            setEditValue(normalizeNodeData(nodeData?.text ?? []));
            setFields(null);
            setPrimitiveEditing(false);
        }
    }, [nodeData, isEditing]);

    const enterEdit = () => {
        const jsonStr = normalizeNodeData(nodeData?.text ?? []);
        setEditValue(jsonStr);

        // try to parse and if object -> create fields map
        try {
            const parsed = JSON.parse(jsonStr);
            if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
                const map: Record<string, string> = {};
                Object.keys(parsed).forEach(k => {
                    // store primitive representation as JSON when possible, otherwise string
                    try {
                        map[k] = typeof parsed[k] === "string" ? parsed[k] : JSON.stringify(parsed[k]);
                    } catch {
                        map[k] = String(parsed[k]);
                    }
                });
                setFields(map);
                setPrimitiveEditing(false);
            } else {
                // show primitive editor (textarea) for non-object values
                setFields(null);
                setPrimitiveEditing(true);
            }
        } catch {
            // parsing failed, fall back to textarea editing
            setFields(null);
            setPrimitiveEditing(true);
        }

        setIsEditing(true);
    };

    const cancelEdit = () => {
        setEditValue(normalizeNodeData(nodeData?.text ?? []));
        setFields(null);
        setPrimitiveEditing(false);
        setIsEditing(false);
    };

    const doSave = async () => {
        let parsed: any;

        if (fields) {
            // build object from fields, attempting to parse field values as JSON primitives when possible
            const out: Record<string, any> = {};
            Object.keys(fields).forEach(k => {
                const v = fields[k];
                try {
                    out[k] = JSON.parse(v);
                } catch {
                    out[k] = v;
                }
            });

            // Merge edited primitive fields into the existing node value (preserve nested keys)
            const jsonStoreSnapshot = (useJson as any).getState ? (useJson as any).getState() : null;
            const currentRoot = jsonStoreSnapshot?.json ?? jsonStoreSnapshot ?? null;
            if (currentRoot != null) {
                const parsedRoot = typeof currentRoot === "string" ? JSON.parse(currentRoot) : currentRoot;
                const originalValue = getValueAtPath(parsedRoot, nodeData?.path);
                if (originalValue && typeof originalValue === "object" && !Array.isArray(originalValue)) {
                    parsed = { ...originalValue, ...out };
                } else {
                    parsed = out;
                }
            } else {
                // fallback: merge into what we can infer from nodeData (best-effort)
                try {
                    const orig = JSON.parse(normalizeNodeData(nodeData?.text ?? []));
                    if (orig && typeof orig === "object") parsed = { ...orig, ...out };
                    else parsed = out;
                } catch {
                    parsed = out;
                }
            }

            setEditValue(JSON.stringify(parsed, null, 2));
        } else {
            try {
                parsed = JSON.parse(editValue);
            } catch (err) {
                window.alert("Invalid JSON. Fix errors before saving.");
                return;
            }
        }

        const newText = buildNodeTextFromParsed(parsed);

        // update graph store selected node (best-effort)
        const graphStore = (useGraph as any).getState ? (useGraph as any).getState() : null;
        try {
            if (graphStore) {
                if (typeof graphStore.updateNode === "function" && nodeData?.id != null) {
                    graphStore.updateNode(nodeData.id, { ...nodeData, text: newText });
                } else if (typeof graphStore.setNode === "function" && nodeData?.id != null) {
                    graphStore.setNode(nodeData.id, { ...nodeData, text: newText });
                } else if (typeof graphStore.setSelectedNode === "function") {
                    graphStore.setSelectedNode({ ...nodeData, text: newText });
                } else if (typeof graphStore.setNodes === "function") {
                    const nodes = graphStore.nodes ?? [];
                    if (Array.isArray(nodes) && nodeData?.id != null) {
                        const updated = nodes.map((n: any) => (n.id === nodeData.id ? { ...n, text: newText } : n));
                        graphStore.setNodes(updated);
                    }
                }
            }
        } catch {
            // ignore graph update errors; we'll reparse graph after updating JSON
        }

        // --- Persist into app JSON (useJson) so graph can be rebuilt from source ---
        const jsonStore = (useJson as any).getState ? (useJson as any).getState() : null;
        try {
            const currentRoot = jsonStore?.json ?? jsonStore?.rawJson ?? jsonStore ?? null;
            if (currentRoot != null) {
                // if currentRoot is a string, parse it
                const parsedRoot = typeof currentRoot === "string" ? JSON.parse(currentRoot) : currentRoot;
                const patched = setValueAtPath(parsedRoot, nodeData?.path, parsed);

                // serialize patched JSON because useJson.setJson expects a string
                const patchedStr = typeof patched === "string" ? patched : JSON.stringify(patched, null, 2);

                // prefer named setter on json store
                if (jsonStore) {
                    if (typeof jsonStore.setJson === "function") {
                        jsonStore.setJson(patchedStr);
                    } else if (typeof jsonStore.setRawJson === "function") {
                        jsonStore.setRawJson(patchedStr);
                    } else if (typeof jsonStore.setRawText === "function") {
                        jsonStore.setRawText(patchedStr);
                    } else if (typeof (useJson as any).setState === "function") {
                        // fallback to Zustand setState with serialized JSON
                        (useJson as any).setState({ json: patchedStr });
                    } else {
                        // last fallback: dispatch event for external handling
                        window.dispatchEvent(new CustomEvent("jsoncrack.nodeModal.save", { detail: { path: nodeData?.path, json: parsed } }));
                    }

                    // --- also update left editor's contents (useFile) so the code editor shows the change immediately ---
                    const fileStore = (useFile as any).getState ? (useFile as any).getState() : null;
                    if (fileStore && typeof fileStore.setContents === "function") {
                        try {
                            // setContents expects an object with a `contents` string (TextEditor uses setContents({ contents, skipUpdate }))
                            fileStore.setContents({ contents: patchedStr, skipUpdate: false });
                        } catch {
                            // ignore failures; we already updated useJson
                        }
                    }

                    // ensure graph is rebuilt from the updated json store
                    if (graphStore && typeof graphStore.setGraph === "function") {
                        // prefer passing the serialized JSON so parser gets the correct input
                        try {
                            graphStore.setGraph(patchedStr);
                        } catch {
                            // if setGraph expects no param it will read from useJson.getState().json
                            try {
                                graphStore.setGraph();
                            } catch {
                                // swallow
                            }
                        }
                    }
                } else {
                    // if no jsonStore snapshot, fallback to dispatch
                    window.dispatchEvent(new CustomEvent("jsoncrack.nodeModal.save", { detail: { path: nodeData?.path, json: parsed } }));
                }
            } else {
                // no current json found -> dispatch event fallback
                window.dispatchEvent(new CustomEvent("jsoncrack.nodeModal.save", { detail: { path: nodeData?.path, json: parsed } }));
            }
        } catch {
            // if any error, fallback to event
            window.dispatchEvent(new CustomEvent("jsoncrack.nodeModal.save", { detail: { path: nodeData?.path, json: parsed } }));
        }

        setIsEditing(false);
        setFields(null);
        setPrimitiveEditing(false);
    };

    return (
        <Modal size="auto" opened={opened} onClose={onClose} centered withCloseButton={false}>
            <Stack pb="sm" gap="sm">
                <Stack gap="xs">
                    <Flex justify="space-between" align="center">
                        <Text fz="xs" fw={500}>
                            Content
                        </Text>

                        <Group spacing="xs">
                            {!isEditing ? (
                                <Button size="xs" onClick={enterEdit}>
                                    Edit
                                </Button>
                            ) : (
                                <>
                                    <Button size="xs" color="green" onClick={doSave}>
                                        Save
                                    </Button>
                                    <Button size="xs" color="red" onClick={cancelEdit}>
                                        Cancel
                                    </Button>
                                </>
                            )}
                            <CloseButton onClick={() => { cancelEdit(); onClose?.(); }} />
                        </Group>
                    </Flex>

                    <ScrollArea.Autosize mah={250} maw={600}>
                        {!isEditing ? (
                            <CodeHighlight
                                code={normalizeNodeData(nodeData?.text ?? [])}
                                miw={350}
                                maw={600}
                                language="json"
                                withCopyButton
                            />
                        ) : (
                            <>
                                {fields ? (
                                    <Stack spacing="sm">
                                        {Object.keys(fields).map(key => (
                                            <div key={key}>
                                                <Text fz="xs" fw={600} mb={4}>
                                                    {key}
                                                </Text>
                                                <TextInput
                                                    value={fields[key]}
                                                    onChange={e =>
                                                        setFields(prev => ({ ...(prev ?? {}), [key]: e.currentTarget.value }))
                                                    }
                                                    radius="sm"
                                                    size="sm"
                                                    styles={{ input: { backgroundColor: "transparent" } }}
                                                />
                                            </div>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Textarea
                                        value={editValue}
                                        onChange={event => setEditValue(event.currentTarget.value)}
                                        minRows={6}
                                        autosize
                                        miw={350}
                                        maw={600}
                                    />
                                )}
                            </>
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