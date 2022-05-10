import React from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useCopyToClipboard } from "usehooks-ts";
import { Modal, ModalProps } from "src/components/Modal";
import { Button } from "src/components/Button";
import { encode } from "js-base64";
import { useConfig } from "src/hocs/config";

const StyledInput = styled.input`
  background: ${({ theme }) => theme.BACKGROUND_TERTIARY};
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  outline: none;
  border: none;
  border-radius: 4px;
  line-height: 32px;
  padding: 16px;
  width: 100%;
  margin-bottom: 10px;
  height: 30px;
`;

export const ShareModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { json } = useConfig();
  const [url, setURL] = React.useState("");
  const [value, copy] = useCopyToClipboard();

  React.useEffect(() => {
    const jsonEncode = encode(json);
    setURL(`https://jsonvisio.com/editor?json=${jsonEncode}`);
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
        <StyledInput value={url} type="url" readOnly={true} />
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}>
        <Button status="SECONDARY" onClick={handleShare}>
          Copy
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
