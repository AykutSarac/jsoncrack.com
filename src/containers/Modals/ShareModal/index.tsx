import React from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useCopyToClipboard } from "usehooks-ts";
import { Modal, ModalProps } from "src/components/Modal";
import { Button } from "src/components/Button";
import { BiErrorAlt } from "react-icons/bi";
import { compress } from "compress-json";
import useConfig from "src/hooks/store/useConfig";
import { Input } from "src/components/Input";

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
  const json = useConfig((state) => state.json);
  const [encodedJson, setEncodedJson] = React.useState("");
  const [_, copy] = useCopyToClipboard();

  const embedText = `<iframe src="https://jsonvisio.com/widget?json=${encodedJson}" width="512" height="384"></iframe>`;
  const shareURL = `https://jsonvisio.com/editor?json=${encodedJson}`;

  React.useEffect(() => {
    const jsonEncode = compress(JSON.parse(json));
    const jsonString = JSON.stringify(jsonEncode);

    setEncodedJson(encodeURIComponent(jsonString));
  }, [json]);

  const handleShare = (value: string) => {
    copy(value);
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
              Link size exceeds 5000 characters, unable to generate link for
              file of this size!
            </StyledWarning>
          </StyledErrorWrapper>
        ) : (
          <>
            <StyledContainer>
              Share Link
              <StyledFlex>
                <Input value={shareURL} type="url" readOnly />
                <Button
                  status="SECONDARY"
                  onClick={() => handleShare(shareURL)}
                >
                  Copy
                </Button>
              </StyledFlex>
            </StyledContainer>
            <StyledContainer>
              Embed into your website
              <StyledFlex>
                <Input value={embedText} type="url" readOnly />
                <Button
                  status="SECONDARY"
                  onClick={() => handleShare(embedText)}
                >
                  Copy
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
