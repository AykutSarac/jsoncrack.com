import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";
import { BottomBar } from "src/containers/Editor/BottomBar";
import { Tools } from "src/containers/Editor/LiveEditor/Tools";
import Panes from "src/containers/Editor/Panes";
import { Loading } from "src/layout/Loading";
import useJson from "src/store/useJson";
import useUser from "src/store/useUser";

export const StyledPageWrapper = styled.div`
  height: calc(100vh - 27px);
  width: 100%;

  @media only screen and (max-width: 768px) {
    position: fixed;
    height: -webkit-fill-available;
    flex-direction: column;
  }
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const EditorPage: React.FC = () => {
  const { isReady, query } = useRouter();
  const checkSession = useUser(state => state.checkSession);
  const fetchJson = useJson(state => state.fetchJson);
  const loading = useJson(state => state.loading);

  React.useEffect(() => {
    // Fetch JSON by query
    // Check Session User
    if (isReady) {
      checkSession();
      fetchJson(query.json);
    }
  }, [checkSession, fetchJson, isReady, query.json]);

  if (loading) return <Loading message="Fetching JSON from cloud..." />;

  return (
    <StyledEditorWrapper>
      <Head>
        <title>Editor | JSON Crack</title>
        <meta name="description" content="View your JSON data in graphs instantly." />
      </Head>
      <StyledPageWrapper>
        <Tools />
        <StyledEditorWrapper>
          <Panes />
        </StyledEditorWrapper>
      </StyledPageWrapper>
      <BottomBar />
    </StyledEditorWrapper>
  );
};

export default EditorPage;
