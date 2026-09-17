import React from "react";
import type { ModalProps } from "@mantine/core";
import { Alert, Button, Group, LoadingOverlay, Modal, Paper, Stack, Tabs } from "@mantine/core";
import Editor from "@monaco-editor/react";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";
import { VscError, VscInfo } from "react-icons/vsc";
import { contentToJson } from "../../../lib/utils/jsonAdapter";
import useConfig from "../../../store/useConfig";
import useFile from "../../../store/useFile";

type TabType = "formatted" | "minified";

export const CopyJsonModal = ({ opened, onClose }: ModalProps) => {
  const contents = useFile(state => state.contents);
  const format = useFile(state => state.format);
  const fileError = useFile(state => state.error);
  const darkmodeEnabled = useConfig(state => (state.darkmodeEnabled ? "vs-dark" : "light"));

  const [activeTab, setActiveTab] = React.useState<TabType>("formatted");
  const [formattedJson, setFormattedJson] = React.useState("");
  const [minifiedJson, setMinifiedJson] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!opened) return;

    setActiveTab("formatted");
    let isMounted = true;
    setLoading(true);

    const processContent = async () => {
      try {
        const rawContent = contents ?? "";

        if (!rawContent.trim()) {
          if (isMounted) {
            setIsEmpty(true);
            setErrorMessage(null);
            setFormattedJson("");
            setMinifiedJson("");
            setLoading(false);
          }
          return;
        }

        if (fileError) {
          if (isMounted) {
            setIsEmpty(false);
            setErrorMessage(fileError);
            setFormattedJson("");
            setMinifiedJson("");
            setLoading(false);
          }
          return;
        }

        const parsed = await contentToJson(rawContent, format);

        if (!isMounted) return;

        const formatted = parsed !== undefined ? JSON.stringify(parsed, null, 2) : "{}";
        const minified = parsed !== undefined ? JSON.stringify(parsed) : "{}";

        setFormattedJson(formatted);
        setMinifiedJson(minified);
        setErrorMessage(null);
        setIsEmpty(false);
      } catch (err: any) {
        if (isMounted) {
          setFormattedJson("");
          setMinifiedJson("");
          setIsEmpty(false);
          setErrorMessage(err?.message || "Invalid JSON content");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    processContent();

    return () => {
      isMounted = false;
    };
  }, [opened, contents, format, fileError]);

  const copyToClipboard = async (text: string, type: "Formatted" | "Minified") => {
    try {
      if (!text) return;

      let copied = false;
      let lastError: unknown = null;

      if (navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch (clipErr) {
          lastError = clipErr;
        }
      }

      if (!copied) {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "-9999px";
          textarea.setAttribute("readonly", "");
          document.body.appendChild(textarea);
          textarea.select();
          copied = document.execCommand("copy");
          document.body.removeChild(textarea);
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        if (lastError) throw lastError;
        throw new Error("Failed to copy to clipboard");
      }

      toast.success(`${type} JSON copied to clipboard!`);
      gaEvent("copy_json", { label: type.toLowerCase() });
    } catch (error) {
      if (error instanceof Error && error.name === "NotAllowedError") {
        toast.error(
          "Clipboard write permission denied. Please allow clipboard access in your browser settings."
        );
      } else {
        toast.error("Failed to copy to clipboard");
      }
    }
  };

  const canCopy = !isEmpty && !errorMessage && !loading && !!formattedJson;

  return (
    <Modal title="Copy JSON" size="lg" opened={opened} onClose={onClose} centered>
      <Stack>
        <Tabs value={activeTab} onChange={val => setActiveTab(val as TabType)}>
          <Tabs.List>
            <Tabs.Tab value="formatted">Formatted</Tabs.Tab>
            <Tabs.Tab value="minified">Minified</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {isEmpty && (
          <Alert color="gray" title="Editor is empty" icon={<VscInfo size={16} />}>
            There is no content in the editor to copy.
          </Alert>
        )}

        {errorMessage && (
          <Alert color="red" title="Invalid JSON" icon={<VscError size={16} />}>
            {errorMessage}
          </Alert>
        )}

        {!isEmpty && !errorMessage && (
          <Paper withBorder radius="sm" style={{ overflow: "hidden", position: "relative" }}>
            <LoadingOverlay visible={loading} />
            <Editor
              value={activeTab === "formatted" ? formattedJson : minifiedJson}
              theme={darkmodeEnabled}
              height={300}
              language="json"
              options={{
                readOnly: true,
                tabSize: 2,
                scrollBeyondLastLine: false,
                stickyScroll: { enabled: false },
                minimap: { enabled: false },
                automaticLayout: true,
                wordWrap: activeTab === "minified" ? "on" : "off",
              }}
            />
          </Paper>
        )}

        <Group justify="right">
          <Button
            variant="default"
            leftSection={<FiCopy />}
            onClick={() => copyToClipboard(formattedJson, "Formatted")}
            disabled={!canCopy}
          >
            Copy Formatted
          </Button>
          <Button
            color="blue"
            leftSection={<FiCopy />}
            onClick={() => copyToClipboard(minifiedJson, "Minified")}
            disabled={!canCopy}
          >
            Copy Minified
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
