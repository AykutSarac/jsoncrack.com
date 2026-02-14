const NODE_DIMENSIONS = {
  ROW_HEIGHT: 30,
  PARENT_HEIGHT: 36,
} as const;

type Text = number | string | [string, string][];
type Size = { width: number; height: number };

const CACHE_TTL_MS = 120_000;
const sizeCache = new Map<string, Size>();
let lastCacheClearAt = Date.now();

export const isContentImage = (value: Text) => {
  if (typeof value !== "string") return false;

  const isImageURL = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i.test(
    value,
  );
  const isBase64 = value.startsWith("data:image/") && value.includes("base64");

  return isImageURL || isBase64;
};

const calculateLines = (text: Text): string => {
  if (Array.isArray(text)) {
    return text
      .map(([k, v]) => `${k}: ${JSON.stringify(v).slice(0, 80)}`)
      .join("\n");
  }

  return `${text}`;
};

const fallbackSize = (str: string, single: boolean): Size => {
  const lines = str.split("\n");
  const longestLine = lines.reduce(
    (max, line) => Math.max(max, line.length),
    0,
  );

  return {
    width: Math.min(700, Math.max(45, longestLine * 8 + 24)),
    height: single
      ? NODE_DIMENSIONS.PARENT_HEIGHT
      : lines.length * NODE_DIMENSIONS.ROW_HEIGHT,
  };
};

const calculateWidthAndHeight = (str: string, single = false): Size => {
  if (!str) return { width: 45, height: 45 };

  if (typeof document === "undefined") {
    return fallbackSize(str, single);
  }

  const dummyElement = document.createElement("div");
  dummyElement.style.position = "absolute";
  dummyElement.style.visibility = "hidden";
  dummyElement.style.pointerEvents = "none";
  dummyElement.style.whiteSpace = single ? "nowrap" : "pre-wrap";
  dummyElement.innerText = str;
  dummyElement.style.fontSize = "12px";
  dummyElement.style.width = "fit-content";
  dummyElement.style.padding = "0 10px";
  dummyElement.style.fontWeight = "500";
  dummyElement.style.fontFamily = "monospace";
  document.body.appendChild(dummyElement);

  const clientRect = dummyElement.getBoundingClientRect();
  const lines = str.split("\n").length;

  const width = clientRect.width + 4;
  const height = single
    ? NODE_DIMENSIONS.PARENT_HEIGHT
    : lines * NODE_DIMENSIONS.ROW_HEIGHT;

  document.body.removeChild(dummyElement);
  return { width, height };
};

const maybeClearCache = () => {
  if (Date.now() - lastCacheClearAt < CACHE_TTL_MS) return;
  sizeCache.clear();
  lastCacheClearAt = Date.now();
};

export const calculateNodeSize = (
  text: Text,
  isParent = false,
  imagePreviewEnabled = true,
) => {
  maybeClearCache();

  const isImage = isContentImage(text) && imagePreviewEnabled;
  const cacheKey = `${JSON.stringify(text)}-${isParent}-${imagePreviewEnabled}`;

  const cached = sizeCache.get(cacheKey);
  if (cached) return cached;

  const lines = calculateLines(text);
  const sizes = calculateWidthAndHeight(lines, typeof text === "string");

  if (isImage) {
    sizes.width = 80;
    sizes.height = 80;
  }

  if (isParent) sizes.width += 80;
  if (sizes.width > 700) sizes.width = 700;

  sizeCache.set(cacheKey, sizes);
  return sizes;
};
