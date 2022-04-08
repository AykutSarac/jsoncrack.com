import React from "react";
import { defaultConfig, defaultJson } from "src/constants/data";
import { ReducerAction, useConfigReducer } from "src/reducer/reducer";
import { StorageConfig } from "src/typings/global";

export interface AppConfig {
  json: string;
  settings: StorageConfig;
}

export const initialStates: AppConfig = {
  json: JSON.stringify(defaultJson),
  settings: defaultConfig,
};

interface Config {
  states: AppConfig;
  dispatch: React.Dispatch<ReducerAction>;
}

const defaultContext: Config = {
  states: initialStates,
  dispatch: () => {},
};

const ConfigContext: React.Context<Config> =
  React.createContext(defaultContext);

const useConfig = () => React.useContext(ConfigContext);

const WithConfig: React.FC = ({ children }) => {
  const [states, dispatch] = React.useReducer(useConfigReducer, initialStates);
  const value = { states, dispatch };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export { WithConfig, useConfig, ConfigContext };
