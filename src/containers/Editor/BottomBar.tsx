import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Badge, Flex, Popover, Text } from "@mantine/core";
import toast from "react-hot-toast";
import {
  AiOutlineCloudSync,
  AiOutlineCloudUpload,
  AiOutlineLink,
  AiOutlineLock,
  AiOutlineUnlock,
} from "react-icons/ai";
import { MdReportGmailerrorred, MdOutlineCheckCircleOutline } from "react-icons/md";
import { TbTransform } from "react-icons/tb";
import {
  VscAccount,
  VscStarEmpty,
  VscSync,
  VscSyncIgnored,
  VscWorkspaceTrusted,
} from "react-icons/vsc";
import { saveToCloud, updateJson } from "src/services/json";
import useFile from "src/store/useFile";
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
  padding: 0 6px;
  z-index: 35;

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

const StyledBottomBarItem = styled.button<{ $error?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin: 0;
  height: 28px;
  padding: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme, $error }) => ($error ? theme.DANGER : theme.INTERACTIVE_NORMAL)};
  background: ${({ $error }) => $error && "rgba(255, 99, 71, 0.4)"};
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

const StyledImg = styled.img<{ $light: boolean }>`
  filter: ${({ $light }) => $light && "invert(100%)"};
`;

export const BottomBar = () => {
  const { query, replace } = useRouter();
  const data = useFile(state => state.fileData);
  const user = useUser(state => state.user);
  const premium = useUser(state => state.premium);
  const lightmode = useStored(state => state.lightmode);
  const toggleLiveTransform = useStored(state => state.toggleLiveTransform);
  const liveTransform = useStored(state => state.liveTransform);
  const hasChanges = useFile(state => state.hasChanges);
  const error = useFile(state => state.error);
  const getContents = useFile(state => state.getContents);
  const setContents = useFile(state => state.setContents);

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

        const { data, error } = await saveToCloud({
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

      const { data: updatedJsonData, error } = await updateJson(query.json as string, {
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
        <StyledBottomBarItem onClick={handleLoginClick}>
          <VscAccount />
          {user?.user_metadata.name ?? "Login"}
          {premium && (
            <Badge size="sm" color="orange" radius="sm" fw="bold">
              PREMIUM
            </Badge>
          )}
        </StyledBottomBarItem>
        {!premium && (
          <StyledBottomBarItem onClick={() => setVisible("premium")(true)}>
            <VscWorkspaceTrusted />
            Upgrade to Premium
          </StyledBottomBarItem>
        )}
        <StyledBottomBarItem $error={!!error}>
          {error ? (
            <Popover width="auto" shadow="md" position="top" withArrow>
              <Popover.Target>
                <Flex align="center" gap={2}>
                  <MdReportGmailerrorred color="red" size={16} />
                  <Text fw="bold">Invalid Format</Text>
                </Flex>
              </Popover.Target>
              <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                <Text size="xs">{error}</Text>
              </Popover.Dropdown>
            </Popover>
          ) : (
            <Flex align="center" gap={2}>
              <MdOutlineCheckCircleOutline />
              <Text>Valid Format</Text>
            </Flex>
          )}
        </StyledBottomBarItem>
        {(data?.owner_email === user?.email || (!data && user)) && (
          <StyledBottomBarItem onClick={handleSaveJson} disabled={isUpdating}>
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
        <StyledBottomBarItem onClick={() => setVisible("review")(true)}>
          <VscStarEmpty />
          Leave Review
        </StyledBottomBarItem>
      </StyledRight>
    </StyledBottomBar>
  );
};
