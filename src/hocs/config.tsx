import React from "react";
import { defaultConfig, defaultJson } from "src/constants/data";
import {
  ConfigActionType,
  ReducerAction,
  useConfigReducer,
} from "src/reducer/reducer";
import { ReactComponent, StorageConfig } from "src/typings/global";
import { isValidJson } from "src/utils/isValidJson";
import { useRouter } from "next/router";
import { decode } from "js-base64";

export interface AppConfig {
  json: string;
  settings: StorageConfig;
}

export const initialStates: AppConfig = {
  json: JSON.stringify(defaultJson),
  settings: defaultConfig,
};

interface Config {
  json: string;
  settings: StorageConfig;
  dispatch: React.Dispatch<ReducerAction>;
}

const defaultContext: Config = {
  ...initialStates,
  dispatch: () => {},
};

const ConfigContext: React.Context<Config> =
  React.createContext(defaultContext);

const useConfig = () => React.useContext(ConfigContext);

const WithConfig: ReactComponent = ({ children }) => {
  const [render, setRender] = React.useState(false);
  const [states, dispatch] = React.useReducer(useConfigReducer, initialStates);
  const value = {
    dispatch,
    json: states.json,
    settings: states.settings,
  };

  const router = useRouter();
  const { json } = router.query;

  React.useEffect(() => {
    const jsonStored = localStorage.getItem("json");
    const jsonDecode = decode(String(json));

    if (isValidJson(jsonDecode)) {
      dispatch({ type: ConfigActionType.SET_JSON, payload: jsonDecode });
    } else if (jsonStored) {
      dispatch({ type: ConfigActionType.SET_JSON, payload: jsonStored });
    }

    const configStored = localStorage.getItem("config");

    if (configStored) {
      dispatch({
        type: ConfigActionType.SET_CONFIG,
        payload: JSON.parse(configStored),
      });
    }

    setRender(true);
  }, [dispatch, json]);

  React.useEffect(() => {
    if (render)
      localStorage.setItem(
        "config",
        JSON.stringify({
          ...states.settings,
          zoomPanPinch: undefined,
          performance: undefined,
        })
      );
  }, [states.settings, render]);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

const withConfig = <P extends object>(
  Component: React.ComponentType<P>
): React.FC => {
  return (props) => (
    <WithConfig>
      <Component {...(props as P)} />
    </WithConfig>
  );
};

export { WithConfig, useConfig, ConfigContext, withConfig };
