import React from "react";
import { Sidebar } from "src/components/Sidebar";
import styled from "styled-components";
import { JsonEditor } from "./JsonEditor";
import { LiveEditor } from "./LiveEditor";

const StyledPageWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const StyledEditorWrapper = styled.div`
  width: 100%;
`;

const StyledTools = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.BLACK};
  padding: 4px 16px;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  color: ${({ theme }) => theme.SILVER};
`;

const StyledEditor = styled.div`
  display: flex;
  background: ${({ theme }) => theme.BLACK_LIGHT};
  border: 1px solid ${({ theme }) => theme.BLACK};
  border-top: none;
  height: calc(100vh - 48px);
`;


const Editor: React.FC = () => {
  return (
    <StyledPageWrapper>
      <Sidebar />
      <StyledEditorWrapper>
        <StyledTools>Tools</StyledTools>
        <StyledEditor>
          <JsonEditor />
          <LiveEditor />
        </StyledEditor>
      </StyledEditorWrapper>
    </StyledPageWrapper>
  );
};

export default Editor;
