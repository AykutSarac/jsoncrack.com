import React from "react";
import { Flex, Group, Select } from "@mantine/core";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { SearchInput } from "src/components/SearchInput";
import { FileFormat } from "src/enums/file.enum";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo";
import { OptionsMenu } from "./OptionsMenu";
import { ToolsMenu } from "./ToolsMenu";
import { ViewMenu } from "./ViewMenu";
import { ViewModeMenu } from "./ViewModeMenu";
import { ZoomMenu } from "./ZoomMenu";
import * as Styles from "./styles";

function fullscreenBrowser() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {
      toast.error("Unable to enter fullscreen mode.");
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

export const Toolbar: React.FC<{ isWidget?: boolean }> = ({ isWidget = false }) => {
  const getJson = useJson(state => state.getJson);
  const setVisible = useModal(state => state.setVisible);

  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([getJson()], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = "jsoncrack.json";
    a.click();
  };

  return (
    <Styles.StyledTools>
      {isWidget && <Logo />}
      {!isWidget && (
        <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
          <Styles.StyledToolElement title="JSON Crack">
            <Flex gap="xs" align="center" justify="center">
              <JSONCrackLogo fontSize="1.2em" />
            </Flex>
          </Styles.StyledToolElement>

          <Select
            defaultValue="json"
            size="xs"
            value={format}
            onChange={e => setFormat(e as FileFormat)}
            miw={80}
            w={120}
            data={[
              { value: FileFormat.JSON, label: "JSON" },
              { value: FileFormat.YAML, label: "YAML" },
              { value: FileFormat.XML, label: "XML" },
              { value: FileFormat.TOML, label: "TOML" },
              { value: FileFormat.CSV, label: "CSV" },
            ]}
          />

          <ViewModeMenu />
          <Styles.StyledToolElement title="Import File" onClick={() => setVisible("import")(true)}>
            Import
          </Styles.StyledToolElement>
          <ViewMenu />
          <ToolsMenu />
          <Styles.StyledToolElement title="Cloud" onClick={() => setVisible("cloud")(true)}>
            Cloud
          </Styles.StyledToolElement>
          <Styles.StyledToolElement title="Download as File" onClick={handleSave}>
            Download
          </Styles.StyledToolElement>
        </Group>
      )}
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        <SearchInput />
        {!isWidget && (
          <>
            <Styles.StyledToolElement
              title="Save as Image"
              onClick={() => setVisible("download")(true)}
            >
              <FiDownload size="18" />
            </Styles.StyledToolElement>
            <ZoomMenu />
            <AccountMenu />
            <OptionsMenu />
            <Styles.StyledToolElement
              title="Fullscreen"
              $hide={isWidget}
              onClick={fullscreenBrowser}
            >
              <AiOutlineFullscreen size="18" />
            </Styles.StyledToolElement>
          </>
        )}
      </Group>
    </Styles.StyledTools>
  );
};
