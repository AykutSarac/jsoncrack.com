import React from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "src/components/Sidebar";
import { LiveEditor } from "src/containers/LiveEditor";
import { Loading } from "src/components/Loading";
import { Incompatible } from "src/containers/Incompatible";
import * as Styles from "src/containers/Editor/styles";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";

const JsonEditor = dynamic(() => import("src/containers/JsonEditor"), {
  ssr: false,
  loading: () => <Loading message="Loading Editor..." />,
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
  }, [dispatch]);

  React.useEffect(() => {
    localStorage.setItem(
      "config",
      JSON.stringify({
        ...settings,
        zoomPanPinch: undefined,
      })
    );
  }, [settings]);

  return (
    <Styles.StyledPageWrapper>
      <Sidebar />
      <Styles.StyledEditorWrapper>
        { // @ts-ignore }
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
