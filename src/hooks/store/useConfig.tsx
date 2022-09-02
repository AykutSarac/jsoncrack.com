import create from "zustand";
import { defaultJson } from "src/constants/data";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

interface ConfigActions {
  setJson: (json: string) => void;
  setConfig: (key: keyof Config, value: unknown) => void;
  getJson: () => string;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

export interface Config {
  json: string;
  cursorMode: "move" | "navigation";
  layout: "LEFT" | "RIGHT" | "DOWN" | "UP";
  expand: boolean;
  hideEditor: boolean;
  zoomPanPinch?: ReactZoomPanPinchRef;
  performanceMode: boolean;
}

const initialStates: Config = {
  json: defaultJson,
  cursorMode: "move",
  layout: "RIGHT",
  expand: true,
  hideEditor: false,
  performanceMode: true,
};

const useConfig = create<Config & ConfigActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: (json: string) => set({ json }),
  zoomIn: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) {
      zoomPanPinch.setTransform(
        zoomPanPinch?.state.positionX,
        zoomPanPinch?.state.positionY,
        zoomPanPinch?.state.scale + 0.4
      );
    }
  },
  zoomOut: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) {
      zoomPanPinch.setTransform(
        zoomPanPinch?.state.positionX,
        zoomPanPinch?.state.positionY,
        zoomPanPinch?.state.scale - 0.4
      );
    }
  },
  centerView: () => {
    const zoomPanPinch = get().zoomPanPinch;
    if (zoomPanPinch) zoomPanPinch.centerView(0.6);
  },
  setConfig: (setting: keyof Config, value: unknown) =>
    set({ [setting]: value }),
}));

export default useConfig;
