import React from "react";
import useJson from "../../../../../store/useJson";
import type { NodeData } from "../../../../../types/graph";
import useNodeEdit from "../stores/useNodeEdit";
import * as Styled from "./styles";

export interface RowEditProps {
  row: NodeData["text"][number];
  nodePath: NodeData["path"];
}

export const RowEditComponent = ({ row, nodePath }: RowEditProps) => {
  const { stopEdit } = useNodeEdit();
  const { updateNodeValue } = useJson();
  const [tempValue, setTempValue] = React.useState(JSON.stringify(row.value));
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (tempValue !== JSON.stringify(row.value)) {
        updateNodeValue(nodePath, tempValue);
      }
      stopEdit();
    },
    [tempValue, row.value, nodePath, updateNodeValue, stopEdit]
  );

  const handleCancel = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      stopEdit();
    },
    [stopEdit]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        handleSave(e as any);
      } else if (e.key === "Escape") {
        handleCancel(e as any);
      }
    },
    [handleSave, handleCancel]
  );

  return (
    <Styled.StyledEditWrapper onClick={e => e.stopPropagation()}>
      {row.key && (
        <Styled.StyledKey $type="object" style={{ marginRight: "4px" }}>
          {row.key}:
        </Styled.StyledKey>
      )}
      <Styled.StyledEditInput
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={e => setTempValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter value"
        style={{ flex: 1 }}
      />
      <Styled.StyledEditButton2 onClick={handleSave} title="Save (Enter)">
        ✓
      </Styled.StyledEditButton2>
      <Styled.StyledEditButton2 onClick={handleCancel} title="Cancel (Esc)">
        ✕
      </Styled.StyledEditButton2>
    </Styled.StyledEditWrapper>
  );
};
