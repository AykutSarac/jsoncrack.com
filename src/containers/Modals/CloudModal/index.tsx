import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  Modal,
  Group,
  Button,
  Text,
  Stack,
  Loader,
  Center,
  Divider,
  ScrollArea,
  ModalProps,
  Paper,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { AiOutlineEdit, AiOutlineLock, AiOutlinePlus, AiOutlineUnlock } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { IoRocketSharp } from "react-icons/io5";
import { deleteJson, getAllJson, saveToCloud, updateJson } from "src/services/json";
import useFile, { File } from "src/store/useFile";
import useModal from "src/store/useModal";
import useUser from "src/store/useUser";

dayjs.extend(relativeTime);

const StyledJsonCard = styled.a<{ active?: boolean; create?: boolean }>`
  display: ${({ create }) => (create ? "block" : "flex")};
  align-items: center;
  justify-content: space-between;
  line-height: 20px;
  padding: 6px;
  border-radius: 3px;
  overflow: hidden;
  flex: 1;
  height: 60px;
  background: ${({ active }) => active && "rgb(48, 98, 197)"};
`;

const StyledInfo = styled.div``;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  width: fit-content;
  cursor: pointer;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StyledDetils = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 4px;
`;

const StyledCreateWrapper = styled.div`
  display: flex;
  height: 100%;
  gap: 6px;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  height: 30px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
`;

const StyledNameInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  width: 90%;
  color: ${({ theme }) => theme.SEAGREEN};
  font-weight: 600;
`;

const GraphCard: React.FC<{ data: File; refetch: () => void; active: boolean }> = ({
  data,
  refetch,
  active,
  ...props
}) => {
  const [editMode, setEditMode] = React.useState(false);
  const [name, setName] = React.useState(data.name);

  const onSubmit = () => {
    toast
      .promise(updateJson(data._id, { name }), {
        loading: "Updating document...",
        error: "Error occurred while updating document!",
        success: `Renamed document to ${name}`,
      })
      .then(refetch);

    setEditMode(false);
  };

  const onDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    toast
      .promise(deleteJson(data._id), {
        loading: "Deleting file...",
        error: "An error occurred while deleting the file!",
        success: `Deleted ${name}!`,
      })
      .then(refetch);
  };

  return (
    <Paper withBorder w="100%">
      <StyledJsonCard
        href={`?json=${data._id}`}
        as={editMode ? "div" : "a"}
        active={active}
        {...props}
      >
        <StyledInfo>
          {editMode ? (
            <form onSubmit={onSubmit}>
              <StyledNameInput
                value={name}
                onChange={e => setName(e.currentTarget.value)}
                onClick={e => e.preventDefault()}
                autoFocus
              />
              <input type="submit" hidden />
            </form>
          ) : (
            <StyledTitle
              onClick={e => {
                e.preventDefault();
                setEditMode(true);
              }}
            >
              <span>{name}</span>
              <AiOutlineEdit />
            </StyledTitle>
          )}
          <StyledDetils>
            {data.private ? <AiOutlineLock /> : <AiOutlineUnlock />}
            Last modified {dayjs(data.updatedAt).fromNow()}
          </StyledDetils>
        </StyledInfo>
        <Button variant="subtle" color="red" onClick={onDeleteClick}>
          <FaTrash />
        </Button>
      </StyledJsonCard>
    </Paper>
  );
};

const CreateCard: React.FC<{ reachedLimit: boolean }> = ({ reachedLimit }) => {
  const { replace } = useRouter();
  const isPremium = useUser(state => state.premium);
  const getContents = useFile(state => state.getContents);
  const setHasChanges = useFile(state => state.setHasChanges);
  const setVisible = useModal(state => state.setVisible);

  const onCreate = async () => {
    try {
      toast.loading("Saving document...", { id: "fileSave" });
      const res = await saveToCloud(getContents());

      if (res.errors && res.errors.items.length > 0) throw res.errors;

      toast.success("Document saved to cloud", { id: "fileSave" });
      setHasChanges(false);
      replace({ query: { json: res.data._id } });
    } catch (error: any) {
      if (error?.items?.length > 0) {
        return toast.error(error.items[0].message, { id: "fileSave", duration: 7000 });
      }
      toast.error("Failed to save document!", { id: "fileSave" });
    }
  };

  if (!isPremium && reachedLimit)
    return (
      <StyledJsonCard onClick={() => setVisible("premium")(true)}>
        <StyledCreateWrapper>
          <IoRocketSharp size="18" />
          <Text fw="bold">You reached max limit, upgrade to premium for more!</Text>
        </StyledCreateWrapper>
      </StyledJsonCard>
    );

  return (
    <StyledJsonCard onClick={onCreate} create>
      <StyledCreateWrapper>
        <AiOutlinePlus size="20" />
        <Text fw="bold">Create New File</Text>
      </StyledCreateWrapper>
    </StyledJsonCard>
  );
};

export const CloudModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const { isReady, query } = useRouter();

  const { data, isFetching, refetch } = useQuery(["allJson", query], () => getAllJson(), {
    enabled: isReady && opened,
  });

  return (
    <Modal title="Saved On The Cloud" opened={opened} onClose={onClose} centered>
      <ScrollArea h={360}>
        <Stack py="sm">
          {isFetching ? (
            <Center>
              <Loader />
            </Center>
          ) : (
            <>
              <CreateCard reachedLimit={data ? data?.data.result.length > 15 : false} />
              {data?.data?.result?.map(json => (
                <GraphCard
                  data={json}
                  key={json._id}
                  refetch={refetch}
                  active={query?.json === json._id}
                />
              ))}
            </>
          )}
        </Stack>
      </ScrollArea>

      <Divider py="xs" />
      <Group position="right">
        <Text fz="xs">
          Cloud Save feature is for ease-of-access only and not recommended to store sensitive data,
          we don&apos;t guarantee protection of your data.
        </Text>
      </Group>
    </Modal>
  );
};
