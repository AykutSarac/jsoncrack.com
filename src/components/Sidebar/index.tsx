import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { FaFileImport } from "react-icons/fa";
import {
  MdUnfoldMore,
  MdUnfoldLess,
  MdAutoFixHigh,
  MdOutlineAutoFixOff,
} from "react-icons/md";
import {
  AiFillHome,
  AiFillDelete,
  AiFillGithub,
  AiOutlineTwitter,
} from "react-icons/ai";
import {
  CgArrowLongDownE,
  CgArrowLongLeftE,
  CgArrowLongRightE,
  CgArrowLongUpE,
} from "react-icons/cg";

import { CanvasDirection } from "reaflow";
import toast from "react-hot-toast";
import { Tooltip } from "../Tooltip";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
import { useRouter } from "next/router";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 42px;
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  padding: 8px;
  border-right: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
`;

const StyledElement = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  width: 100%;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  cursor: pointer;

  &:hover :is(a, svg) {
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  svg {
    padding: 8px 0;
    vertical-align: middle;
  }
`;

const StyledText = styled.span<{ secondary?: boolean }>`
  color: ${({ theme, secondary }) =>
    secondary ? theme.INTERACTIVE_NORMAL : theme.ORANGE};
`;

const StyledTopWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > div:nth-child(n + 1) {
    border-bottom: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
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
    border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
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
  if (layout === "LEFT") return <CgArrowLongLeftE />;
  if (layout === "UP") return <CgArrowLongDownE />;
  if (layout === "RIGHT") return <CgArrowLongRightE />;
  return <CgArrowLongUpE />;
}

export const Sidebar: React.FC = () => {
  const {
    states: { settings },
    dispatch,
  } = useConfig();
  const router = useRouter();
  const [jsonFile, setJsonFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setJsonFile(e.target.files?.item(0));
  };

  React.useEffect(() => {
    if (jsonFile) {
      const reader = new FileReader();

      reader.readAsText(jsonFile, "UTF-8");
      reader.onload = function (data) {
        dispatch({
          type: ConfigActionType.SET_JSON,
          payload: data.target?.result as string,
        });
      };
    }
  }, [jsonFile, dispatch]);

  return (
    <StyledSidebar>
      <StyledTopWrapper>
        <Link passHref href="/">
          <StyledElement onClick={() => router.push("/")}>
            <StyledLogo>
              <StyledText>J</StyledText>
              <StyledText secondary>V</StyledText>
            </StyledLogo>
          </StyledElement>
        </Link>
        <Tooltip title="Home">
          <StyledElement onClick={() => router.push("/")}>
            <AiFillHome />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Auto Format">
          <StyledElement
            onClick={() => {
              dispatch({ type: ConfigActionType.TOGGLE_AUTOFORMAT });
              toast(
                `Auto format has been ${
                  settings.autoformat ? "disabled." : "enabled."
                }`
              );
            }}
          >
            {settings.autoformat ? <MdAutoFixHigh /> : <MdOutlineAutoFixOff />}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Change Layout">
          <StyledElement
            onClick={() => dispatch({ type: ConfigActionType.TOGGLE_LAYOUT })}
          >
            {getLayoutIcon(settings.layout)}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Toggle Compact Nodes">
          <StyledElement
            title="Toggle Expand/Collapse"
            onClick={() => {
              dispatch({ type: ConfigActionType.TOGGLE_EXPAND });
              toast(`${settings.expand ? "Collapsed" : "Expanded"} nodes.`);
            }}
          >
            {settings.expand ? <MdUnfoldMore /> : <MdUnfoldLess />}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Clear JSON">
          <StyledElement
            onClick={() => {
              dispatch({ type: ConfigActionType.SET_JSON, payload: "[]" });
              localStorage.removeItem("json");
              toast.success(`Cleared JSON and removed from memory.`);
            }}
          >
            <AiFillDelete />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Import File">
          <StyledElement>
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
            <a aria-label="Twitter" rel="me" target="_blank">
              <AiOutlineTwitter />
            </a>
          </Link>
        </StyledElement>
        <StyledElement>
          <Link href="https://github.com/AykutSarac/jsonvisio.com">
            <a aria-label="GitHub" rel="me" target="_blank">
              <AiFillGithub />
            </a>
          </Link>
        </StyledElement>
      </StyledBottomWrapper>
    </StyledSidebar>
  );
};
