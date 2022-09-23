import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { CanvasDirection } from "reaflow";
import { defaultJson } from "src/constants/data";
import create from "zustand";

interface ConfigActions {
  setJson: (json: string) => void;
  setConfig: (key: keyof Config, value: unknown) => void;
  getJson: () => string;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

const initialStates = {
  json: defaultJson,
  cursorMode: "move" as "move" | "navigation",
  layout: "RIGHT" as CanvasDirection,
  expand: true,
  hideEditor: false,
  performanceMode: true,
  disableLoading: false,
  zoomPanPinch: undefined as ReactZoomPanPinchRef | undefined,
};

export type Config = typeof initialStates;

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
    if (zoomPanPinch) zoomPanPinch.centerView(0.4);
  },
  setConfig: (setting: keyof Config, value: unknown) => set({ [setting]: value }),
}));

export default useConfig;
