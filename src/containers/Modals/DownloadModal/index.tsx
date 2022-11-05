import React from "react";
import { toBlob, toPng } from "html-to-image";
import { TwitterPicker } from "react-color";
import { TwitterPickerStylesProps } from "react-color/lib/components/twitter/Twitter";
import toast from "react-hot-toast";
import { FiCopy, FiDownload } from "react-icons/fi";
import { Button } from "src/components/Button";
import { Input } from "src/components/Input";
import { Modal, ModalProps } from "src/components/Modal";
import useConfig from "src/store/useConfig";
import styled from "styled-components";

const ColorPickerStyles: Partial<TwitterPickerStylesProps> = {
  card: {
    background: "transparent",
    boxShadow: "none",
  },
  body: {
    padding: 0,
  },
  input: {
    background: "rgba(0, 0, 0, 0.2)",
    boxShadow: "none",
    textTransform: "none",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  hash: {
    background: "rgba(180, 180, 180, 0.3)",
  },
};

const defaultColors = [
  "#B80000",
  "#DB3E00",
  "#FCCB00",
  "#008B02",
  "#006B76",
  "#1273DE",
  "#004DCF",
  "#5300EB",
  "#EB9694",
  "#FAD0C3",
  "#FEF3BD",
  "#C1E1C5",
  "#BEDADC",
  "#C4DEF6",
  "#BED3F3",
  "#D4C4FB",
  "transparent",
];

function downloadURI(uri: string, name: string) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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

const StyledColorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledColorIndicator = styled.div<{ color: string }>`
  flex: 1;
  width: 100%;
  height: auto;
  border-radius: 6px;
  background: ${({ color }) => color};
  border: 1px solid;
  border-color: rgba(0, 0, 0, 0.1);
`;

export const DownloadModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const setConfig = useConfig(state => state.setConfig);
  const [fileDetails, setFileDetails] = React.useState({
    filename: "jsoncrack.com",
    backgroundColor: "transparent",
    quality: 1,
  });

  const clipboardImage = async () => {
    try {
      toast.loading("Copying to clipboard...", { id: "toastClipboard" });
      setConfig("performanceMode", false);

      const imageElement = document.querySelector("svg[id*='ref']") as HTMLElement;

      const blob = await toBlob(imageElement, {
        quality: fileDetails.quality,
        backgroundColor: fileDetails.backgroundColor,
      });

      if (!blob) return;

      navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    } finally {
      toast.dismiss("toastClipboard");
      setVisible(false);
      setConfig("performanceMode", true);
    }
  };

  const exportAsImage = async () => {
    try {
      toast.loading("Downloading...", { id: "toastDownload" });
      setConfig("performanceMode", false);

      const imageElement = document.querySelector("svg[id*='ref']") as HTMLElement;

      const dataURI = await toPng(imageElement, {
        quality: fileDetails.quality,
        backgroundColor: fileDetails.backgroundColor,
      });

      downloadURI(dataURI, `${fileDetails.filename}.png`);
    } catch (error) {
      toast.error("Failed to download image!");
    } finally {
      toast.dismiss("toastDownload");
      setVisible(false);
      setConfig("performanceMode", true);
    }
  };

  const updateDetails = (key: keyof typeof fileDetails, value: string | number) =>
    setFileDetails({ ...fileDetails, [key]: value });

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <Modal.Header>Download Image</Modal.Header>
      <Modal.Content>
        <StyledContainer>
          File Name
          <StyledColorWrapper>
            <Input
              placeholder="File Name"
              value={fileDetails.filename}
              onChange={e => updateDetails("filename", e.target.value)}
            />
          </StyledColorWrapper>
        </StyledContainer>
        <StyledContainer>
          Background Color
          <StyledColorWrapper>
            <TwitterPicker
              triangle="hide"
              colors={defaultColors}
              color={fileDetails.backgroundColor}
              onChange={color => updateDetails("backgroundColor", color.hex)}
              styles={{
                default: ColorPickerStyles,
              }}
            />
            <StyledColorIndicator color={fileDetails.backgroundColor} />
          </StyledColorWrapper>
        </StyledContainer>
      </Modal.Content>
      <Modal.Controls setVisible={setVisible}>
        <Button status="SECONDARY" onClick={clipboardImage}>
          <FiCopy size={18} /> Clipboard
        </Button>
        <Button status="SUCCESS" onClick={exportAsImage}>
          <FiDownload size={18} />
          Download
        </Button>
      </Modal.Controls>
    </Modal>
  );
};
