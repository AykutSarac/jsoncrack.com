import React from "react";
import type { ModalProps } from "@mantine/core";
import { Modal, Group, Button, TextInput, Stack, Paper, Text, Select } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { AiOutlineUpload } from "react-icons/ai";
import type { FileFormat } from "../../../enums/file.enum";
import useFile from "../../../store/useFile";

export const ImportModal = ({ opened, onClose }: ModalProps) => {
  const [url, setURL] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [encoding, setEncoding] = React.useState("utf-8");

  const encodingOptions = [
    { value: "utf-8", label: "UTF-8 (default)" },
    { value: "utf-16le", label: "UTF-16 LE" },
    { value: "utf-16be", label: "UTF-16 BE" },
    { value: "iso-8859-1", label: "ISO-8859-1 (Latin-1)" },
  ];

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
          onClose();
        })
        .catch(() => toast.error("Failed to fetch JSON!"))
        .finally(() => toast.dismiss("toastFetch"));
    } else if (file) {
      const lastIndex = file.name.lastIndexOf(".");
      const format = file.name.substring(lastIndex + 1);
      setFormat(format as FileFormat);

      file
        .arrayBuffer()
        .then(buffer => {
          const decoder = new TextDecoder(encoding);
          const text = decoder.decode(buffer);
          setContents({ contents: text });
          setFile(null);
          setURL("");
          onClose();
        })
        .catch(() => {
          toast.error(`Failed to decode file using ${encoding}`);
        });

      gaEvent("import_file", { label: format });
    }
  };

  return (
    <Modal
      title="Import File"
      opened={opened}
      onClose={() => {
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
        <Select
          label="File Encoding"
          data={encodingOptions}
          value={encoding}
          onChange={value => value && setEncoding(value)}
        />
      </Stack>
      <Group justify="right">
        <Button onClick={handleImportFile} disabled={!(file || url)}>
          Import
        </Button>
      </Group>
    </Modal>
  );
};
