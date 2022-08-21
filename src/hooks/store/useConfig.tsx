import create from "zustand";
import { defaultJson } from "src/constants/data";
import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { CanvasDirection } from "reaflow";

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
  layout: CanvasDirection;
  expand: boolean;
  hideEditor: boolean;
  zoomPanPinch?: ReactZoomPanPinchRef;
  performanceMode: boolean;
}

const initialStates: Config = {
  json: JSON.stringify(defaultJson),
  cursorMode: "move",
  layout: "RIGHT",
  expand: true,
  hideEditor: false,
  performanceMode: false,
};

const useConfig = create<Config & ConfigActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: (json: string) => set((state) => ({ ...state, json })),
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
    if (zoomPanPinch) zoomPanPinch.resetTransform();
  },
  setConfig: (setting: keyof Config, value: unknown) =>
    set((state) => ({
      ...state,
      [setting]: value,
    })),
}));

export default useConfig;
