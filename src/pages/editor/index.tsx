import React from "react";
import styled from "styled-components";
import JsonEditor from "./JsonEditor";
import LiveEditor from "./LiveEditor";

const StyledEditorWrapper = styled.div`
  height: 75vh;
`;

const StyledTools = styled.div`
  height: 60px;
  border-radius: 5px 5px 0 0;
  border: 1px solid ${({ theme }) => theme.BLACK};
  padding: 8px 16px 0;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
`;

const StyledEditor = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 5px 5px;
  height: 100%;
  background: ${({ theme }) => theme.BLACK_LIGHT};
  border: 1px solid ${({ theme }) => theme.BLACK};
  border-top: none;
  overflow: hidden;
`;

const Editor: React.FC = () => {
  return (
    <StyledEditorWrapper>
      <StyledTools>tools</StyledTools>
      <StyledEditor>
        <JsonEditor />
        <LiveEditor />
      </StyledEditor>
    </StyledEditorWrapper>
  );
};

export default Editor;
