import React from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import {
  AiOutlineCloudSync,
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineLock,
  AiOutlineUnlock,
} from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { saveJson, updateJson } from "src/services/db/json";
import useJson from "src/store/useJson";
import useModal from "src/store/useModal";
import useStored from "src/store/useStored";
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

const StyledImg = styled.img<{ light: boolean }>`
  filter: ${({ light }) => light && "invert(100%)"};
`;

export const BottomBar = () => {
  const { replace, query } = useRouter();
  const data = useJson(state => state.data);
  const user = useUser(state => state.user);
  const lightmode = useStored(state => state.lightmode);
  const hasChanges = useJson(state => state.hasChanges);

  const getJson = useJson(state => state.getJson);
  const setVisible = useModal(state => state.setVisible);
  const setHasChanges = useJson(state => state.setHasChanges);
  const [isPrivate, setIsPrivate] = React.useState(false);

  React.useEffect(() => {
    setIsPrivate(data?.private ?? false);
  }, [data]);

  const handleSaveJson = React.useCallback(() => {
    if (!user) return setVisible("login")(true);

    if (hasChanges) {
      toast.promise(
        saveJson({ id: query.json, data: getJson() }).then(res => {
          if (res.data._id) replace({ query: { json: res.data._id } });
          setHasChanges(false);
        }),
        {
          loading: "Saving JSON...",
          success: "JSON saved to cloud",
          error: "Failed to save JSON to cloud",
        }
      );
    }
  }, [getJson, hasChanges, query.json, replace, setHasChanges, setVisible, user]);

  const handleLoginClick = () => {
    if (user) return setVisible("account")(true);
    else setVisible("login")(true);
  };

  const setPrivate = () => {
    if (!query.json) return handleSaveJson();
    setIsPrivate(!isPrivate);
    updateJson(query.json as string, { private: !isPrivate });
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
        {data && (
          <>
            {typeof data.private !== "undefined" && (
              <StyledBottomBarItem onClick={setPrivate}>
                {isPrivate ? <AiOutlineLock /> : <AiOutlineUnlock />}
                {isPrivate ? "Private" : "Public"}
              </StyledBottomBarItem>
            )}
            <StyledBottomBarItem onClick={() => setVisible("share")(true)}>
              <AiOutlineLink />
              Share
            </StyledBottomBarItem>
          </>
        )}
      </StyledLeft>
      <StyledRight>
        <a
          href="https://www.altogic.com/?utm_source=jsoncrack&utm_medium=referral&utm_campaign=sponsorship"
          rel="sponsored noreferrer"
          target="_blank"
        >
          <StyledBottomBarItem>
            Powered by
            <StyledImg
              height="20"
              src="https://regexlearn.com/altogic.svg"
              alt="powered by buildable"
              light={lightmode}
            />
          </StyledBottomBarItem>
        </a>
      </StyledRight>
    </StyledBottomBar>
  );
};
