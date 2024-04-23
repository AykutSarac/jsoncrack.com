import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { BottomBar } from "src/containers/Editor/BottomBar";
import { Toolbar } from "src/containers/Toolbar";
import { EditorWrapper } from "src/layout/EditorWrapper";
import { Loading } from "src/layout/Loading";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";

const Panes = dynamic(() => import("src/containers/Editor/Panes"));

export const StyledPageWrapper = styled.div`
  height: calc(100vh - 27px);
  width: 100%;

  @media only screen and (max-width: 320px) {
    height: 100vh;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const EditorPage: React.FC = () => {
  const { query, isReady } = useRouter();
  const loading = useJson(state => state.loading);
  const hasQuery = React.useMemo(() => Object.keys(query).length > 0, [query]);
  const checkEditorSession = useFile(state => state.checkEditorSession);

  React.useEffect(() => {
    if (isReady) checkEditorSession(query?.json);
  }, [checkEditorSession, isReady, query]);

  if (loading) {
    return (
      <StyledEditorWrapper>
        <Head>
          <title>Editor | JSON Crack</title>
          {hasQuery && <meta name="robots" content="noindex,nofollow" />}
        </Head>
        <Loading message="Preparing the editor for you..." loading />
      </StyledEditorWrapper>
    );
  }

  return (
    <EditorWrapper>
      <StyledEditorWrapper>
        <Head>
          <title>Editor | JSON Crack</title>
          <link rel="canonical" href="https://jsoncrack.com/editor" />
        </Head>
        <StyledPageWrapper>
          <Toolbar />
          <StyledEditorWrapper>
            <Panes />
          </StyledEditorWrapper>
        </StyledPageWrapper>
        <BottomBar />
      </StyledEditorWrapper>
    </EditorWrapper>
  );
};

export default EditorPage;
