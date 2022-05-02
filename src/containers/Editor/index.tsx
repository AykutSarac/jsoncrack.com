import React from "react";
import { Sidebar } from "src/components/Sidebar";
import { LiveEditor } from "src/containers/LiveEditor";
import { JsonEditor } from "src/containers/JsonEditor";
import { Incompatible } from "src/containers/Incompatible";
import * as Styles from "src/containers/Editor/styles";
import { useConfig } from "src/hocs/config";
import { Allotment } from "allotment";

const Editor: React.FC = () => {
  const { settings } = useConfig();

  return (
    <Styles.StyledPageWrapper>
      <Sidebar />
      <Styles.StyledEditorWrapper>
        <Styles.StyledEditor>
          <Allotment.Pane
            preferredSize={400}
            minSize={300}
            maxSize={600}
            visible={!settings.hideEditor}
          >
            <JsonEditor />
          </Allotment.Pane>
          <Allotment.Pane>
            <LiveEditor />
          </Allotment.Pane>
        </Styles.StyledEditor>
      </Styles.StyledEditorWrapper>
      <Incompatible />
    </Styles.StyledPageWrapper>
  );
};

export default Editor;
