import React from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AiOutlinePlus } from "react-icons/ai";
import { Modal, ModalProps } from "src/components/Modal";
import { getAllJson } from "src/services/db/json";
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
  font-size: 14px;
`;

const StyledDetils = styled.div`
  font-size: 12px;
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

const GraphCard: React.FC<{ data: GraphCardProsp }> = ({
  data: { id = "", details, preview, title },
  ...props
}) => (
  <StyledJsonCard href={`?json=${id}`} {...props}>
    <StyledImg width="200" height="100" src={preview}></StyledImg>
    <StyledInfo>
      <StyledTitle>{title}</StyledTitle>
      <StyledDetils>{details}</StyledDetils>
    </StyledInfo>
  </StyledJsonCard>
);

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
  const { data, isLoading } = useQuery(["allJson"], () => getAllJson());

  if (isLoading) return <div>loading</div>;
  return (
    <StyledModal size="lg" visible={visible} setVisible={setVisible}>
      <Modal.Header>Saved On The Cloud</Modal.Header>
      <Modal.Content>
        <StyledModalContent>
          {data?.data?.result?.map(json => (
            <GraphCard
              data={{
                id: json._id,
                title: json.name,
                details: `Last modified ${dayjs(json.updatedAt).fromNow()}`,
                preview:
                  "https://blog.shevarezo.fr/uploads/posts/bulk/FNj3yQLp_visualiser-donnees-json-diagramme-json-crack_rotate3.png",
              }}
              key={json.id}
            />
          ))}
          <CreateCard />
        </StyledModalContent>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}></Modal.Controls>
    </StyledModal>
  );
};
