import { Fira_Mono } from "next/font/google";
import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";

const firaMono = Fira_Mono({
  weight: ["500"],
  subsets: ["latin"],
});

export const isContentImage = (value: string | [string, string][]) => {
  if (typeof value !== "string") return false;

  const isImageURL = /(https?:\/\/.*\.(?:png|jpg|gif))/i.test(value);
  const isBase64 = value.startsWith("data:image/") && value.includes("base64");
  return isImageURL || isBase64;
};

const sizeCache = new Map<string | [string, string][], { width: number; height: number }>();

function calculateWidthAndHeight(str: string, single = false) {
  const dummyElement = document.createElement("div");
  dummyElement.style.whiteSpace = single ? "nowrap" : "pre-wrap";
  dummyElement.innerHTML = str;
  dummyElement.style.fontSize = "12px";
  dummyElement.style.width = "fit-content";
  dummyElement.style.height = "fit-content";
  dummyElement.style.padding = "10px";
  dummyElement.style.fontWeight = "500";
  dummyElement.style.overflowWrap = "break-word";
  dummyElement.style.fontFamily = firaMono.style.fontFamily;
  document.body.appendChild(dummyElement);

  const width = dummyElement.offsetWidth + 4;
  const height = dummyElement.offsetHeight;
  document.body.removeChild(dummyElement);

  return { width, height };
}

export const calculateNodeSize = (text: string | [string, string][], isParent = false) => {
  let lines = "";
  const isFolded = useGraph.getState().foldNodes;
  const isImagePreview = useStored.getState().imagePreview;
  const isImage = isContentImage(text) && isImagePreview;
  const cacheKey = [text, isParent, isFolded].toString();

  // check cache
  if (sizeCache.has(cacheKey)) {
    const size = sizeCache.get(cacheKey);
    if (size) return size;
  }

  if (typeof text !== "string") {
    lines = text.map(([k, v]) => `${k}: ${JSON.stringify(v).slice(0, 80)}`).join("\n");
  } else {
    lines = text;
  }

  let sizes = calculateWidthAndHeight(lines, typeof text === "string");
  if (isImage) sizes = { width: 80, height: 80 };
  if (isFolded) sizes.width = 300;
  if (isParent && isFolded) sizes.width = 170;
  if (isParent) sizes.width += 100;
  if (sizes.width > 700) sizes.width = 700;

  sizeCache.set(cacheKey, sizes);
  return sizes;
};
