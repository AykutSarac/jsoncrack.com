import React from "react";
import type { JSONPath } from "jsonc-parser";
import type { NodeData } from "../types";
import { isPathCollapsed, useCollapseContext } from "./CollapseContext";
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
  parentPath: JSONPath;
};

const ROW_HEIGHT = 30;

const Row = ({ row, x, y, index, parentPath }: RowProps) => {
  const rowPosition = index * ROW_HEIGHT;
  const { collapsedSet, onToggleCollapse } = useCollapseContext();

  const isContainer =
    (row.type === "object" || row.type === "array") && (row.childrenCount ?? 0) > 0;
  const rowPath: JSONPath | null = React.useMemo(
    () => (isContainer && row.key != null ? [...parentPath, row.key] : null),
    [isContainer, parentPath, row.key]
  );
  const collapsed = rowPath != null && isPathCollapsed(collapsedSet, rowPath);

  const getRowText = () => {
    if (row.type === "object") {
      const count = row.childrenCount ?? 0;
      return collapsed ? `⋯ ${count} keys` : `{${count} keys}`;
    }
    if (row.type === "array") {
      const count = row.childrenCount ?? 0;
      return collapsed ? `⋯ ${count} items` : `[${count} items]`;
    }
    return row.value;
  };

  const handleToggle = (event: React.MouseEvent) => {
    if (!rowPath || !onToggleCollapse) return;
    event.stopPropagation();
    event.preventDefault();
    onToggleCollapse(rowPath);
  };

  const rowClassName = collapsed ? `${styles.row} ${styles.collapsed}` : styles.row;

  return (
    <span
      className={rowClassName}
      style={{
        color: getTextColor({ value: row.value, type: typeof row.value }),
      }}
      data-key={`${row.key}: ${row.value}`}
      data-x={x}
      data-y={y + rowPosition}
    >
      {isContainer && rowPath && (
        <span
          role="button"
          aria-label={collapsed ? "Expand" : "Collapse"}
          aria-expanded={!collapsed}
          className={styles.collapseButton}
          data-collapse-path={JSON.stringify(rowPath)}
          onClick={handleToggle}
          onMouseDown={event => event.stopPropagation()}
        >
          {collapsed ? "+" : "−"}
        </span>
      )}
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

const ObjectNodeBase = ({ node, x, y }: ObjectNodeProps) => {
  const parentPath = node.path ?? [];
  return (
    <foreignObject
      className={`${styles.foreignObject} ${styles.objectForeignObject}`}
      data-id={`node-${node.id}`}
      width={node.width}
      height={node.height}
      x={0}
      y={0}
    >
      {node.text.map((row, index) => (
        <Row
          key={`${node.id}-${index}`}
          row={row}
          x={x}
          y={y}
          index={index}
          parentPath={parentPath}
        />
      ))}
    </foreignObject>
  );
};

const areRowTargetsEqual = (prevTargets?: string[], nextTargets?: string[]) => {
  if (prevTargets === nextTargets) return true;
  if (!prevTargets || !nextTargets) return false;
  if (prevTargets.length !== nextTargets.length) return false;

  for (let i = 0; i < prevTargets.length; i += 1) {
    if (prevTargets[i] !== nextTargets[i]) return false;
  }

  return true;
};

const areRowsEqual = (prevRows: NodeData["text"], nextRows: NodeData["text"]) => {
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

const arePathsEqual = (a?: JSONPath, b?: JSONPath) => {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const propsAreEqual = (prev: ObjectNodeProps, next: ObjectNodeProps) => {
  return (
    prev.node.width === next.node.width &&
    prev.node.height === next.node.height &&
    arePathsEqual(prev.node.path, next.node.path) &&
    areRowsEqual(prev.node.text, next.node.text)
  );
};

export const ObjectNode = React.memo(ObjectNodeBase, propsAreEqual);
