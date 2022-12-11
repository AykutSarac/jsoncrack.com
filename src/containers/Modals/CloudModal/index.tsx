import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AiOutlineEdit,
  AiOutlineLock,
  AiOutlinePlus,
  AiOutlineUnlock,
} from "react-icons/ai";
import { Modal, ModalProps } from "src/components/Modal";
import { getAllJson, updateJson } from "src/services/db/json";
import useUser from "src/store/useUser";
import styled from "styled-components";

dayjs.extend(relativeTime);

const StyledModalContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  overflow: auto;
`;

const StyledJsonCard = styled.a`
  display: block;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  border: 2px solid ${({ theme }) => theme.BLACK_SECONDARY};
  border-radius: 5px;
  overflow: hidden;
  min-width: 200px;
  max-width: 250px;
  flex: 1;
  height: 160px;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
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

  span {
    max-width: 100%;
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

interface GraphCardProsp {
  id?: string;
  title: string;
  preview: string;
  details: string;
}

const GraphCard: React.FC<{ data: any }> = ({ data, ...props }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [name, setName] = React.useState(data.name);

  const onSubmit = () => {
    updateJson(data._id, { name });
    setEditMode(false);
  };

  return (
    <StyledJsonCard href={`?json=${data._id}`} {...props}>
      <StyledImg
        width="200"
        height="100"
        src="https://blog.shevarezo.fr/uploads/posts/bulk/FNj3yQLp_visualiser-donnees-json-diagramme-json-crack_rotate3.png"
      />
      <StyledInfo>
        {editMode ? (
          <form onSubmit={onSubmit}>
            <input
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              onClick={e => e.preventDefault()}
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
        <StyledDetils></StyledDetils>
      </StyledInfo>
    </StyledJsonCard>
  );
};

const StyledCreateWrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  cursor: pointer;
`;

const CreateCard: React.FC = () => (
  <StyledJsonCard href="/editor">
    <StyledCreateWrapper>
      <AiOutlinePlus size="30" />
    </StyledCreateWrapper>
  </StyledJsonCard>
);

export const CloudModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { isReady, query } = useRouter();
  const user = useUser(state => state.user);
  const { data, isLoading } = useQuery(
    ["allJson", query, user],
    () => getAllJson(),
    {
      enabled: isReady,
    }
  );

  if (isLoading) return <div>loading</div>;
  return (
    <StyledModal size="lg" visible={visible} setVisible={setVisible}>
      <Modal.Header>Saved On The Cloud</Modal.Header>
      <Modal.Content>
        <StyledModalContent>
          {data?.data?.result?.map(json => (
            <GraphCard data={json} key={json._id} />
          ))}
          <CreateCard />
        </StyledModalContent>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}></Modal.Controls>
    </StyledModal>
  );
};
