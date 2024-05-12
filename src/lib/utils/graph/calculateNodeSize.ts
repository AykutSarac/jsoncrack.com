import useConfig from "src/store/useConfig";

type Text = string | [string, string][];
type Size = { width: number; height: number };

export const isContentImage = (value: Text) => {
  if (typeof value !== "string") return false;

  const isImageURL = /(https?:\/\/.*\.(?:png|jpg|gif))/i.test(value);
  const isBase64 = value.startsWith("data:image/") && value.includes("base64");

  return isImageURL || isBase64;
};

const calculateLines = (text: Text): string => {
  if (typeof text === "string") {
    return text;
  } else {
    return text.map(([k, v]) => `${k}: ${JSON.stringify(v).slice(0, 80)}`).join("\n");
  }
};

const calculateWidthAndHeight = (str: string, single = false) => {
  if (!str) return { width: 45, height: 45 };

  const dummyElement = document.createElement("div");

  dummyElement.style.whiteSpace = single ? "nowrap" : "pre-wrap";
  dummyElement.innerHTML = str;
  dummyElement.style.fontSize = "12px";
  dummyElement.style.width = "fit-content";
  dummyElement.style.height = "fit-content";
  dummyElement.style.padding = "10px";
  dummyElement.style.fontWeight = "500";
  dummyElement.style.overflowWrap = "break-word";
  dummyElement.style.fontFamily = "monospace";
  document.body.appendChild(dummyElement);

  const clientRect = dummyElement.getBoundingClientRect();
  const width = clientRect.width + 4;
  const height = clientRect.height;

  document.body.removeChild(dummyElement);

  return { width, height };
};

const sizeCache = new Map<Text, Size>();

// clear cache every 2 mins
setInterval(() => sizeCache.clear(), 120_000);

export const calculateNodeSize = (text: Text, isParent = false) => {
  const { imagePreviewEnabled } = useConfig.getState();
  const isImage = isContentImage(text) && imagePreviewEnabled;

  const cacheKey = [text, isParent].toString();

  // check cache if data already exists
  if (sizeCache.has(cacheKey)) {
    const size = sizeCache.get(cacheKey);

    if (size) return size;
  }

  const lines = calculateLines(text);
  const sizes = calculateWidthAndHeight(lines, typeof text === "string");

  if (isImage) {
    sizes.width = 80;
    sizes.height = 80;
  }

  if (isParent) sizes.width += 100;
  if (sizes.width > 700) sizes.width = 700;

  sizeCache.set(cacheKey, sizes);
  return sizes;
};
