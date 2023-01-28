import React from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal, ModalProps } from "src/components/Modal";
import styled from "styled-components";

const StyledFlex = styled.div`
  display: flex;
  gap: 12px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};

  &:first-of-type {
    padding-top: 0;
    border: none;
  }
`;

export const ShareModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { push, query } = useRouter();
  const shareURL = `https://jsoncrack.com/editor?json=${query.json}`;

  const handleShare = (value: string) => {
    navigator.clipboard?.writeText(value);
    toast.success(`Link copied to clipboard.`);
    setVisible(false);
  };

  const onEmbedClick = () => {
    push("/docs");
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Create a Share Link</Modal.Header>
      <Modal.Content>
        <StyledContainer>
          Share Link
          <StyledFlex>
            <Input value={shareURL} type="url" readOnly />
            <Button status="SECONDARY" onClick={() => handleShare(shareURL)}>
              Copy
            </Button>
          </StyledFlex>
        </StyledContainer>
        <StyledContainer>
          Embed into your website
          <StyledFlex>
            <Button status="SUCCESS" onClick={onEmbedClick} block>
              Learn How to Embed
            </Button>
          </StyledFlex>
        </StyledContainer>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}></Modal.Controls>
    </Modal>
  );
};
