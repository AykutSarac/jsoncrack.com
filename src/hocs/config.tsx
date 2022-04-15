import React from "react";
import { defaultConfig, defaultJson } from "src/constants/data";
import { ReducerAction, useConfigReducer } from "src/reducer/reducer";
import { ReactComponent, StorageConfig } from "src/typings/global";

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

const WithConfig: ReactComponent = ({ children }) => {
  const [states, dispatch] = React.useReducer(useConfigReducer, initialStates);
  const value = { states, dispatch };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

const withConfig =
  <P extends object>(Component: React.ComponentType<P>): React.FC =>
  (props) =>
    (
      <WithConfig>
        <Component {...(props as P)} />
      </WithConfig>
    );

export { WithConfig, useConfig, ConfigContext, withConfig };
