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
import useJson from "../../../store/useJson";
import { jsonToMarkdownTable } from "../../../lib/utils/jsonToMarkdown";

enum Extensions {
  SVG = "svg",
  PNG = "png",
  JPEG = "jpeg",
  MD = "md",
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

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  downloadURI(url, filename);
  URL.revokeObjectURL(url);
}

const getExportElement = () =>
  (document.querySelector(".jsoncrack-canvas") as HTMLElement | null) ??
  (document.querySelector("svg[id*='ref']") as HTMLElement | null);

export const DownloadModal = ({ opened, onClose }: ModalProps) => {
  const [extension, setExtension] = React.useState(Extensions.PNG);
  const [fileDetails, setFileDetails] = React.useState({
    filename: "jsoncrack.com",
    backgroundColor: "#FFFFFF",
    quality: 1,
  });
  const json = useJson(state => state.json);

  const isImageFormat = extension !== Extensions.MD;

  const clipboardImage = async () => {
    try {
      toast.loading("Copying to clipboard...", { id: "toastClipboard" });

      const imageElement = getExportElement();
      if (!imageElement) {
        toast.error("Canvas not found.");
        return;
      }
      const imageOptions = {
        quality: fileDetails.quality,
        backgroundColor: fileDetails.backgroundColor,
        skipFonts: true,
      };

      const blob = await toBlob(imageElement, imageOptions);

      if (!blob) return;

      await navigator.clipboard?.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      toast.success("Copied to clipboard");
      gaEvent("clipboard_img");
    } catch (error) {
      if (error instanceof Error && error.name === "NotAllowedError") {
        toast.error(
          "Clipboard write permission denied. Please allow clipboard access in your browser settings."
        );
      } else {
        toast.error("Failed to copy to clipboard");
      }
    } finally {
      toast.dismiss("toastClipboard");
      onClose();
    }
  };

  const exportAsImage = async () => {
    try {
      toast.loading("Downloading...", { id: "toastDownload" });

      const imageElement = getExportElement();
      if (!imageElement) {
        toast.error("Canvas not found.");
        return;
      }
      const imageOptions = {
        quality: fileDetails.quality,
        backgroundColor: fileDetails.backgroundColor,
        skipFonts: true,
      };

      const dataURI = await getDownloadFormat(extension)(imageElement, imageOptions);

      downloadURI(dataURI, `${fileDetails.filename}.${extension}`);
      gaEvent("download_img", { label: extension });
    } catch {
      toast.error("Failed to download image!");
    } finally {
      toast.dismiss("toastDownload");
      onClose();
    }
  };

  const exportAsMarkdown = () => {
    try {
      const markdown = jsonToMarkdownTable(json);
      downloadText(markdown, `${fileDetails.filename}.${extension}`);
      gaEvent("download_md");
      onClose();
    } catch {
      toast.error("Failed to generate Markdown!");
    }
  };

  const handleDownload = () => {
    if (extension === Extensions.MD) {
      exportAsMarkdown();
    } else {
      exportAsImage();
    }
  };

  const updateDetails = (key: keyof typeof fileDetails, value: string | number) =>
    setFileDetails({ ...fileDetails, [key]: value });

  return (
    <Modal opened={opened} onClose={onClose} title={isImageFormat ? "Download Image" : "Export as Markdown"} centered>
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
          { label: "PNG", value: Extensions.PNG },
          { label: "JPEG", value: Extensions.JPEG },
          { label: "SVG", value: Extensions.SVG },
          { label: "Markdown", value: Extensions.MD },
        ]}
        mb="lg"
      />
      {isImageFormat && (
        <>
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
        </>
      )}
      <Divider my="xs" />
      <Group justify="right">
        {isImageFormat && (
          <Button leftSection={<FiCopy />} onClick={clipboardImage}>
            Clipboard
          </Button>
        )}
        <Button color="green" leftSection={<FiDownload />} onClick={handleDownload}>
          Download
        </Button>
      </Group>
    </Modal>
  );
};
