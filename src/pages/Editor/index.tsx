import React from "react";
import Head from "next/head";
import styled from "styled-components";
import Panes from "src/containers/Editor/Panes";
import { Sidebar } from "src/components/Sidebar";
import { Incompatible } from "src/containers/Incompatible";

export const StyledPageWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

export const StyledEditorWrapper = styled.div`
  width: 100%;
  overflow: hidden;

  @media only screen and (max-width: 568px) {
    display: none;
  }
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
        <Incompatible />
      </StyledPageWrapper>
    </StyledEditorWrapper>
  );
};

export default EditorPage;
