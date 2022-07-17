import React from "react";
import Editor from "@monaco-editor/react";
import parseJson from "parse-json";
import styled from "styled-components";
import { ErrorContainer } from "src/components/ErrorContainer/ErrorContainer";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
import { Loading } from "src/components/Loading";
import { loader } from "@monaco-editor/react";
import { CarbonAds } from "src/components/CarbonAds";

loader.config({ paths: { vs: "/monaco-editor/min/vs" } });

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

const editorOptions = {
  formatOnPaste: true,
  minimap: {
    enabled: false,
  },
};

const StyledWrapper = styled.div`
  display: grid;
  height: calc(100vh - 36px);
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 1fr);
`;

export const JsonEditor: React.FC = () => {
  const { json, settings, dispatch } = useConfig();
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState({
    message: "",
    isExpanded: true,
  });

  const editorTheme = React.useMemo(
    () => (settings.lightmode ? "light" : "vs-dark"),
    [settings.lightmode]
  );

  React.useEffect(() => {
    setValue(JSON.stringify(JSON.parse(json), null, 2));
  }, [json]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      try {
        if (!value) {
          setError((err) => ({ ...err, message: "" }));
          return dispatch({ type: ConfigActionType.SET_JSON, payload: "[]" });
        }

        parseJson(value);
        dispatch({ type: ConfigActionType.SET_JSON, payload: value });
        setError((err) => ({ ...err, message: "" }));
      } catch (jsonError: any) {
        setError((err) => ({ ...err, message: jsonError.message }));
      }
    }, 1500);

    return () => clearTimeout(formatTimer);
  }, [value, dispatch]);

  return (
    <StyledEditorWrapper>
      <ErrorContainer error={error} setError={setError} />
      <StyledWrapper>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          theme={editorTheme}
          options={editorOptions}
          loading={<Loading message="Loading Editor..." />}
          onChange={(value) => setValue(value as string)}
        />
      </StyledWrapper>
    </StyledEditorWrapper>
  );
};
