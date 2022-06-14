import { Allotment } from "allotment";
import React from "react";
import { useConfig } from "src/hocs/config";
import { LiveEditor } from "src/containers/LiveEditor";
import { JsonEditor } from "src/containers/JsonEditor";
import { StyledEditor } from "./styles";

const Panes: React.FC = () => {
  const { settings } = useConfig();

  return (
    <StyledEditor>
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
    </StyledEditor>
  );
};

export default Panes;
