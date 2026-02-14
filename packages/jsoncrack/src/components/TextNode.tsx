import React from "react";
import type { NodeData } from "../types";
import { isContentImage } from "../utils/calculateNodeSize";
import styles from "./Node.module.css";
import { TextRenderer } from "./TextRenderer";
import { getTextColor } from "./nodeStyles";

type TextNodeProps = {
  node: NodeData;
  x: number;
  y: number;
  imagePreviewEnabled: boolean;
};

const TextNodeBase = ({ node, x, y, imagePreviewEnabled }: TextNodeProps) => {
  const { text, width, height } = node;
  const firstRow = text[0];

  if (!firstRow) return null;

  const value = firstRow.value;
  const normalizedValue = typeof value === "string" ? value : `${value}`;
  const isImage = imagePreviewEnabled && isContentImage(normalizedValue);

  return (
    <foreignObject
      className={styles.foreignObject}
      data-id={`node-${node.id}`}
      width={width}
      height={height}
      x={0}
      y={0}
    >
      {isImage ? (
        <div className={styles.imageWrapper}>
          <img
            className={styles.image}
            style={{ background: "var(--background-modifier-accent)" }}
            src={normalizedValue}
            alt=""
            width="70"
            height="70"
            loading="lazy"
          />
        </div>
      ) : (
        <span
          className={styles.textNodeWrapper}
          data-x={x}
          data-y={y}
          data-key={JSON.stringify(text)}
        >
          <span
            className={styles.key}
            style={{ color: getTextColor({ value, type: typeof value }) }}
          >
            <TextRenderer>{value}</TextRenderer>
          </span>
        </span>
      )}
    </foreignObject>
  );
};

const propsAreEqual = (prev: TextNodeProps, next: TextNodeProps) => {
  return (
    prev.imagePreviewEnabled === next.imagePreviewEnabled &&
    prev.node.text === next.node.text &&
    prev.node.width === next.node.width
  );
};

export const TextNode = React.memo(TextNodeBase, propsAreEqual);
