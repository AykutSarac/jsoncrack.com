import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Sidebar } from "src/components/Sidebar";
import { defaultJson } from "src/constants/data";
import { BottomBar } from "src/containers/Editor/BottomBar";
import Panes from "src/containers/Editor/Panes";
import { getJson } from "src/services/db/json";
import useConfig from "src/store/useConfig";
import useGraph from "src/store/useGraph";
import styled from "styled-components";

export const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - 28px);
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
  const { query, isReady } = useRouter();
  const setJson = useGraph(state => state.setJson);
  const setConfig = useConfig(state => state.setConfig);

  React.useEffect(() => {
    if (isReady) {
      if (typeof query.json === "string") {
        getJson(query.json).then(res => res && setJson(res));
      } else setJson(defaultJson);
    }
  }, [isReady, query.json, setConfig, setJson]);

  return (
    <StyledEditorWrapper>
      <Head>
        <title>Editor | JSON Crack</title>
        <meta
          name="description"
          content="View your JSON data in graphs instantly."
        />
      </Head>
      <StyledPageWrapper>
        <Sidebar />
        <StyledEditorWrapper>
          <Panes />
        </StyledEditorWrapper>
      </StyledPageWrapper>
      <BottomBar />
    </StyledEditorWrapper>
  );
};

export default EditorPage;
