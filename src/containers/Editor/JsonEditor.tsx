import React from "react";
import styled from "styled-components";
import { MonacoEditor } from "src/components/MonacoEditor";
import { PromptInput } from "src/components/PromptInput";

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`;

export const JsonEditor: React.FC = () => {
  return (
    <StyledEditorWrapper>
      <PromptInput />
      <MonacoEditor />
    </StyledEditorWrapper>
  );
};

export default JsonEditor;
