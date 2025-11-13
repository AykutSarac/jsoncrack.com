import React from "react";
import useJson from "../../../../../store/useJson";
import type { NodeData } from "../../../../../types/graph";
import useNodeEdit from "../stores/useNodeEdit";
import * as Styled from "./styles";

export interface TextEditProps {
  node: NodeData;
}

export const TextEditComponent = ({ node }: TextEditProps) => {
  const { stopEdit } = useNodeEdit();
  const { updateNodeValue } = useJson();
  const [tempValue, setTempValue] = React.useState(JSON.stringify(node.text[0].value));
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (tempValue !== JSON.stringify(node.text[0].value)) {
        updateNodeValue(node.path, tempValue);
      }
      stopEdit();
    },
    [tempValue, node, updateNodeValue, stopEdit]
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
      <Styled.StyledEditInput
        ref={inputRef}
        type="text"
        value={tempValue}
        onChange={e => setTempValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter value"
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
