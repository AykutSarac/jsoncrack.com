import React from "react";
import styled from "styled-components";
import toast from "react-hot-toast";

import { useConfig } from "src/hocs/config";
import { ConfigActionType } from "src/reducer/reducer";
import { Modal, ModalProps } from "src/components/Modal";
import { Button } from "src/components/Button";
import { AiOutlineUpload } from "react-icons/ai";

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

const StyledModalContent = styled(Modal.Content)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledUploadWrapper = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.BACKGROUND_SECONDARY};
  border: 2px dashed ${({ theme }) => theme.BACKGROUND_TERTIARY};
  border-radius: 5px;
  width: 100%;
  padding: 16px;
  cursor: pointer;

  input[type="file"] {
    display: none;
  }
`;

const StyledFileName = styled.span`
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
`;

const StyledUploadMessage = styled.h3`
  color: ${({ theme }) => theme.INTERACTIVE_ACTIVE};
  margin-bottom: 0;
`;

export const ImportModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const { dispatch } = useConfig();
  const [url, setURL] = React.useState("");
  const [jsonFile, setJsonFile] = React.useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setJsonFile(e.target.files?.item(0));
  };

  const handleImportFile = () => {
    if (url) {
      setJsonFile(null);

      toast.loading("Loading...", { id: "toastFetch" });
      return fetch(url)
        .then((res) => res.json())
        .then((json) => {
          dispatch({
            type: ConfigActionType.SET_JSON,
            payload: JSON.stringify(json),
          });

          setVisible(false);
        })
        .catch(() => toast.error("Failed to fetch JSON!"))
        .finally(() => toast.dismiss("toastFetch"));
    }

    if (jsonFile) {
      const reader = new FileReader();

      reader.readAsText(jsonFile, "UTF-8");
      reader.onload = function (data) {
        dispatch({
          type: ConfigActionType.SET_JSON,
          payload: data.target?.result as string,
        });

        setVisible(false);
      };
    }
  };

  React.useEffect(() => {
    return () => {
      setJsonFile(null);
      setURL("");
    };
  }, [visible]);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Import JSON</Modal.Header>
      <StyledModalContent>
        <StyledInput
          value={url}
          onChange={(e) => setURL(e.target.value)}
          type="url"
          placeholder="URL of JSON to fetch"
        />
        <StyledUploadWrapper>
          <input
            key={jsonFile?.name}
            onChange={handleFileChange}
            type="file"
            accept="application/JSON"
          />
          <AiOutlineUpload size={48} />
          <StyledUploadMessage>Click Here to Upload JSON</StyledUploadMessage>
          <StyledFileName>{jsonFile?.name ?? "None"}</StyledFileName>
        </StyledUploadWrapper>
      </StyledModalContent>
      <Modal.Controls setVisible={setVisible}>
        <Button
          status="SECONDARY"
          onClick={handleImportFile}
          disabled={!(jsonFile || url)}
        >
          Import
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
