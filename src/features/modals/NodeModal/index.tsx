import React, { useState } from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Stack, Text, ScrollArea, Button, Textarea } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import useGraph from "../../editor/views/GraphView/stores/useGraph";
import useFile from "../../../store/useFile";
import useJson from "../../../store/useJson";

function setValueAtPath(obj: any, path: string | string[], value: any): any {
    // If path is empty, null, or contains only empty strings, replace the root
    if (!path ||
        path === "" ||
        (Array.isArray(path) && path.length === 0) ||
        (Array.isArray(path) && path.every(p => p === "" || p.trim() === ""))) {
        console.log("Replacing root object with:", value);
        return value;
    }

    // Normalize path to array and filter out empty strings
    let keys: string[];
    if (Array.isArray(path)) {
        keys = path.filter(k => k !== "" && k.trim() !== "");
    } else {
        keys = path.toString().split(".").filter(k => k !== "" && k.trim() !== "");
    }

    // If after filtering we have no keys, replace the root
    if (keys.length === 0) {
        console.log("No valid path keys, replacing root with:", value);
        return value;
    }

    console.log("Updating nested path:", keys, "with value:", value);

    // Clone the object to avoid mutation
    const clone = Array.isArray(obj) ? [...obj] : { ...obj };
    let current = clone;

    // Navigate to the parent of the target
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const actualKey = Array.isArray(current) ? Number(key) : key;

        if (!(actualKey in current) || current[actualKey] === undefined) {
            // Create new container based on what the next key looks like
            const nextKey = keys[i + 1];
            current[actualKey] = /^\d+$/.test(nextKey) ? [] : {};
        } else {
            // Clone existing structure
            current[actualKey] = Array.isArray(current[actualKey])
                ? [...current[actualKey]]
                : { ...current[actualKey] };
        }
        current = current[actualKey];
    }

    // Set the final value
    const finalKey = keys[keys.length - 1];
    const actualFinalKey = Array.isArray(current) ? Number(finalKey) : finalKey;
    current[actualFinalKey] = value;

    return clone;
}

const dataToString = (data: any) => {
    const text = Array.isArray(data) ? Object.fromEntries(data) : data;
    const replacer = (_: string, v: string) => {
        if (typeof v === "string") return v.replaceAll('"', "");
        return v;
    };
    return JSON.stringify(text, replacer, 2);
};

export const NodeModal = ({ opened, onClose }: ModalProps) => {
    const setContents = useFile(state => state.setContents);
    const getJson = useJson(state => state.getJson);
    const selectedNode = useGraph(state => state.selectedNode);
    const setSelectedNodeText = useGraph(state => state.setSelectedNodeText);
    const [editMode, setEditMode] = useState(false);
    const [editedText, setEditedText] = useState("");

    console.log("NodeModal render - selectedNode:", selectedNode);
    console.log("NodeModal render - editMode:", editMode);
    console.log("NodeModal render - opened:", opened);

    // Process path - handle various path formats
    let path: string[] = [];
    if (selectedNode?.path) {
        if (Array.isArray(selectedNode.path)) {
            path = selectedNode.path.filter(p => p !== "" && p.trim() !== "" && p !== "{Root}");
        } else if (typeof selectedNode.path === "string") {
            // Filter out special root indicators
            if (selectedNode.path === "{Root}" || selectedNode.path.trim() === "") {
                path = [];
            } else {
                path = selectedNode.path.split(".").filter(p => p !== "" && p.trim() !== "" && p !== "{Root}");
            }
        }
    }

    console.log("Raw selectedNode.path:", selectedNode?.path);
    console.log("Processed path:", path);

    // Format path for display
    const pathString = path.length === 0 ? "root" : path.join(".");

    React.useEffect(() => {
        console.log("useEffect triggered - selectedNode changed:", selectedNode);
        if (selectedNode?.text !== undefined) {
            const textString = dataToString(selectedNode.text);
            console.log("Setting editedText to:", textString);
            setEditedText(textString);
        } else {
            console.log("selectedNode.text is undefined, setting empty string");
            setEditedText("");
        }
    }, [selectedNode]);

    // Don't render the modal content if no node is selected
    if (!selectedNode) {
        console.log("No selectedNode, returning empty modal");
        return (
            <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
                <Stack py="sm" gap="sm">
                    <Text>No node selected</Text>
                </Stack>
            </Modal>
        );
    }

    const handleEdit = () => {
        console.log("Edit button clicked");
        setEditMode(true);
    };

    const handleSave = () => {
        console.log("Save button clicked - starting save process");

        try {
            const parsed = JSON.parse(editedText);
            console.log("Parsed edited text:", parsed);

            // Get current JSON
            const currentJson = JSON.parse(getJson());
            console.log("Current JSON from getJson():", currentJson);
            console.log("Path to update:", path);
            console.log("Is root update?", path.length === 0);

            let updatedJson;

            if (path.length === 0) {
                // Root update - replace entire JSON
                console.log("Performing root replacement");
                updatedJson = parsed;
            } else {
                // Nested update
                console.log("Performing nested update at path:", path);
                updatedJson = setValueAtPath(currentJson, path, parsed);
            }

            console.log("Updated JSON result:", updatedJson);

            // Update the file contents first
            const jsonString = JSON.stringify(updatedJson, null, 2);
            console.log("Setting file contents to:", jsonString);
            setContents({ contents: jsonString, hasChanges: true });

            // Update the visual representation
            console.log("Updating selected node text");
            setSelectedNodeText(parsed);

            setEditMode(false);
            console.log("Save completed successfully");

        } catch (e) {
            console.error("JSON parse error:", e);
            alert("Invalid JSON format: ");
        }
    };

    return (
        <Modal title="Node Content" size="auto" opened={opened} onClose={onClose} centered>
            <Stack py="sm" gap="sm">
                <Stack gap="xs">
                    <Text fz="xs" fw={500}>Content</Text>
                    <ScrollArea.Autosize mah={250} maw={200}>
                        {editMode ? (
                            <Textarea
                                value={editedText}
                                onChange={e => setEditedText(e.currentTarget.value)}
                                minRows={8}
                                autosize
                                miw={350}
                                maw={600}
                                styles={{ input: { fontFamily: "monospace" } }}
                            />
                        ) : (
                            <CodeHighlight
                                code={typeof editedText === "string" ? editedText : ""}
                                miw={350}
                                maw={600}
                                language="json"
                                withCopyButton
                            />
                        )}
                    </ScrollArea.Autosize>
                    {editMode ? (
                        <Button mt="xs" onClick={handleSave}>Save</Button>
                    ) : (
                        <Button mt="xs" onClick={handleEdit}>Edit</Button>
                    )}
                </Stack>
                <Text fz="xs" fw={500}>JSON Path</Text>
                <ScrollArea.Autosize maw={600}>
                    <CodeHighlight
                        code={pathString}
                        miw={350}
                        mah={250}
                        language="text"
                        copyLabel="Copy to clipboard"
                        copiedLabel="Copied to clipboard"
                        withCopyButton
                    />
                </ScrollArea.Autosize>
            </Stack>
        </Modal>
    );
};
