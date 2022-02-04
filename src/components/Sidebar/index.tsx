import Link from "next/link";
import React from "react";
import styled from "styled-components";
import {
  AiFillHome,
  AiOutlineClear,
  AiFillGithub,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FaFileImport } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";
import { useLocalStorage } from "usehooks-ts";
import { defaultValue } from "src/containers/JsonEditor";
import { getNextLayout } from "src/containers/LiveEditor/helpers";

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

const StyledElement = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  width: 100%;
  color: ${({ theme }) => theme.SILVER};
  cursor: pointer;

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

const fileToJson = (file: File, setJson: (val: string) => void) => {
  const reader = new FileReader();

  reader.readAsText(file, "UTF-8");
  reader.onload = function (data) {
    setJson(data.target?.result as string);
  };
};

export const Sidebar = () => {
  const [jsonFile, setJsonFile] = React.useState<File | any>(null);
  const [_, setJson] = useLocalStorage("json", JSON.stringify(defaultValue));
  const [layout, setLayout] = useLocalStorage<"TB" | "BT" | "RL" | "LR">(
    "layout",
    "RL"
  );

  const handleClear = () => {
    setJson("[]");
  };

  React.useEffect(() => {
    if (jsonFile) {
      fileToJson(jsonFile, setJson);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonFile]);

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
        <StyledElement as="a" onClick={handleClear} title="Clear JSON">
          <AiOutlineClear />
        </StyledElement>
        <StyledElement title="Import JSON File">
          <a>
            <StyledImportFile>
              <input
                key={jsonFile}
                onChange={(e) => setJsonFile(e.target.files?.item(0))}
                type="file"
                accept="application/JSON"
              />
              <FaFileImport />
            </StyledImportFile>
          </a>
        </StyledElement>
        <StyledElement
          as="a"
          onClick={() => setLayout(getNextLayout(layout))}
          title="Change Layout"
        >
          <MdAutoGraph />
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
