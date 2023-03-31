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
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { AiOutlineEdit, AiOutlineLock, AiOutlinePlus, AiOutlineUnlock } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { IoRocketSharp } from "react-icons/io5";
import { deleteJson, getAllJson, saveJson, updateJson } from "src/services/db/json";
import useJson from "src/store/useJson";
import useUser from "src/store/useUser";
import { Json } from "src/typings/altogic";

dayjs.extend(relativeTime);

const StyledJsonCard = styled.a<{ active?: boolean; create?: boolean }>`
  display: ${({ create }) => (create ? "block" : "flex")};
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  line-height: 20px;
  padding: 6px;
  border: 2px solid ${({ theme, active }) => (active ? theme.SEAGREEN : theme.BLACK_SECONDARY)};
  border-radius: 5px;
  overflow: hidden;
  flex: 1;
  height: 160px;
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
  height: 45px;
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

const GraphCard: React.FC<{ data: Json; refetch: () => void; active: boolean }> = ({
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
        loading: "Deleting JSON file...",
        error: "An error occurred while deleting the file!",
        success: `Deleted ${name}!`,
      })
      .then(refetch);
  };

  return (
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
  );
};

const CreateCard: React.FC<{ reachedLimit: boolean }> = ({ reachedLimit }) => {
  const { replace } = useRouter();
  const isPremium = useUser(state => state.isPremium());
  const getJson = useJson(state => state.getJson);
  const setHasChanges = useJson(state => state.setHasChanges);

  const onCreate = async () => {
    try {
      toast.loading("Saving JSON...", { id: "jsonSave" });
      const res = await saveJson({ data: getJson() });

      if (res.errors && res.errors.items.length > 0) throw res.errors;

      toast.success("JSON saved to cloud", { id: "jsonSave" });
      setHasChanges(false);
      replace({ query: { json: res.data._id } });
    } catch (error: any) {
      if (error?.items?.length > 0) {
        return toast.error(error.items[0].message, { id: "jsonSave", duration: 7000 });
      }
      toast.error("Failed to save JSON!", { id: "jsonSave" });
    }
  };

  if (!isPremium && reachedLimit)
    return (
      <StyledJsonCard href="/pricing" create>
        <StyledCreateWrapper>
          <IoRocketSharp size="18" />
          You reached max limit, upgrade to premium for more!
        </StyledCreateWrapper>
      </StyledJsonCard>
    );

  return (
    <StyledJsonCard onClick={onCreate} create>
      <StyledCreateWrapper>
        <AiOutlinePlus size="24" />
        Create New JSON
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
                  active={query.json === json._id}
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
