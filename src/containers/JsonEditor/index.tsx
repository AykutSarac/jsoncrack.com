import React from "react";
import AceEditor from "react-ace";
import { StorageConfig } from "src/typings/global";
import { useLocalStorage } from "usehooks-ts";
import { defaultConfig } from "src/constants/data";
import parseJson from "parse-json";
import styled from "styled-components";
import { Error, ErrorContainer } from "./ErrorContainer";
require("ace-builds/src-noconflict/mode-json");
require("ace-builds/src-noconflict/theme-tomorrow_night");

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

function isJson(
  value: string,
  setState: React.Dispatch<React.SetStateAction<Error>>
) {
  value = typeof value !== "string" ? JSON.stringify(value) : value;

  try {
    value = parseJson(value);
    setState((err) => ({
      ...err,
      message: "",
    }));
  } catch (e: any) {
    setState((err) => ({
      ...err,
      message: e.message,
    }));

    return false;
  }

  if (typeof value === "object" && value !== null) {
    return true;
  }

  return false;
}

const JsonEditor: React.FC<{
  json: string;
  setJson: React.Dispatch<React.SetStateAction<string>>;
}> = ({ json, setJson }) => {
  const [error, setError] = React.useState({
    message: "",
    isExpanded: true,
  });

  const [editorWidth, setEditorWidth] = React.useState("auto");
  const [config] = useLocalStorage<StorageConfig>("config", defaultConfig);
  const [value, setValue] = React.useState(
    JSON.stringify(JSON.parse(json), null, 2)
  );

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
    if (config.autoformat) {
      return setValue(JSON.stringify(JSON.parse(json), null, 2));
    }

    setValue(json);
  }, [config.autoformat, json]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      if (!isJson(value, setError)) return;

      if (config.autoformat) {
        setValue(JSON.stringify(JSON.parse(value), null, 2));
      } else {
        setValue(value);
      }

      setJson(value);
    }, 1000);

    return () => clearTimeout(formatTimer);
  }, [value, config.autoformat, setJson]);

  return (
    <StyledEditorWrapper>
      {error.message && <ErrorContainer error={error} setError={setError} />}
      <AceEditor
        value={value}
        onChange={setValue}
        mode="json"
        theme="tomorrow_night"
        width={editorWidth}
        height="100%"
        fontSize={12}
        wrapEnabled
        setOptions={{ useWorker: false }}
      />
    </StyledEditorWrapper>
  );
};

export default JsonEditor;
