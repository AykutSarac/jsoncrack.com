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

export const ShareModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const json = useConfig((state) => state.json);
  const [url, setURL] = React.useState("");
  const [_, copy] = useCopyToClipboard();

  React.useEffect(() => {
    const jsonEncode = compress(JSON.parse(json));
    const jsonString = JSON.stringify(jsonEncode);

    setURL(
      `https://jsonvisio.com/editor?json=${encodeURIComponent(jsonString)}`
    );
  }, [json]);

  const handleShare = () => {
    copy(url);
    toast.success(`Link copied to clipboard.`);
    setVisible(false);
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Create a Share Link</Modal.Header>
      <Modal.Content>
        {url.length > 5000 ? (
          <StyledErrorWrapper>
            <BiErrorAlt size={60} />
            <StyledWarning>
              Link size exceeds 5000 characters, unable to generate link for
              file of this size!
            </StyledWarning>
          </StyledErrorWrapper>
        ) : (
          <Input value={url} type="url" readOnly />
        )}
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}>
        {url.length < 5000 && (
          <Button status="SECONDARY" onClick={handleShare}>
            Copy
          </Button>
        )}
      </Modal.Controls>
    </Modal>
  );
};
