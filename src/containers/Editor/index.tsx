import React from "react";
import dynamic from "next/dynamic";
import { LiveEditor } from "src/containers/LiveEditor";
import { Loading } from "src/components/Loading";
import { Incompatible } from "src/containers/Incompatible";
import * as Styles from "src/containers/Editor/styles";
import { Tools } from "./Tools";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
import { Input } from "src/components/Input";

const JsonEditor = dynamic(() => import("src/containers/JsonEditor"), {
  ssr: false,
  loading: () => <Loading message="Loading Editor..." />,
});

const Sidebar = dynamic(() => import("src/components/Sidebar"), {
  ssr: false,
  loading: () => <Loading message="Loading Sidebar..." />,
});

export const Editor: React.FC = () => {
  const {
    states: { settings },
    dispatch,
  } = useConfig();

  React.useEffect(() => {
    const jsonStored = localStorage.getItem("json");
    if (jsonStored)
      dispatch({ type: ConfigActionType.SET_JSON, payload: jsonStored });

    const configStored = localStorage.getItem("config");
    if (configStored)
      dispatch({
        type: ConfigActionType.SET_CONFIG,
        payload: JSON.parse(configStored),
      });
  }, []);

  React.useEffect(() => {
    localStorage.setItem("config", JSON.stringify(settings));
  }, [settings]);

  return (
    <Styles.StyledPageWrapper>
      <Sidebar />
      <Styles.StyledEditorWrapper>
        <Tools />
        {settings.showSearch && <Input />}
        <Styles.StyledEditor
          maxSize={800}
          minSize={300}
          defaultSize={450}
          split="vertical"
          size={settings.hideEditor ? 0 : 450}
          allowResize={!settings.hideEditor}
        >
          <JsonEditor />
          <LiveEditor />
        </Styles.StyledEditor>
      </Styles.StyledEditorWrapper>
      <Incompatible />
    </Styles.StyledPageWrapper>
  );
};
