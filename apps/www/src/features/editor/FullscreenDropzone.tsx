import React from "react";
import { Group, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import toast from "react-hot-toast";
import { VscCircleSlash, VscFiles } from "react-icons/vsc";
import { FileFormat } from "../../enums/file.enum";
import useFile from "../../store/useFile";

export const FullscreenDropzone = () => {
  const setContents = useFile(state => state.setContents);

  return (
    <Dropzone.FullScreen
      maxFiles={1}
      accept={[
        "application/json",
        "application/x-yaml",
        "text/csv",
        "application/xml",
        "application/toml",
      ]}
      onReject={files => toast.error(`Unable to load file ${files[0].file.name}`)}
      onDrop={async e => {
        try {
          const fileContent = await e[0].text();
          let fileExtension = e[0].name.split(".").pop() as FileFormat | undefined;
          if (!fileExtension) fileExtension = FileFormat.JSON;
          setContents({ contents: fileContent, format: fileExtension, hasChanges: false });
        } catch (err) {
          toast.error("An error occurred while reading the file.");
          console.error(err);
        }
      }}
    >
      <Group
        justify="center"
        ta="center"
        align="center"
        gap="xl"
        h="100vh"
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <VscFiles size={100} />
          <Text fz="h1" fw={500} mt="lg">
            Upload to JSON Crack
          </Text>
          <Text fz="lg" c="dimmed" mt="sm">
            (Max file size: 300 KB)
          </Text>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <VscCircleSlash size={100} />
          <Text fz="h1" fw={500} mt="lg">
            Invalid file
          </Text>
          <Text fz="lg" c="dimmed" mt="sm">
            Allowed formats are JSON, YAML, CSV, XML, TOML
          </Text>
        </Dropzone.Reject>
      </Group>
    </Dropzone.FullScreen>
  );
};
