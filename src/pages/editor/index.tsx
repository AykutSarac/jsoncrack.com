import { useRouter } from "next/router";
import React from "react";
import { Button } from "src/components/Button";
import { Sidebar } from "src/components/Sidebar";
import styled from "styled-components";
import { JsonEditor } from "src/containers/JsonEditor";
import { LiveEditor } from "src/containers/LiveEditor";
import Head from "next/head";

const StyledPageWrapper = styled.div`
  display: flex;
`;

const StyledIncompatible = styled.div`
  display: none;

  @media only screen and (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.BLACK_LIGHT};
    content: "This app is not compatible with your device!";
    color: ${({ theme }) => theme.SILVER};
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;

    button {
      margin-top: 60px;
    }

    &::before {
      content: 'Uh, oh!';
      font-weight: 700;
      font-size: 60px;
      opacity: 0.6;
    }
  }
`;

const StyledEditorWrapper = styled.div`
  width: 100%;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledTools = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  border-bottom: 1px solid ${({ theme }) => theme.BLACK};
  padding: 4px 16px;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  color: ${({ theme }) => theme.SILVER};
`;

const StyledEditor = styled.div`
  display: flex;
  background: ${({ theme }) => theme.BLACK_LIGHT};
  height: calc(100vh - 46px);
`;

const Editor: React.FC = () => {
  const route = useRouter();

  return (
    <StyledPageWrapper>
      <Head>
        <title>Editor | JSON Visio</title>
      </Head>
      <Sidebar />
      <StyledEditorWrapper>
        <StyledTools>Tools</StyledTools>
        <StyledEditor>
          <JsonEditor />
          <LiveEditor />
        </StyledEditor>
      </StyledEditorWrapper>
      <StyledIncompatible>
        This app is not compatible with your device!
        <Button className="incompatible" onClick={() => route.push("/")}>
          Go Back
        </Button>
      </StyledIncompatible>
    </StyledPageWrapper>
  );
};

export default Editor;
