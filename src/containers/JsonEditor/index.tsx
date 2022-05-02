import React from "react";
import Editor from "@monaco-editor/react";
import parseJson from "parse-json";
import styled from "styled-components";
import { ErrorContainer } from "../../components/ErrorContainer/ErrorContainer";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
import { Loading } from "src/components/Loading";

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

const editorOptions = {
  minimap: {
    enabled: false,
  },
};

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
    if (settings.autoformat) {
      return setValue(JSON.stringify(JSON.parse(json), null, 2));
    }

    setValue(json);
  }, [settings.autoformat, json]);

  React.useEffect(() => {
    const formatTimer = setTimeout(
      () => {
        try {
          if (value) {
            const parsedJson = parseJson(value);

            if (settings.autoformat) {
              setValue(JSON.stringify(parsedJson, null, 2));
            } else {
              setValue(value);
            }

            dispatch({ type: ConfigActionType.SET_JSON, payload: value });
          }

          setError((err) => ({ ...err, message: "" }));
        } catch (jsonError: any) {
          setError((err) => ({ ...err, message: jsonError.message }));
        }
      },
      settings.autoformat ? 1200 : 1800
    );

    return () => clearTimeout(formatTimer);
  }, [value, dispatch]);

  return (
    <StyledEditorWrapper>
      <ErrorContainer error={error} setError={setError} />
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        options={editorOptions}
        theme={editorTheme}
        loading={<Loading message="Loading Editor..." />}
        onChange={(value) => setValue(value as string)}
      />
    </StyledEditorWrapper>
  );
};
