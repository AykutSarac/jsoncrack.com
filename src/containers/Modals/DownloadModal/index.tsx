import React from "react";
import {
  ColorPicker,
  TextInput,
  SegmentedControl,
  Group,
  Modal,
  Button,
  Divider,
  Grid,
} from "@mantine/core";
import { toBlob, toPng, toSvg } from "html-to-image";
import toast from "react-hot-toast";
import { FiCopy, FiDownload } from "react-icons/fi";
import { ModalProps } from "src/components/Modal";
import styled from "styled-components";

const swatches = [
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

enum Extensions {
  SVG = "svg",
  PNG = "png",
}
export const DownloadModal: React.FC<ModalProps> = ({ visible, setVisible }) => {
  const [extension, setExtension] = React.useState(Extensions.PNG);
  const [fileDetails, setFileDetails] = React.useState({
    filename: "jsoncrack.com",
    backgroundColor: "rgba(255, 255, 255, 1)",
    quality: 1,
  });

  const clipboardImage = async () => {
    try {
      toast.loading("Copying to clipboard...", { id: "toastClipboard" });

      const imageElement = document.querySelector("svg[id*='ref']") as HTMLElement;

      const blob = await toBlob(imageElement, {
        quality: fileDetails.quality,
        backgroundColor: fileDetails.backgroundColor,
      });

      if (!blob) return;

      navigator.clipboard?.write([
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
    }
  };

  const exportAsImage = async () => {
    try {
      toast.loading("Downloading...", { id: "toastDownload" });

      const imageElement = document.querySelector("svg[id*='ref']") as HTMLElement;

      let exportImage = extension === Extensions.SVG ? toSvg : toPng;

      const dataURI = await exportImage(imageElement, {
        quality: fileDetails.quality,
        backgroundColor: fileDetails.backgroundColor,
      });

      downloadURI(dataURI, `${fileDetails.filename}.${extension}`);
    } catch (error) {
      toast.error("Failed to download image!");
    } finally {
      toast.dismiss("toastDownload");
      setVisible(false);
    }
  };

  const updateDetails = (key: keyof typeof fileDetails, value: string | number) =>
    setFileDetails({ ...fileDetails, [key]: value });

  return (
    <Modal opened={visible} onClose={() => setVisible(false)} title="Download Image" centered>
      <Group align="flex-end" py="sm" grow>
        <Grid align="end" grow>
          <Grid.Col span={8}>
            <TextInput
              label="File Name"
              value={fileDetails.filename}
              onChange={e => updateDetails("filename", e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <SegmentedControl
              value={extension}
              onChange={e => setExtension(e as Extensions)}
              data={[
                { label: "SVG", value: Extensions.SVG },
                { label: "PNG", value: Extensions.PNG },
              ]}
              fullWidth
            />
          </Grid.Col>
        </Grid>
      </Group>
      <Group py="sm" grow>
        <StyledContainer>
          Background Color
          <ColorPicker
            format="rgba"
            value={fileDetails.backgroundColor}
            onChange={color => updateDetails("backgroundColor", color)}
            swatches={swatches}
            fullWidth
          />
        </StyledContainer>
      </Group>

      <Divider py="xs" />
      <Group position="right">
        <Button leftIcon={<FiCopy />} onClick={clipboardImage}>
          Clipboard
        </Button>
        <Button color="green" leftIcon={<FiDownload />} onClick={exportAsImage}>
          Download
        </Button>
      </Group>
    </Modal>
  );
};
