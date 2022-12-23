import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";
import { AiOutlineEdit, AiOutlineLock, AiOutlinePlus, AiOutlineUnlock } from "react-icons/ai";
import { Modal, ModalProps } from "src/components/Modal";
import { Spinner } from "src/components/Spinner";
import { getAllJson, updateJson } from "src/services/db/json";
import styled from "styled-components";

dayjs.extend(relativeTime);

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: auto;
`;

const StyledJsonCard = styled.a<{ active?: boolean }>`
  display: block;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  border: 2px solid ${({ theme, active }) => (active ? theme.SEAGREEN : theme.BLACK_SECONDARY)};
  border-radius: 5px;
  overflow: hidden;
  flex: 1;
  height: 160px;
`;

const StyledInfo = styled.div`
  padding: 4px 6px;
`;

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

const StyledModal = styled(Modal)`
  #modal-view {
    display: none;
  }
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

const GraphCard: React.FC<{ data: any; refetch: () => void; active: boolean }> = ({
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
        error: "Error occured while updating document!",
        success: `Renamed document to ${name}`,
      })
      .then(refetch);

    setEditMode(false);
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
              e.stopPropagation();
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
    </StyledJsonCard>
  );
};

const CreateCard: React.FC = () => (
  <StyledJsonCard href="/editor">
    <StyledCreateWrapper>
      <AiOutlinePlus size="24" />
      Create New JSON
    </StyledCreateWrapper>
  </StyledJsonCard>
);

export const CloudModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { isReady, query } = useRouter();

  const { data, isFetching, refetch } = useQuery(["allJson", query], () => getAllJson(), {
    enabled: isReady
  });

  return (
    <StyledModal visible={visible} setVisible={setVisible}>
      <Modal.Header>Saved On The Cloud</Modal.Header>
      <Modal.Content>
        <StyledModalContent>
          {isFetching ? (
            <Spinner />
          ) : (
            <>
              <CreateCard />
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
        </StyledModalContent>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}></Modal.Controls>
    </StyledModal>
  );
};
