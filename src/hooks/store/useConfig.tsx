import { defaultConfig, defaultJson } from "src/constants/data";
import { StorageConfig } from "src/typings/global";
import create from "zustand";

export interface Config {
  json: string;
  settings: StorageConfig;
  updateJson: (json: string) => void;
  loadSettings: (settings: StorageConfig) => void;
  updateSetting: (setting: keyof StorageConfig, value: any) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

const useConfig = create<Config>((set) => ({
  json: JSON.stringify(defaultJson),
  settings: defaultConfig,
  updateJson: (json: string) => set((state) => ({ ...state, json })),
  loadSettings: (settings: StorageConfig) =>
    set((state) => ({ ...state, settings })),
  updateSetting: (setting: keyof StorageConfig, value: any) =>
    set((state) => ({
      ...state,
      settings: { ...state.settings, [setting]: value },
    })),
  zoomIn: () =>
    set((state) => {
      state.settings.zoomPanPinch?.setTransform(
        state.settings.zoomPanPinch?.state.positionX,
        state.settings.zoomPanPinch?.state.positionY,
        state.settings.zoomPanPinch?.state.scale + 0.4
      );

      return state;
    }),
  zoomOut: () =>
    set((state) => {
      state.settings.zoomPanPinch?.setTransform(
        state.settings.zoomPanPinch?.state.positionX,
        state.settings.zoomPanPinch?.state.positionY,
        state.settings.zoomPanPinch?.state.scale - 0.4
      );

      return state;
    }),
  centerView: () =>
    set((state) => {
      state.settings.zoomPanPinch?.resetTransform();
      return state;
    }),
}));

export default useConfig;
