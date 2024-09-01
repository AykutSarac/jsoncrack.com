import React from "react";
import type { ModalProps } from "@mantine/core";
import {
  ColorPicker,
  TextInput,
  SegmentedControl,
  Group,
  Modal,
  Button,
  Divider,
  ColorInput,
} from "@mantine/core";
import { toBlob, toJpeg, toPng, toSvg } from "html-to-image";
import { event as gaEvent } from "nextjs-google-analytics";
import toast from "react-hot-toast";
import { FiCopy, FiDownload } from "react-icons/fi";

enum Extensions {
  SVG = "svg",
  PNG = "png",
  JPEG = "jpeg",
}

const getDownloadFormat = (format: Extensions) => {
  switch (format) {
    case Extensions.SVG:
      return toSvg;
    case Extensions.PNG:
      return toPng;
    case Extensions.JPEG:
      return toJpeg;
  }
};

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
  const link = document.createElement("a");

  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const DownloadModal = ({ opened, onClose }: ModalProps) => {
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
      gaEvent("clipboard_img");
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

      const dataURI = await getDownloadFormat(extension)(imageElement, {
        quality: fileDetails.quality,
        backgroundColor: fileDetails.backgroundColor,
      });

      downloadURI(dataURI, `${fileDetails.filename}.${extension}`);
      gaEvent("download_img", { label: extension });
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
      <TextInput
        label="File Name"
        value={fileDetails.filename}
        onChange={e => updateDetails("filename", e.target.value)}
        mb="lg"
      />
      <SegmentedControl
        value={extension}
        onChange={e => setExtension(e as Extensions)}
        fullWidth
        data={[
          { label: "SVG", value: Extensions.SVG },
          { label: "PNG", value: Extensions.PNG },
          { label: "JPEG", value: Extensions.JPEG },
        ]}
        mb="lg"
      />
      <ColorInput
        label="Background Color"
        value={fileDetails.backgroundColor}
        onChange={color => updateDetails("backgroundColor", color)}
        withEyeDropper={false}
        mb="lg"
      />
      <ColorPicker
        format="rgba"
        value={fileDetails.backgroundColor}
        onChange={color => updateDetails("backgroundColor", color)}
        swatches={swatches}
        withPicker={false}
        fullWidth
      />
      <Divider my="xs" />
      <Group justify="right">
        <Button leftSection={<FiCopy />} onClick={clipboardImage}>
          Clipboard
        </Button>
        <Button color="green" leftSection={<FiDownload />} onClick={exportAsImage}>
          Download
        </Button>
      </Group>
    </Modal>
  );
};
