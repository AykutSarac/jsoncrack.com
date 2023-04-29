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
  ModalProps,
  ColorInput,
  Stack,
} from "@mantine/core";
import { toBlob, toPng, toSvg } from "html-to-image";
import toast from "react-hot-toast";
import { FiCopy, FiDownload } from "react-icons/fi";

enum Extensions {
  SVG = "svg",
  PNG = "png",
}

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

export const DownloadModal: React.FC<ModalProps> = ({ opened, onClose }) => {
  const [extension, setExtension] = React.useState(Extensions.PNG);
  const [fileDetails, setFileDetails] = React.useState({
    filename: "jsoncrack.com",
    backgroundColor: "#FFFFFF",
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
      onClose();
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
      onClose();
    }
  };

  const updateDetails = (key: keyof typeof fileDetails, value: string | number) =>
    setFileDetails({ ...fileDetails, [key]: value });

  return (
    <Modal opened={opened} onClose={onClose} title="Download Image" centered>
      <Grid py="sm" align="end" grow>
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
      <Stack py="sm">
        <ColorInput
          label="Background Color"
          value={fileDetails.backgroundColor}
          onChange={color => updateDetails("backgroundColor", color)}
          withEyeDropper={false}
        />
        <ColorPicker
          format="rgba"
          value={fileDetails.backgroundColor}
          onChange={color => updateDetails("backgroundColor", color)}
          swatches={swatches}
          withPicker={false}
          fullWidth
        />
      </Stack>
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
