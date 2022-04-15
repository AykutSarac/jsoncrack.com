import React from "react";
import Head from "next/head";
import { Editor } from "src/containers/Editor";

const EditorPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Editor | JSON Visio</title>
        <meta
          name="description"
          content="View your JSON data in graphs instantly."
        />
      </Head>
      <Editor />
    </>
  );
};

export default EditorPage;
