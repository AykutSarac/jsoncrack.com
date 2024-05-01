import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { BottomBar } from "src/containers/Editor/BottomBar";
import Panes from "src/containers/Editor/Panes";
import { Toolbar } from "src/containers/Toolbar";
import { EditorWrapper } from "src/layout/EditorWrapper";
import useFile from "src/store/useFile";

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
  const hasQuery = React.useMemo(() => Object.keys(query).length > 0, [query]);
  const checkEditorSession = useFile(state => state.checkEditorSession);

  React.useEffect(() => {
    if (isReady) checkEditorSession(query?.json);
  }, [checkEditorSession, isReady, query]);

  return (
    <EditorWrapper>
      <StyledEditorWrapper>
        <Head>
          <title>Editor | JSON Crack</title>
          <link rel="canonical" href="https://jsoncrack.com/editor" />
          {hasQuery && <meta name="robots" content="noindex,nofollow" />}
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
