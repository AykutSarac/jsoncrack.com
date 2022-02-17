import React, { ComponentType } from "react";
import dynamic from "next/dynamic";
import { IAceEditorProps } from "react-ace";
import { StorageConfig } from "src/typings/global";
import { useLocalStorage } from "usehooks-ts";
import { defaultConfig } from "src/constants/data";
import parseJson from "parse-json";
import styled from "styled-components";
import {
  MdExpandMore,
  MdExpandLess,
  MdReportGmailerrorred,
} from "react-icons/md";

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  user-select: none;
`;

const StyledErrorWrapper = styled.div``;

const StyledErrorHeader = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.BLACK_DARK};
  padding: 6px 12px;
  color: ${({ theme }) => theme.DANGER};
  font-size: 22px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.DANGER};
  }
`;

const StyledTitle = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  gap: 10px;
`;

const StyledError = styled.pre`
  color: ${({ theme }) => theme.DANGER};
  border: 1px solid ${({ theme }) => theme.SILVER_DARK};
  border-left: none;
  border-right: none;
  font-size: 12px;
  padding: 12px;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-line;
`;

const AceEditor: ComponentType<IAceEditorProps> = dynamic(
  async () => {
    const Ace = require("react-ace").default;
    require("ace-builds/src-noconflict/mode-json");
    require("ace-builds/src-noconflict/theme-tomorrow_night");
    return Ace;
  },
  {
    ssr: false,
  }
);

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

  function isJson(value: string) {
    value = typeof value !== "string" ? JSON.stringify(value) : value;

    try {
      value = parseJson(value);
      setError((err) => ({
        ...err,
        message: "",
      }));
    } catch (e: any) {
      setError((err) => ({
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

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((observed) => {
      const width = observed[0].contentRect.width;
      setEditorWidth(width.toString());
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
  }, [json]);

  React.useEffect(() => {
    const formatTimer = setTimeout(() => {
      if (!isJson(value)) return;

      if (config.autoformat) {
        setValue(JSON.stringify(JSON.parse(value), null, 2));
      } else {
        setValue(value);
      }

      setJson(value);
    }, 1000);

    return () => clearTimeout(formatTimer);
  }, [value, config.autoformat]);

  return (
    <StyledEditorWrapper>
      {error.message && (
        <StyledErrorWrapper>
          <StyledErrorHeader
            onClick={() =>
              setError((err) => ({ ...err, isExpanded: !err.isExpanded }))
            }
          >
            <StyledTitle>
              <MdReportGmailerrorred size={26} /> Error
            </StyledTitle>
            {error.isExpanded ? (
              <MdExpandLess size={22} />
            ) : (
              <MdExpandMore size={22} />
            )}
          </StyledErrorHeader>
          {error.isExpanded && <StyledError>{error.message}</StyledError>}
        </StyledErrorWrapper>
      )}

      <AceEditor
        value={value}
        onChange={setValue}
        mode="json"
        theme="tomorrow_night"
        width={editorWidth}
        height="100%"
        fontSize={14}
        wrapEnabled
      />
    </StyledEditorWrapper>
  );
};

export default JsonEditor;
