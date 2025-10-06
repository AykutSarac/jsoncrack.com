import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Group, Button, TextInput, Stack, Paper, Text } from "@mantine/core";
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

  const enableWatcher = async () => {
    // El usuario debe seleccionar el archivo manualmente desde el picker
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Cualquier archivo",
          accept: {
            "application/json": [".json"],
            "application/x-yaml": [".yaml", ".yml"],
            "text/csv": [".csv"],
            "application/xml": [".xml"],
            "application/toml": [".toml"],
          },
        },
      ],
    });

    const file = await fileHandle.getFile();
    let lastModified = file.lastModified;
    const text = await file.text();
    setContents({ contents: text });
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
        <Button onClick={enableWatcher} disabled={!!(file || url)}>
          Watcher
        </Button>
        <Button onClick={handleImportFile} disabled={!(file || url)}>
          Import
        </Button>
      </Group>
    </Modal>
  );
};
