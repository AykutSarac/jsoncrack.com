import React from "react";
import { Sidebar } from "src/components/Sidebar";
import { Incompatible } from "src/containers/Incompatible";
import * as Styles from "src/containers/Editor/styles";
import Panes from "./Panes";

const Editor: React.FC = () => {
  return (
    <Styles.StyledPageWrapper>
      <Sidebar />
      <Styles.StyledEditorWrapper>
        <Panes />
      </Styles.StyledEditorWrapper>
      <Incompatible />
    </Styles.StyledPageWrapper>
  );
};

export default Editor;
