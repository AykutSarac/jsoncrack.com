import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  AiOutlineCloudSync,
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineLock,
  AiOutlineUnlock,
} from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { altogic } from "src/services/altogic";
import { getJson, saveJson, updateJson } from "src/services/db/json";
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
  const { isReady, replace, query } = useRouter();

  const { data } = useQuery(
    ["dbJson", query.json],
    () => getJson(query.json as string),
    {
      enabled: isReady && !!query.json,
    }
  );

  const user = useUser(state => state.user);
  const setVisible = useModal(state => state.setVisible);
  const getJsonState = useGraph(state => state.getJson);
  const hasChanges = useConfig(state => state.hasChanges);
  const setConfig = useConfig(state => state.setConfig);
  const [isPrivate, setIsPrivate] = React.useState(true);

  React.useEffect(() => {
    if (data) setIsPrivate(data.data.private);
  }, [data]);

  const handleSaveJson = React.useCallback(() => {
    if (hasChanges) {
      toast.promise(
        saveJson({ id: query.json, data: getJsonState() }).then(res => {
          if (res.data._id) replace({ query: { json: res.data._id } });
          setConfig("hasChanges", false);
        }),
        {
          loading: "Saving JSON...",
          success: "JSON saved to cloud",
          error: "Failed to save JSON to cloud",
        }
      );
    }
  }, [getJsonState, hasChanges, query.json, replace, setConfig]);

  const handleLoginClick = () => {
    if (user) return setVisible("account")(true);
    altogic.auth.signInWithProvider("google");
  };

  const setPrivate = () => {
    if (!query.json) return handleSaveJson();
    updateJson(query.json as string, { private: !isPrivate });
    setIsPrivate(!isPrivate);
  };

  return (
    <StyledBottomBar>
      <StyledLeft>
        <StyledBottomBarItem onClick={handleLoginClick}>
          <VscAccount />
          {user ? user.name : "Login"}
        </StyledBottomBarItem>
        <StyledBottomBarItem onClick={handleSaveJson}>
          {hasChanges ? <AiOutlineCloudUpload /> : <AiOutlineCloudSync />}
          {hasChanges ? "Unsaved Changes" : "Saved"}
        </StyledBottomBarItem>
        <StyledBottomBarItem onClick={setPrivate}>
          {isPrivate ? <AiOutlineLock /> : <AiOutlineUnlock />}
          {isPrivate ? "Private" : "Public"}
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
