import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { decompressFromBase64 } from "lz-string";
import { Sidebar } from "src/components/Sidebar";
import { defaultJson } from "src/constants/data";
import { BottomBar } from "src/containers/Editor/BottomBar";
import Panes from "src/containers/Editor/Panes";
import { getJson } from "src/services/db/json";
import useGraph from "src/store/useGraph";
import useUser from "src/store/useUser";
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
  const checkSession = useUser(state => state.checkSession);
  const { data, isLoading, status } = useQuery(
    ["dbJson", query.json],
    () => getJson(query.json as string),
    {
      enabled: isReady && !!query.json,
    }
  );

  const setJson = useGraph(state => state.setJson);
  const setLoading = useGraph(state => state.setLoading);

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  React.useEffect(() => {
    if (isReady) {
      if (query.json) {
        
        if (isLoading) return setLoading(true);
        if (status || !data) setJson(defaultJson);
        
        if (data?.data) setJson(decompressFromBase64(data.data.json) as string);
        setLoading(false);
      } else setJson(defaultJson);
    }
  }, [data, status, isLoading, isReady, query.json, setJson, setLoading]);

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
