import React, { ComponentType } from "react";
import dynamic from "next/dynamic";
import { IAceEditorProps } from "react-ace";
import toast from "react-hot-toast";
import { StorageConfig } from "src/typings/global";
import { useLocalStorage } from "usehooks-ts";
import { defaultConfig } from "src/constants/data";

function isJson(value: string) {
  value = typeof value !== "string" ? JSON.stringify(value) : value;

  try {
    value = JSON.parse(value);
  } catch (e: any) {
    toast.error(e.message);
    return false;
  }

  if (typeof value === "object" && value !== null) {
    return true;
  }

  return false;
}

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
  const [config] = useLocalStorage<StorageConfig>("config", defaultConfig);
  const [value, setValue] = React.useState(
    JSON.stringify(JSON.parse(json), null, 2)
  );

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
    }, 2000);

    return () => clearTimeout(formatTimer);
  }, [value, config.autoformat]);

  return (
    <AceEditor
      value={value}
      onChange={setValue}
      mode="json"
      theme="tomorrow_night"
      width="auto"
      height="100%"
      fontSize={14}
    />
  );
};

export default JsonEditor;
