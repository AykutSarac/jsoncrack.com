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
import { useHotkeysforCtrlAndMeta } from "src/hooks/useKeyPress";

const StyledBottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  max-height: 27px;
  height: 27px;
  padding: 0 6px;

  @media only screen and (max-width: 768px) {
    display: none;
  }
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

  &:hover:not(&:disabled) {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
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
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setIsPrivate(data?.private ?? true);
  }, [data]);

  const handleSaveJson = React.useCallback(async () => {
    if (!user) return setVisible("login")(true);

    if (hasChanges) {
      try {
        setIsUpdating(true);
        toast.loading("Saving JSON...", { id: "jsonSave" });
        const res = await saveJson({ id: query.json as string, data: getJson() });

        if (res.errors && res.errors.items.length > 0) throw res.errors;
        if (res.data._id) replace({ query: { json: res.data._id } });

        toast.success("JSON saved to cloud", { id: "jsonSave" });
        setHasChanges(false);
      } catch (error: any) {
        if (error?.items?.length > 0) {
          return toast.error(error.items[0].message, { id: "jsonSave", duration: 5000 });
        }

        toast.error("Failed to save JSON!", { id: "jsonSave" });
      } finally {
        setIsUpdating(false);
      }
    }
  }, [getJson, hasChanges, query.json, replace, setHasChanges, setVisible, user]);

  useHotkeysforCtrlAndMeta(83, handleSaveJson);

  const handleLoginClick = () => {
    if (user) return setVisible("account")(true);
    else setVisible("login")(true);
  };

  const setPrivate = async () => {
    try {
      if (!query.json) return handleSaveJson();
      setIsUpdating(true);

      const res = await updateJson(query.json as string, { private: !isPrivate });

      if (!res.errors?.items.length) {
        setIsPrivate(res.data.private);
        toast.success(`Document set to ${isPrivate ? "public" : "private"}.`);
      } else throw res.errors;
    } catch (error) {
      toast.error("An error occurred while updating document!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <StyledBottomBar>
      <StyledLeft>
        <StyledBottomBarItem onClick={handleLoginClick}>
          <VscAccount />
          {user ? user.name : "Login"}
        </StyledBottomBarItem>
        <StyledBottomBarItem onClick={handleSaveJson} disabled={isUpdating}>
          {hasChanges ? <AiOutlineCloudUpload /> : <AiOutlineCloudSync />}
          {hasChanges ? "Unsaved Changes" : "Saved"}
        </StyledBottomBarItem>
        {data && (
          <>
            {typeof data.private !== "undefined" && (
              <StyledBottomBarItem onClick={setPrivate} disabled={isUpdating}>
                {isPrivate ? <AiOutlineLock /> : <AiOutlineUnlock />}
                {isPrivate ? "Private" : "Public"}
              </StyledBottomBarItem>
            )}
            <StyledBottomBarItem onClick={() => setVisible("share")(true)} disabled={isPrivate}>
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
              width="54"
              src="https://www.altogic.com/img/logo_dark.svg"
              alt="powered by altogic"
              light={lightmode}
            />
          </StyledBottomBarItem>
        </a>
      </StyledRight>
    </StyledBottomBar>
  );
};
