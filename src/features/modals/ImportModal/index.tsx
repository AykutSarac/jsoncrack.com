import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Group, Button, TextInput, Stack, Paper, Text, Tooltip } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import type { FileFormat } from "../../../enums/file.enum";
import useFile from "../../../store/useFile";
import useWatchMode from "../../../store/useWatchMode";

export const ImportModal = ({ opened, onClose }: ModalProps) => {
  const [url, setURL] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const availableFilePicker = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return "showOpenFilePicker" in window;
  }, []);

  const toggleWatchMode = useWatchMode(state => state.toggleWatchMode);
  const setWatcherInterval = useWatchMode(state => state.setWatcherInterval);
  const setContents = useFile(state => state.setContents);
  const setFormat = useFile(state => state.setFormat);

  const handleImportFile = () => {
    if (url) {
      setFile(null);

      toast.loading("Loading...", { id: "toastFetch" });
      gaEvent("fetch_url");

      return fetch(url)
        .then(res => res.json())
        .then(json => {
          setContents({ contents: JSON.stringify(json, null, 2) });
          toggleWatchMode(false);
          onClose();
        })
        .catch(() => toast.error("Failed to fetch JSON!"))
        .finally(() => toast.dismiss("toastFetch"));
    } else if (file) {
      const lastIndex = file.name.lastIndexOf(".");
      const format = file.name.substring(lastIndex + 1);
      setFormat(format as FileFormat);

      console.log(file);
      file.text().then(text => {
        setContents({ contents: text });
        toggleWatchMode(false);
        setFile(null);
        setURL("");
        onClose();
      });

      gaEvent("import_file", { label: format });
    }
  };

  const enableWatcher = React.useCallback(async () => {
    if (!availableFilePicker) return;

    const [fileHandle] = await window
      .showOpenFilePicker({
        types: [
          {
            description: "Any file",
            accept: {
              "application/json": [".json"],
              "application/x-yaml": [".yaml", ".yml"],
              "text/csv": [".csv"],
              "application/xml": [".xml"],
              "application/toml": [".toml"],
            },
          },
        ],
      })
      .catch(() => []);

    if (!fileHandle) return;

    const file = await fileHandle.getFile();
    let lastModified = file.lastModified;
    const text = await file.text();
    const lastIndex = file.name.lastIndexOf(".");
    const format = file.name.substring(lastIndex + 1);
    setContents({ contents: text, format: format as FileFormat });
    toggleWatchMode(true);
    const interval = setInterval(async () => {
      const newFile = await fileHandle.getFile();
      if (newFile.lastModified !== lastModified) {
        lastModified = newFile.lastModified;
        const text = await newFile.text();
        setContents({ contents: text });
        toast.success("File updated!");
      }
    }, 3_000);
    setWatcherInterval(interval);
    setFile(null);
    setURL("");
    onClose();
  }, [availableFilePicker, onClose, setContents, setWatcherInterval, toggleWatchMode]);

  const WatcherButton = () => {
    if (!availableFilePicker)
      return (
        <Tooltip
          label="Not suported in this browser"
          fz="xs"
          ta="center"
          maw="200"
          withArrow
          openDelay={500}
        >
          <Button disabled={true}>Watcher</Button>
        </Tooltip>
      );

    return (
      <Button onClick={enableWatcher} disabled={!!(file || url)}>
        Watcher
      </Button>
    );
  };

  return (
    <Modal
      title="Import File"
      opened={opened}
      onClose={() => {
        toggleWatchMode(false);
        setFile(null);
        setURL("");
        onClose();
      }}
      centered
    >
      <Stack py="sm">
        <TextInput
          value={url}
          onChange={e => setURL(e.target.value)}
          type="url"
          placeholder="URL of JSON to fetch"
          data-autofocus
        />
        <Paper radius="md" style={{ cursor: "pointer" }}>
          <Dropzone
            onDrop={files => setFile(files[0])}
            onReject={files => toast.error(`Unable to load file ${files[0].file.name}`)}
            maxFiles={1}
            p="md"
            accept={[
              "application/json",
              "application/x-yaml",
              "text/csv",
              "application/xml",
              "application/toml",
            ]}
          >
            <Stack justify="center" align="center" gap="sm" mih={220}>
              <AiOutlineUpload size={48} />
              <Text fw="bold">Drop here or click to upload files</Text>
              <Text c="dimmed" fz="sm">
                {file?.name ?? "None"}
              </Text>
            </Stack>
          </Dropzone>
        </Paper>
      </Stack>
      <Group justify="right">
        <WatcherButton />
        <Button onClick={handleImportFile} disabled={!(file || url)}>
          Import
        </Button>
      </Group>
    </Modal>
  );
};
