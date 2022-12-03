import React from "react";
import { useRouter } from "next/router";
import {
  AiOutlineCloudSync,
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineUnlock,
} from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { saveJson } from "src/services/db/json";
import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";
import styled from "styled-components";

const StyledBottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  max-height: 28px;
  height: 28px;
  padding: 0 6px;
`;

const StyledLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 4px;
`;

const StyledRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 4px;
`;

const StyledBottomBarItem = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin: 0;
  height: 28px;
  padding: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  &:hover {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }
`;

export const BottomBar = () => {
  const { replace, query } = useRouter();
  const user = useUser(state => state.user);
  const setVisible = useModal(state => state.setVisible);
  const getJson = useGraph(state => state.getJson);
  const hasChanges = useConfig(state => state.hasChanges);
  const setConfig = useConfig(state => state.setConfig);

  const handleSaveJson = async () => {
    if (hasChanges) {
      await saveJson({ id: query.json, data: getJson() }).then(res => {
        if (res.data._id) replace({ query: { json: res.data._id } });
        setConfig("hasChanges", false);
      });
    }
  };

  return (
    <StyledBottomBar>
      <StyledLeft>
        <StyledBottomBarItem onClick={() => setVisible("login")(true)}>
          <VscAccount />
          {user ? user.name : "Login"}
        </StyledBottomBarItem>
        <StyledBottomBarItem onClick={handleSaveJson}>
          {hasChanges ? <AiOutlineCloudUpload /> : <AiOutlineCloudSync />}
          {hasChanges ? "Unsaved Changes" : "Saved"}
        </StyledBottomBarItem>
        <StyledBottomBarItem>
          <AiOutlineUnlock />
          Public
        </StyledBottomBarItem>
        <StyledBottomBarItem onClick={() => setVisible("share")(true)}>
          <AiOutlineLink />
          Share
        </StyledBottomBarItem>
      </StyledLeft>
      <StyledRight>
        <StyledBottomBarItem>
          Powered by
          <img
            height="20"
            src="https://regexlearn.com/altogic.svg"
            alt="powered by buildable"
          />
        </StyledBottomBarItem>
      </StyledRight>
    </StyledBottomBar>
  );
};