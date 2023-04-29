import React from "react";
import styled from "styled-components";
import { MonacoEditor } from "src/components/MonacoEditor";

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`;

export const JsonEditor: React.FC = () => {
  return (
    <StyledEditorWrapper>
      <MonacoEditor />
    </StyledEditorWrapper>
  );
};
