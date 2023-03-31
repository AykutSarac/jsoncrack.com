import React from "react";
import styled from "styled-components";
import { ErrorContainer } from "src/components/ErrorContainer";
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
      <ErrorContainer />
      <MonacoEditor />
    </StyledEditorWrapper>
  );
};
