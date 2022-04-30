import React from "react";
import AceEditor, { IAceOptions } from "react-ace";
import parseJson from "parse-json";
import styled from "styled-components";
import { ErrorContainer } from "../../components/ErrorContainer/ErrorContainer";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
require("ace-builds/src-noconflict/mode-json");
require("ace-builds/src-noconflict/theme-tomorrow_night");
require("ace-builds/src-noconflict/theme-github");

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

const aceOptions: IAceOptions = {
  useWorker: false,
  fontSize: 12,
  tabSize: 2,
  showPrintMargin: false,
  wrap: true,
};

const JsonEditor: React.FC = () => {
  const {
    states: { json, settings },
    dispatch,
  } = useConfig();
  const [editorWidth, setEditorWidth] = React.useState("auto");
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState({
    message: "",
    isExpanded: true,
  });

  const editorTheme = React.useMemo(
    () => (settings.lightmode ? "github" : "tomorrow_night"),
    [settings.lightmode]
  );

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((observed) => {
      const width = observed[0].contentRect.width;
      setEditorWidth(width ? width.toString() : "auto");
    });

    const dom = document.querySelector(".ace_scroller");
    if (dom) resizeObserver.observe(dom);

    return () => resizeObserver.disconnect();
  }, []);

  React.useEffect(() => {
    if (settings.autoformat) {
      setValue(JSON.stringify(JSON.parse(json), null, 2));
    } else {
      setValue(json);
    }
  }, [settings.autoformat, json]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      try {
        if (value) {
          parseJson(json);
          dispatch({
            type: ConfigActionType.SET_JSON,
            payload: value,
          });
        }

        setError((err) => ({ ...err, message: "" }));
      } catch (jsonError: any) {
        setError((err) => ({ ...err, message: jsonError.message }));
      }
    }, 1800);

    return () => clearTimeout(formatTimer);
  }, [value, dispatch]);

  return (
    <StyledEditorWrapper>
      <ErrorContainer error={error} setError={setError} />
      <AceEditor
        height="100%"
        mode="json"
        value={value}
        onChange={setValue}
        theme={editorTheme}
        width={editorWidth}
        setOptions={aceOptions}
      />
    </StyledEditorWrapper>
  );
};

const memoizedJsonEditor = React.memo(JsonEditor);

export { memoizedJsonEditor as JsonEditor };
