import React from "react";
import { Flex, Menu } from "@mantine/core";
import { CgChevronDown } from "react-icons/cg";
import { gaEvent } from "src/lib/utils/gaEvent";
import useFile from "src/store/useFile";
import useModal from "src/store/useModal";
import * as Styles from "./styles";

export const FileMenu = () => {
  const setVisible = useModal(state => state.setVisible);
  const getContents = useFile(state => state.getContents);
  const getFormat = useFile(state => state.getFormat);

  const handleSave = () => {
    const a = document.createElement("a");
    const file = new Blob([getContents()], { type: "text/plain" });

    a.href = window.URL.createObjectURL(file);
    a.download = `jsoncrack.${getFormat()}`;
    a.click();

    gaEvent("File Menu", "download", getFormat());
  };

  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <Styles.StyledToolElement title="File">
          <Flex align="center" gap={3}>
            File
            <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item fz={12} onClick={() => setVisible("import")(true)}>
          Import
        </Menu.Item>
        <Menu.Item fz={12} onClick={handleSave}>
          Export
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
