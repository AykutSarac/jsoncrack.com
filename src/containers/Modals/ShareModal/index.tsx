import React from "react";
import { useRouter } from "next/router";
import { compress } from "compress-json";
import toast from "react-hot-toast";
import { BiErrorAlt } from "react-icons/bi";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal, ModalProps } from "src/components/Modal";
import { baseURL } from "src/constants/data";
import useConfig from "src/store/useConfig";
import styled from "styled-components";

const StyledWarning = styled.p``;

const StyledErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.TEXT_DANGER};
  font-weight: 600;
`;

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
  const json = useConfig(state => state.json);
  const [encodedJson, setEncodedJson] = React.useState("");
  const navigate = useRouter();

  const embedText = `<iframe id="jsoncrackEmbed" src="${baseURL}/widget></iframe>`;
  const shareURL = `${baseURL}/editor?json=${encodedJson}`;

  React.useEffect(() => {
    if (visible) {
      const jsonEncode = compress(JSON.parse(json));
      const jsonString = JSON.stringify(jsonEncode);

      setEncodedJson(encodeURIComponent(jsonString));
    }
  }, [json, visible]);

  const handleShare = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Link copied to clipboard.`);
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Create a Share Link</Modal.Header>
      <Modal.Content>
        {encodedJson.length > 5000 ? (
          <StyledErrorWrapper>
            <BiErrorAlt size={60} />
            <StyledWarning>
              Link size exceeds 5000 characters, unable to generate link for file of
              this size!
            </StyledWarning>
          </StyledErrorWrapper>
        ) : (
          <>
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
                <Button
                  status="SUCCESS"
                  onClick={() => navigate.push("/embed")}
                  block
                >
                  Learn How to Embed
                </Button>
              </StyledFlex>
            </StyledContainer>
          </>
        )}
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}></Modal.Controls>
    </Modal>
  );
};
