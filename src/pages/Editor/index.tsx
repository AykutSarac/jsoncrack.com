import React from "react";
import Head from "next/head";
import styled from "styled-components";
import Panes from "src/containers/Editor/Panes";
import { Sidebar } from "src/components/Sidebar";

export const StyledPageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;

  @media only screen and (max-width: 568px) {
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
    </StyledEditorWrapper>
  );
};

export default EditorPage;
