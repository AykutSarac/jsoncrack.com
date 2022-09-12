import React from "react";
import styled from "styled-components";
import { ErrorContainer } from "src/components/ErrorContainer";
import { MonacoEditor } from "src/components/MonacoEditor";

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;
export const JsonEditor: React.FC = () => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <StyledEditorWrapper>
      <ErrorContainer hasError={hasError} />
      <MonacoEditor setHasError={setHasError} />
    </StyledEditorWrapper>
  );
};
