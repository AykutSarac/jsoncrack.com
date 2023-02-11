import useGraph from "src/store/useGraph";
import useStored from "src/store/useStored";

export const calculateNodeSize = (text: string | [string, string][], isParent = false) => {
  // Get the current state of the application
  const isFolded = useGraph.getState().foldNodes;
  const isImagePreview = useStored.getState().imagePreview;

  // Initialize variables
  let lineCounts = 1;
  let lineLengths: number[] = [];

  // Calculate the number of lines and the length of each line
  if (typeof text === "string") {
    lineLengths.push(text.length);
  } else {
    lineCounts = text.map(([k, v]) => {
      const length = `${k}: ${v}`.length;
      const line = length > 150 ? 150 : length;
      lineLengths.push(line);
      return `${k}: ${v}`;
    }).length;
  }

  // Get the longest line
  const longestLine = Math.max(...lineLengths);

  // Calculate the width of the node
  const getWidth = () => {
    if (text.length === 0) return 35;
    if (Array.isArray(text) && !text.length) return 40;
    if (!isFolded) return 35 + longestLine * 7.8 + (isParent ? 80 : 0);
    if (isParent && isFolded) return 170;
    return 200;
  };

  // Calculate the height of the node
  const getHeight = () => {
    if (lineCounts * 17.8 < 30) return 40;
    return (lineCounts + 1) * 18;
  };

  // Check if text matches URL pattern
  const isImage =
    !Array.isArray(text) && /(https?:\/\/.*\.(?:png|jpg|gif))/i.test(text) && isImagePreview;

  return {
    width: isImage ? 80 : getWidth(),
    height: isImage ? 80 : getHeight(),
  };
};
