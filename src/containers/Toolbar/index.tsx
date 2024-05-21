import React from "react";
import { Text, Flex, Group, Indicator, Select } from "@mantine/core";
import { useSessionStorage } from "@mantine/hooks";
import toast from "react-hot-toast";
import { AiOutlineFullscreen } from "react-icons/ai";
import { AiFillGift } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { SearchInput } from "src/containers/Toolbar/SearchInput";
import { FileFormat } from "src/enums/file.enum";
import { JSONCrackLogo } from "src/layout/JsonCrackLogo";
import { gaEvent } from "src/lib/utils/gaEvent";
import useFile from "src/store/useFile";
import useModal from "src/store/useModal";
import { AccountMenu } from "./AccountMenu";
import { FileMenu } from "./FileMenu";
import { Logo } from "./Logo";
import { OptionsMenu } from "./OptionsMenu";
import { ToolsMenu } from "./ToolsMenu";
import { ViewMenu } from "./ViewMenu";
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

interface ToolbarProps {
  isWidget?: boolean;
}

export const Toolbar = ({ isWidget = false }: ToolbarProps) => {
  const setVisible = useModal(state => state.setVisible);
  const setFormat = useFile(state => state.setFormat);
  const format = useFile(state => state.format);
  const [seenPremium, setSeenPremium] = useSessionStorage({
    key: "seenPremium",
    defaultValue: false,
  });

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
            allowDeselect={false}
          />

          <FileMenu />
          <ViewMenu />
          <ToolsMenu />
          <Styles.StyledToolElement title="Cloud" onClick={() => setVisible("cloud")(true)}>
            Cloud
          </Styles.StyledToolElement>
        </Group>
      )}
      <Group gap="xs" justify="right" w="100%" style={{ flexWrap: "nowrap" }}>
        {!isWidget && (
          <Styles.StyledToolElement
            onClick={() => {
              setSeenPremium(true);
              setVisible("upgrade")(true);
              gaEvent("Toolbar", "click upgrade premium");
            }}
          >
            <Indicator
              size={5}
              color="green"
              position="top-start"
              processing
              disabled={seenPremium}
            >
              <Text
                display="flex"
                c="teal"
                fz="xs"
                fw={600}
                style={{ textAlign: "center", gap: 4 }}
              >
                <AiFillGift size="18" />
                Get Premium
              </Text>
            </Indicator>
          </Styles.StyledToolElement>
        )}

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
