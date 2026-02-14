import React from "react";
import type { NodeData } from "../types";
import styles from "./Node.module.css";
import { TextRenderer } from "./TextRenderer";
import { getTextColor } from "./nodeStyles";

type ObjectNodeProps = {
  node: NodeData;
  x: number;
  y: number;
};

type RowProps = {
  row: NodeData["text"][number];
  x: number;
  y: number;
  index: number;
};

const ROW_HEIGHT = 30;

const Row = ({ row, x, y, index }: RowProps) => {
  const rowPosition = index * ROW_HEIGHT;

  const getRowText = () => {
    if (row.type === "object") return `{${row.childrenCount ?? 0} keys}`;
    if (row.type === "array") return `[${row.childrenCount ?? 0} items]`;
    return row.value;
  };

  return (
    <span
      className={styles.row}
      style={{
        color: getTextColor({ value: row.value, type: typeof row.value }),
      }}
      data-key={`${row.key}: ${row.value}`}
      data-x={x}
      data-y={y + rowPosition}
    >
      <span
        className={styles.key}
        style={{ color: getTextColor({ type: "object", value: row.value }) }}
      >
        {row.key}:{" "}
      </span>
      <TextRenderer>{getRowText()}</TextRenderer>
    </span>
  );
};

const ObjectNodeBase = ({ node, x, y }: ObjectNodeProps) => (
  <foreignObject
    className={`${styles.foreignObject} ${styles.objectForeignObject}`}
    data-id={`node-${node.id}`}
    width={node.width}
    height={node.height}
    x={0}
    y={0}
  >
    {node.text.map((row, index) => (
      <Row key={`${node.id}-${index}`} row={row} x={x} y={y} index={index} />
    ))}
  </foreignObject>
);

const areRowTargetsEqual = (prevTargets?: string[], nextTargets?: string[]) => {
  if (prevTargets === nextTargets) return true;
  if (!prevTargets || !nextTargets) return false;
  if (prevTargets.length !== nextTargets.length) return false;

  for (let i = 0; i < prevTargets.length; i += 1) {
    if (prevTargets[i] !== nextTargets[i]) return false;
  }

  return true;
};

const areRowsEqual = (
  prevRows: NodeData["text"],
  nextRows: NodeData["text"],
) => {
  if (prevRows === nextRows) return true;
  if (prevRows.length !== nextRows.length) return false;

  for (let i = 0; i < prevRows.length; i += 1) {
    const prevRow = prevRows[i];
    const nextRow = nextRows[i];

    if (
      prevRow.key !== nextRow.key ||
      prevRow.value !== nextRow.value ||
      prevRow.type !== nextRow.type ||
      prevRow.childrenCount !== nextRow.childrenCount ||
      !areRowTargetsEqual(prevRow.to, nextRow.to)
    ) {
      return false;
    }
  }

  return true;
};

const propsAreEqual = (prev: ObjectNodeProps, next: ObjectNodeProps) => {
  return (
    prev.node.width === next.node.width &&
    prev.node.height === next.node.height &&
    areRowsEqual(prev.node.text, next.node.text)
  );
};

export const ObjectNode = React.memo(ObjectNodeBase, propsAreEqual);
