import React from "react";
import type { NodeData } from "../types";
import styles from "./Node.module.css";
import { TextRenderer } from "./TextRenderer";
import { getTextColor } from "./nodeStyles";

type TextNodeProps = {
  node: NodeData;
  x: number;
  y: number;
};

const TextNodeBase = ({ node, x, y }: TextNodeProps) => {
  const { text, width, height } = node;
  const firstRow = text[0];

  if (!firstRow) return null;

  const value = firstRow.value;

  return (
    <foreignObject
      className={styles.foreignObject}
      data-id={`node-${node.id}`}
      width={width}
      height={height}
      x={0}
      y={0}
    >
      <span
        className={styles.textNodeWrapper}
        data-x={x}
        data-y={y}
        data-key={JSON.stringify(text)}
      >
        <span className={styles.key} style={{ color: getTextColor({ value, type: typeof value }) }}>
          <TextRenderer>{value}</TextRenderer>
        </span>
      </span>
    </foreignObject>
  );
};

const propsAreEqual = (prev: TextNodeProps, next: TextNodeProps) => {
  return prev.node.text === next.node.text && prev.node.width === next.node.width;
};

export const TextNode = React.memo(TextNodeBase, propsAreEqual);
