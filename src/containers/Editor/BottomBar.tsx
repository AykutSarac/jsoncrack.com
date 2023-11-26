import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Flex, Popover, Text } from "@mantine/core";
import toast from "react-hot-toast";
import {
  AiOutlineCloudSync,
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineLock,
  AiOutlineUnlock,
} from "react-icons/ai";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { TbTransform } from "react-icons/tb";
import {
  VscAccount,
  VscError,
  VscFeedback,
  VscSourceControl,
  VscSync,
  VscSyncIgnored,
  VscWorkspaceTrusted,
} from "react-icons/vsc";
import { documentSvc } from "src/services/document.service";
import useFile from "src/store/useFile";
import useGraph from "src/store/useGraph";
import useModal from "src/store/useModal";
import useStored from "src/store/useStored";
import useUser from "src/store/useUser";

const StyledBottomBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  max-height: 27px;
  height: 27px;
  z-index: 35;
  padding-right: 6px;

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

const StyledBottomBarItem = styled.button<{ $bg?: string }>`
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
  background: ${({ $bg }) => $bg};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover:not(&:disabled) {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const BottomBar = () => {
  const { query, replace } = useRouter();
  const data = useFile(state => state.fileData);
  const user = useUser(state => state.user);
  const premium = useUser(state => state.premium);
  const toggleLiveTransform = useStored(state => state.toggleLiveTransform);
  const liveTransform = useStored(state => state.liveTransform);
  const hasChanges = useFile(state => state.hasChanges);
  const error = useFile(state => state.error);
  const getContents = useFile(state => state.getContents);
  const setContents = useFile(state => state.setContents);
  const nodeCount = useGraph(state => state.nodes.length);
  const fileName = useFile(state => state.fileData?.name);

  const setVisible = useModal(state => state.setVisible);
  const setHasChanges = useFile(state => state.setHasChanges);
  const getFormat = useFile(state => state.getFormat);
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setIsPrivate(data?.private ?? true);
  }, [data]);

  const handleSaveJson = React.useCallback(async () => {
    if (!user) return setVisible("login")(true);

    if (
      hasChanges &&
      !error &&
      (typeof query.json === "string" || typeof query.json === "undefined")
    ) {
      try {
        setIsUpdating(true);
        toast.loading("Saving document...", { id: "fileSave" });

        const { data, error } = await documentSvc.upsert({
          id: query?.json,
          contents: getContents(),
          format: getFormat(),
        });

        if (error) throw error;
        if (data) replace({ query: { json: data } });

        toast.success("Document saved to cloud", { id: "fileSave" });
        setHasChanges(false);
      } catch (error: any) {
        toast.error(error.message, { id: "fileSave" });
      } finally {
        setIsUpdating(false);
      }
    }
  }, [
    error,
    getContents,
    getFormat,
    hasChanges,
    query.json,
    replace,
    setHasChanges,
    setVisible,
    user,
  ]);

  const handleLoginClick = () => {
    if (user) return setVisible("account")(true);
    else setVisible("login")(true);
  };

  const setPrivate = async () => {
    try {
      if (!query.json) return handleSaveJson();
      setIsUpdating(true);

      const { data: updatedJsonData, error } = await documentSvc.update(query.json as string, {
        private: !isPrivate,
      });

      if (error) return toast.error(error.message);

      if (updatedJsonData[0]) {
        setIsPrivate(updatedJsonData[0].private);
        toast.success(`Document set to ${isPrivate ? "public" : "private"}.`);
      } else throw error;
    } catch (error) {
      console.error(error);
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
        <StyledBottomBarItem $bg="#1864AB" onClick={handleLoginClick}>
          <Flex align="center" gap={5} px={5}>
            <VscAccount color="white" />
            <Text maw={120} c="white" truncate="end">
              {user?.user_metadata.name ?? "Login"}
            </Text>
          </Flex>
        </StyledBottomBarItem>
        {!premium && (
          <StyledBottomBarItem onClick={() => setVisible("premium")(true)}>
            <VscWorkspaceTrusted />
            Upgrade to Premium
          </StyledBottomBarItem>
        )}
        {fileName && (
          <StyledBottomBarItem onClick={() => setVisible("cloud")(true)}>
            <VscSourceControl />
            {fileName}
          </StyledBottomBarItem>
        )}
        <StyledBottomBarItem>
          {error ? (
            <Popover width="auto" shadow="md" position="top" withArrow>
              <Popover.Target>
                <Flex align="center" gap={2}>
                  <VscError color="red" size={16} />
                  <Text color="red" fw="bold">
                    Invalid
                  </Text>
                </Flex>
              </Popover.Target>
              <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                <Text size="xs">{error}</Text>
              </Popover.Dropdown>
            </Popover>
          ) : (
            <Flex align="center" gap={2}>
              <MdOutlineCheckCircleOutline />
              <Text>Valid</Text>
            </Flex>
          )}
        </StyledBottomBarItem>
        {(data?.owner_email === user?.email || (!data && user)) && (
          <StyledBottomBarItem onClick={handleSaveJson} disabled={isUpdating || error}>
            {hasChanges ? <AiOutlineCloudUpload /> : <AiOutlineCloudSync />}
            {hasChanges ? (query?.json ? "Unsaved Changes" : "Create Document") : "Saved"}
          </StyledBottomBarItem>
        )}
        {data?.owner_email === user?.email && (
          <StyledBottomBarItem onClick={setPrivate} disabled={isUpdating}>
            {isPrivate ? <AiOutlineLock /> : <AiOutlineUnlock />}
            {isPrivate ? "Private" : "Public"}
          </StyledBottomBarItem>
        )}
        <StyledBottomBarItem
          onClick={() => setVisible("share")(true)}
          disabled={isPrivate || !data}
        >
          <AiOutlineLink />
          Share
        </StyledBottomBarItem>
        {liveTransform ? (
          <StyledBottomBarItem onClick={() => toggleLiveTransform(false)}>
            <VscSync />
            <Text>Live Transform</Text>
          </StyledBottomBarItem>
        ) : (
          <StyledBottomBarItem onClick={() => toggleLiveTransform(true)}>
            <VscSyncIgnored />
            <Text>Manual Transform</Text>
          </StyledBottomBarItem>
        )}
        {!liveTransform && (
          <StyledBottomBarItem onClick={() => setContents({})}>
            <TbTransform />
            Transform
          </StyledBottomBarItem>
        )}
      </StyledLeft>

      <StyledRight>
        <StyledBottomBarItem>Nodes: {nodeCount}</StyledBottomBarItem>
        <StyledBottomBarItem onClick={() => setVisible("review")(true)}>
          <VscFeedback />
          Feedback
        </StyledBottomBarItem>
      </StyledRight>
    </StyledBottomBar>
  );
};
