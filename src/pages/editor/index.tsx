import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import SplitPane from "react-split-pane";

import { Button } from "src/components/Button";
import { Sidebar } from "src/components/Sidebar";
import { JsonEditor } from "src/containers/JsonEditor";
import { LiveEditor } from "src/containers/LiveEditor";

const StyledPageWrapper = styled.div`
  display: flex;
`;

const StyledIncompatible = styled.div`
  display: none;

  @media only screen and (max-width: 568px) {
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
      content: "Uh, oh!";
      font-weight: 700;
      font-size: 60px;
      opacity: 0.6;
    }
  }
`;

const StyledEditorWrapper = styled.div`
  width: 100%;
  overflow: hidden;

  @media only screen and (max-width: 568px) {
    display: none;
  }
`;

const StyledTools = styled.div`
  display: flex;
  align-items: center;
  height: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.BLACK};
  padding: 4px 16px;
  background: ${({ theme }) => theme.BLACK_SECONDARY};
  color: ${({ theme }) => theme.SILVER};
`;

const StyledEditor = styled(SplitPane)`
  position: relative !important;
  display: flex;
  background: ${({ theme }) => theme.BLACK_LIGHT};
  height: calc(100vh - 26px) !important;

  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    box-sizing: border-box;
    background-clip: padding-box;
  }

  .Resizer:hover {
    transition: all 2s ease;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }

  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }

  .Resizer.disabled {
    cursor: not-allowed;
  }

  .Resizer.disabled:hover {
    border-color: transparent;
  }
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
        <StyledTools></StyledTools>
        <StyledEditor
          maxSize={800}
          minSize={300}
          defaultSize={450}
          split="vertical"
        >
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
