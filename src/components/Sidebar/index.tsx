import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useLocalStorage } from "usehooks-ts";
import { FaFileImport } from "react-icons/fa";
import {
  MdUnfoldMore,
  MdUnfoldLess,
  MdAutoFixHigh,
  MdOutlineAutoFixOff,
} from "react-icons/md";
import {
  AiFillHome,
  AiOutlineClear,
  AiFillGithub,
  AiOutlineTwitter,
  AiFillControl,
  AiOutlineControl,
} from "react-icons/ai";
import {
  CgArrowLongDownE,
  CgArrowLongLeftE,
  CgArrowLongRightE,
  CgArrowLongUpE,
} from "react-icons/cg";

import { getNextLayout } from "src/containers/LiveEditor/helpers";
import { StorageConfig } from "src/typings/global";
import { CanvasDirection } from "reaflow";
import { defaultConfig } from "src/constants/data";
import toast from "react-hot-toast";
import { Tooltip } from "../Tooltip";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 42px;
  background: #2f3136;
  padding: 8px;
  border-right: 1px solid ${({ theme }) => theme.SILVER_DARK};
`;

const StyledElement = styled.div<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  width: 100%;
  color: ${({ theme, disabled }) =>
    disabled ? theme.SILVER_DARK : theme.SILVER};
  cursor: pointer;
  pointer-events: ${({ disabled }) => disabled && "none"};

  &:hover {
    filter: brightness(1.3);
  }

  a {
    text-align: center;
    width: 100%;
  }

  svg {
    padding: 8px 0;
    vertical-align: middle;
  }
`;

const StyledText = styled.span<{ secondary?: boolean }>`
  color: ${({ theme, secondary }) =>
    secondary ? theme.FULL_WHITE : theme.ORANGE};
`;

const StyledTopWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > div:first-of-type {
    border-top: 1px solid ${({ theme }) => theme.SILVER_DARK};
  }

  & > div:nth-child(n + 1) {
    border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};
  }
`;

const StyledBottomWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > div,
  a:nth-child(0) {
    border-top: 1px solid ${({ theme }) => theme.SILVER_DARK};
  }
`;

const StyledLogo = styled.div`
  color: ${({ theme }) => theme.FULL_WHITE};
`;

const StyledImportFile = styled.label`
  cursor: pointer;

  input[type="file"] {
    display: none;
  }
`;

function getLayoutIcon(layout: CanvasDirection) {
  if (layout === "LEFT") return <CgArrowLongRightE />;
  if (layout === "UP") return <CgArrowLongDownE />;
  if (layout === "RIGHT") return <CgArrowLongLeftE />;
  return <CgArrowLongUpE />;
}

const Sidebar: React.FC<{
  setJson: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setJson }) => {
  const [jsonFile, setJsonFile] = React.useState<File | null>(null);
  const [config, setConfig] = useLocalStorage<StorageConfig>(
    "config",
    defaultConfig
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setJsonFile(e.target.files?.item(0));
  };

  const toggle = (setting: "expand" | "controls" | "autoformat") => {
    setConfig((c) => ({
      ...c,
      [setting]: !c[setting],
    }));
  };

  React.useEffect(() => {
    if (jsonFile) {
      const reader = new FileReader();

      reader.readAsText(jsonFile, "UTF-8");
      reader.onload = function (data) {
        setJson(data.target?.result as string);
      };
    }
  }, [jsonFile, setJson]);

  return (
    <StyledSidebar>
      <StyledTopWrapper>
        <Link passHref href="/">
          <StyledElement as="a">
            <StyledLogo>
              <StyledText>J</StyledText>
              <StyledText secondary>V</StyledText>
            </StyledLogo>
          </StyledElement>
        </Link>
        <Tooltip title="Home">
          <Link passHref href="/">
            <StyledElement as="a">
              <AiFillHome />
            </StyledElement>
          </Link>
        </Tooltip>
        <Tooltip title="Auto Format">
          <StyledElement
            as="a"
            onClick={() => {
              toggle("autoformat");
              toast(
                `Auto format has been ${
                  config.autoformat ? "disabled." : "enabled."
                }`
              );
            }}
          >
            {config.autoformat ? <MdAutoFixHigh /> : <MdOutlineAutoFixOff />}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Clear JSON">
          <StyledElement
            as="a"
            onClick={() => {
              setJson("[]");
              localStorage.removeItem("json");
              toast.success(`Cleared JSON and removed from memory.`);
            }}
          >
            <AiOutlineClear />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Change Layout">
          <StyledElement
            as="a"
            onClick={() =>
              setConfig((c) => ({
                ...c,
                layout: getNextLayout(c.layout),
              }))
            }
          >
            {getLayoutIcon(config.layout)}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Toggle Control Buttons">
          <StyledElement
            title="Toggle Controls"
            as="a"
            onClick={() => {
              toggle("controls");
              toast(`Controls ${config.controls ? "disabled." : "enabled."}`);
            }}
          >
            {config.controls ? <AiFillControl /> : <AiOutlineControl />}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Toggle Compact Nodes">
          <StyledElement
            as="a"
            title="Toggle Expand/Collapse"
            onClick={() => {
              toggle("expand");
              toast(`${config.expand ? "Collapsed" : "Expanded"} nodes.`);
            }}
          >
            {config.expand ? <MdUnfoldMore /> : <MdUnfoldLess />}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Import File">
          <StyledElement as="a">
            <StyledImportFile>
              <input
                key={jsonFile?.name}
                onChange={handleFileChange}
                type="file"
                accept="application/JSON"
              />
              <FaFileImport />
            </StyledImportFile>
          </StyledElement>
        </Tooltip>
      </StyledTopWrapper>
      <StyledBottomWrapper>
        <StyledElement>
          <Link href="https://twitter.com/aykutsarach">
            <a rel="me" target="_blank">
              <AiOutlineTwitter />
            </a>
          </Link>
        </StyledElement>
        <StyledElement>
          <Link href="https://github.com/AykutSarac/jsonvisio.com">
            <a rel="me" target="_blank">
              <AiFillGithub />
            </a>
          </Link>
        </StyledElement>
      </StyledBottomWrapper>
    </StyledSidebar>
  );
};

export default Sidebar;
