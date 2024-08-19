import React from "react";
import { Menu, Flex } from "@mantine/core";
import { JSONSchemaFaker } from "json-schema-faker";
import toast from "react-hot-toast";
import { CgChevronDown } from "react-icons/cg";
import { FaRandom } from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { MdCompare, MdFilterListAlt } from "react-icons/md";
import { SiJsonwebtokens } from "react-icons/si";
import { VscSearchFuzzy, VscJson, VscGroupByRefType, VscLock } from "react-icons/vsc";
import { gaEvent } from "src/lib/utils/gaEvent";
import { jsonToContent } from "src/lib/utils/jsonAdapter";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import * as Styles from "./styles";

export const ToolsMenu = () => {
  const setVisible = useModal(state => state.setVisible);
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);
  const getFormat = useFile(state => state.getFormat);

  const randomizeData = async () => {
    try {
      // generate json schema
      const { run } = await import("json_typegen_wasm");
      const jsonSchema = run(
        "Root",
        getJson(),
        JSON.stringify({
          output_mode: "json_schema",
        })
      );

      // generate random data
      const randomJson = JSONSchemaFaker.generate(JSON.parse(jsonSchema));
      const contents = await jsonToContent(JSON.stringify(randomJson, null, 2), getFormat());
      setContents({ contents });

      gaEvent("Tools Menu", "generate mock data");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate mock data");
    }
  };

  return (
    <Menu shadow="md" withArrow>
      <Menu.Target>
        <Styles.StyledToolElement onClick={() => gaEvent("Tools Menu", "toggle menu")}>
          <Flex align="center" gap={3}>
            Tools <CgChevronDown />
          </Flex>
        </Styles.StyledToolElement>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          fz={12}
          leftSection={<VscSearchFuzzy />}
          onClick={() => {
            setVisible("jq")(true);
            gaEvent("Tools Menu", "open", "JSON Query");
          }}
        >
          JSON Query (jq)
        </Menu.Item>
        <Menu.Item
          fz={12}
          leftSection={<VscJson />}
          onClick={() => {
            setVisible("schema")(true);
            gaEvent("Tools Menu", "open", "JSON Schema");
          }}
        >
          JSON Schema
        </Menu.Item>
        <Menu.Item
          fz={12}
          leftSection={<MdFilterListAlt />}
          onClick={() => {
            setVisible("jpath")(true);
            gaEvent("Tools Menu", "open", "JSON Path");
          }}
        >
          JSON Path
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          fz={12}
          leftSection={<FaWandMagicSparkles />}
          rightSection={<VscLock />}
          onClick={() => {
            setVisible("upgrade")(true);
            gaEvent("Tools Menu", "open", "AI Filter");
          }}
        >
          AI-Powered Filter
        </Menu.Item>
        <Menu.Item
          fz={12}
          leftSection={<SiJsonwebtokens />}
          onClick={() => {
            setVisible("jwt")(true);
            gaEvent("Tools Menu", "open", "Decode JWT");
          }}
        >
          Decode JWT
        </Menu.Item>
        <Menu.Item
          fz={12}
          leftSection={<VscGroupByRefType />}
          onClick={() => {
            setVisible("type")(true);
            gaEvent("Tools Menu", "open", "Generate Type");
          }}
        >
          Generate Type
        </Menu.Item>
        <Menu.Item fz={12} leftSection={<FaRandom />} onClick={randomizeData}>
          Randomize Data
        </Menu.Item>
        <Menu.Item
          fz={12}
          leftSection={<MdCompare />}
          rightSection={<VscLock />}
          onClick={() => {
            setVisible("upgrade")(true);
            gaEvent("Tools Menu", "open", "Compare Data");
          }}
        >
          Compare Data
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
