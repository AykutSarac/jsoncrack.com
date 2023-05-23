import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Flex, Text } from "@mantine/core";
import toast from "react-hot-toast";
import {
  AiOutlineCloudSync,
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineLock,
  AiOutlineUnlock,
} from "react-icons/ai";
import { MdReportGmailerrorred, MdOutlineCheckCircleOutline } from "react-icons/md";
import { VscAccount, VscWorkspaceTrusted } from "react-icons/vsc";
import { updateJson } from "src/services/json";
import useFile from "src/store/useFile";
import useModal from "src/store/useModal";
import useStored from "src/store/useStored";
import useUser from "src/store/useUser";

const StyledBottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  max-height: 27px;
  height: 27px;
  padding: 0 6px;

  @media screen and (max-width: 320px) {
    display: none;
  }
`;

const StyledLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 4px;

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const StyledRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 4px;
`;

const StyledBottomBarItem = styled.button<{ error?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin: 0;
  height: 28px;
  padding: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme, error }) => (error ? theme.DANGER : theme.INTERACTIVE_NORMAL)};
  background: ${({ error }) => error && "rgba(255, 99, 71, 0.4)"};

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
  const { query } = useRouter();
  const data = useFile(state => state.fileData);
  const user = useUser(state => state.user);
  const premium = useUser(state => state.premium);
  const lightmode = useStored(state => state.lightmode);
  const hasChanges = useFile(state => state.hasChanges);
  const hasErrors = useFile(state => state.hasError);
  const getContents = useFile(state => state.getContents);

  const setVisible = useModal(state => state.setVisible);
  const setHasChanges = useFile(state => state.setHasChanges);
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setIsPrivate(data?.private ?? true);
  }, [data]);

  const handleSaveJson = React.useCallback(async () => {
    if (!user) return setVisible("login")(true);
    if (!query?.json) return setVisible("cloud")(true);

    if (typeof query?.json === "string" && hasChanges) {
      try {
        setIsUpdating(true);
        toast.loading("Saving document...", { id: "fileUpdate" });
        const res = await updateJson(query?.json, { json: getContents() });

        if (res.errors && res.errors.items.length > 0) throw res.errors;
        toast.success("Document saved to cloud", { id: "fileUpdate" });
        setHasChanges(false);
      } catch (error: any) {
        if (error?.items?.length > 0) {
          return toast.error(error.items[0].message, { id: "fileUpdate", duration: 5000 });
        }

        toast.error("Failed to save document!", { id: "fileUpdate" });
      }
    }
  }, [getContents, hasChanges, query, setHasChanges, setVisible, user]);

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
      {data?.name && (
        <Head>
          <title>{data.name} | JSON Crack</title>
        </Head>
      )}
      <StyledLeft>
        <StyledBottomBarItem onClick={handleLoginClick}>
          <VscAccount />
          {user ? user.name : "Login"}
        </StyledBottomBarItem>
        {!premium && (
          <StyledBottomBarItem onClick={() => setVisible("premium")(true)}>
            <VscWorkspaceTrusted />
            Upgrade to Premium
          </StyledBottomBarItem>
        )}
        <StyledBottomBarItem error={hasErrors}>
          {hasErrors ? (
            <Flex align="center" gap={2}>
              <MdReportGmailerrorred color="red" size={16} />
              <Text fw="bold">Invalid Format</Text>
            </Flex>
          ) : (
            <Flex align="center" gap={2}>
              <MdOutlineCheckCircleOutline />
              <Text>Valid Format</Text>
            </Flex>
          )}
        </StyledBottomBarItem>
        <StyledBottomBarItem onClick={handleSaveJson} disabled={isUpdating}>
          {hasChanges ? <AiOutlineCloudUpload /> : <AiOutlineCloudSync />}
          {hasChanges ? (query?.json ? "Unsaved Changes" : "Create Document") : "Saved"}
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
