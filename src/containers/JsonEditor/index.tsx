import React from "react";
import AceEditor from "react-ace";
import parseJson from "parse-json";
import styled from "styled-components";
import { Error, ErrorContainer } from "./ErrorContainer";
import { ConfigActionType } from "src/reducer/reducer";
import { useConfig } from "src/hocs/config";
require("ace-builds/src-noconflict/mode-json");
require("ace-builds/src-noconflict/theme-tomorrow_night");

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

const aceOptions = { useWorker: false };

const JsonEditor: React.FC = () => {
  const {
    states: { json, settings },
    dispatch,
  } = useConfig();
  const [editorWidth, setEditorWidth] = React.useState("auto");
  const [value, setValue] = React.useState(
    JSON.stringify(JSON.parse(json), null, 2)
  );
  const [error, setError] = React.useState({
    message: "",
    isExpanded: true,
  });

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((observed) => {
      const width = observed[0].contentRect.width;
      setEditorWidth(width ? width.toString() : "auto");
    });

    const dom = document.querySelector(".ace_scroller");
    if (dom) resizeObserver.observe(dom);

    return () => {
      resizeObserver.disconnect();
    };
  }, [json]);

  React.useEffect(() => {
    if (settings.autoformat) {
      return setValue(JSON.stringify(JSON.parse(json), null, 2));
    }

    setValue(json);
  }, [settings.autoformat, json]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      try {
        if (value === "") return setError((err) => ({ ...err, message: "" }));
        const parsedJson = parseJson(value);

        if (settings.autoformat) {
          setValue(JSON.stringify(parsedJson, null, 2));
        } else {
          setValue(value);
        }

        dispatch({ type: ConfigActionType.SET_JSON, payload: value });
        setError((err) => ({ ...err, message: "" }));
      } catch (jsonError: any) {
        setError((err) => ({ ...err, message: jsonError.message }));
      }
    }, 1800);

    return () => clearTimeout(formatTimer);
  }, [value, settings.autoformat, dispatch]);

  return (
    <StyledEditorWrapper>
      <ErrorContainer error={error} setError={setError} />
      <AceEditor
        value={value}
        onChange={setValue}
        mode="json"
        theme="tomorrow_night"
        width={editorWidth}
        height="100%"
        fontSize={12}
        wrapEnabled
        setOptions={aceOptions}
        showPrintMargin={false}
        tabSize={2}
      />
    </StyledEditorWrapper>
  );
};

export default React.memo(JsonEditor);
