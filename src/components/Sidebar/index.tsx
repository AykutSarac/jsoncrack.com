import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useLocalStorage } from "usehooks-ts";
import { FaFileImport, FaMap } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";
import {
  AiFillHome,
  AiOutlineClear,
  AiFillGithub,
  AiOutlineTwitter,
  AiFillControl,
} from "react-icons/ai";

import { defaultValue } from "src/containers/JsonEditor";
import { getNextLayout } from "src/containers/LiveEditor/helpers";
import { StorageConfig } from "src/typings/global";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 60px;
  background: #2f3136;
  padding: 8px;
  border-right: 1px solid ${({ theme }) => theme.SILVER_DARK};
`;

const StyledElement = styled.div<{ disabled?: boolean }>`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  width: 100%;
  color: ${({ theme, disabled }) =>
    disabled ? theme.SILVER_DARK : theme.SILVER};
  cursor: pointer;
  pointer-events: ${({ disabled }) => disabled && "none"};

  a {
    text-align: center;
    width: 100%;
  }

  svg {
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

  & > div,
  a {
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
  a {
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

export const Sidebar: React.FC<{
  setJson: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setJson }) => {
  const [jsonFile, setJsonFile] = React.useState<File | null>(null);
  const [config, setConfig] = useLocalStorage<StorageConfig>("config", {
    layout: "LEFT",
    minimap: true,
    controls: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setJsonFile(e.target.files?.item(0));
  };

  const toggle = (setting: "minimap" | "controls") => {
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
        <StyledElement>
          <Link href="/">
            <a>
              <StyledLogo>
                <StyledText>J</StyledText>
                <StyledText secondary>V</StyledText>
              </StyledLogo>
            </a>
          </Link>
        </StyledElement>
        <StyledElement title="Home">
          <Link href="/">
            <a>
              <AiFillHome />
            </a>
          </Link>
        </StyledElement>
        <StyledElement as="a" onClick={() => setJson("[]")} title="Clear JSON">
          <AiOutlineClear />
        </StyledElement>
        <StyledElement
          as="a"
          onClick={() =>
            setConfig((c) => ({
              ...c,
              layout: getNextLayout(c.layout),
            }))
          }
          title="Change Layout"
        >
          <MdAutoGraph />
        </StyledElement>
        <StyledElement
          title="Toggle Minimap"
          as="a"
          onClick={() => toggle("minimap")}
          disabled
        >
          <FaMap />
        </StyledElement>
        <StyledElement
          title="Toggle Controls"
          as="a"
          onClick={() => toggle("controls")}
        >
          <AiFillControl />
        </StyledElement>
        <StyledElement title="Import JSON File">
          <a>
            <StyledImportFile>
              <input
                key={jsonFile?.name}
                onChange={handleFileChange}
                type="file"
                accept="application/JSON"
              />
              <FaFileImport />
            </StyledImportFile>
          </a>
        </StyledElement>
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
