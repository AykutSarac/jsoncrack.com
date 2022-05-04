import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import styled from "styled-components";
import { CanvasDirection } from "reaflow";
import { TiFlowMerge } from "react-icons/ti";
import { BsList } from "react-icons/bs";
import { MdUploadFile } from "react-icons/md";
import { RiPatreonFill } from "react-icons/ri";
import { CgArrowsMergeAltH, CgArrowsShrinkH } from "react-icons/cg";
import {
  AiOutlineDelete,
  AiFillGithub,
  AiOutlineTwitter,
  AiOutlineSave,
  AiOutlineFileAdd,
} from "react-icons/ai";

import { Tooltip } from "src/components/Tooltip";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
import { useRouter } from "next/router";

const StyledSidebar = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  width: 36px;
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

const StyledFlowIcon = styled(TiFlowMerge)<{ rotate: number }>`
  transform: rotate(${({ rotate }) => `${rotate}deg`});
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

function rotateLayout(layout: CanvasDirection) {
  if (layout === "LEFT") return 90;
  if (layout === "UP") return 180;
  if (layout === "RIGHT") return 270;
  return 360;
}

export const Sidebar: React.FC = () => {
  const { json, settings, dispatch } = useConfig();
  const router = useRouter();
  const [jsonFile, setJsonFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setJsonFile(e.target.files?.item(0));
  };

  const handleClear = () => {
    dispatch({ type: ConfigActionType.SET_JSON, payload: "{}" });
    localStorage.removeItem("json");
    toast.success(`Cleared JSON and removed from memory.`);
  };

  const handleSave = () => {
    localStorage.setItem("json", json);
    toast.success("Saved JSON successfully!");
  };

  const toggleExpandCollapse = () => {
    dispatch({ type: ConfigActionType.TOGGLE_EXPAND });
    toast(`${settings.expand ? "Collapsed" : "Expanded"} nodes.`);
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
        <Tooltip title="Import File">
          <StyledElement>
            <StyledImportFile>
              <input
                key={jsonFile?.name}
                onChange={handleFileChange}
                type="file"
                accept="application/JSON"
              />
              <AiOutlineFileAdd />
            </StyledImportFile>
          </StyledElement>
        </Tooltip>
        <Tooltip title="Rotate Layout">
          <StyledElement
            onClick={() => dispatch({ type: ConfigActionType.TOGGLE_LAYOUT })}
          >
            <StyledFlowIcon rotate={rotateLayout(settings.layout)} />
          </StyledElement>
        </Tooltip>
        <Tooltip title={settings.expand ? "Shrink Nodes" : "Expand Nodes"}>
          <StyledElement
            title="Toggle Expand/Collapse"
            onClick={toggleExpandCollapse}
          >
            {settings.expand ? <CgArrowsMergeAltH /> : <CgArrowsShrinkH />}
          </StyledElement>
        </Tooltip>
        <Tooltip title="Clear JSON">
          <StyledElement onClick={handleClear}>
            <AiOutlineDelete />
          </StyledElement>
        </Tooltip>
        <Tooltip title="Save JSON">
          <StyledElement onClick={handleSave}>
            <AiOutlineSave />
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
        <StyledElement>
          <Link href="https://www.patreon.com/aykutsarac">
            <a aria-label="Patreon" rel="me" target="_blank">
              <RiPatreonFill />
            </a>
          </Link>
        </StyledElement>
      </StyledBottomWrapper>
    </StyledSidebar>
  );
};
