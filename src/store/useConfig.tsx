import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { defaultJson } from "src/constants/data";
import create from "zustand";

type StateType = keyof typeof initialStates;
type StateKey<T extends StateType> = typeof initialStates[T];

interface ConfigActions {
  setJson: (json: string) => void;
  setConfig: <T extends StateType, K extends StateKey<T>>(key: T, value: K) => void;
  getJson: () => string;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

const initialStates = {
  json: defaultJson,
  cursorMode: "move" as "move" | "navigation",
  foldNodes: false,
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
    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLElement;
    if (zoomPanPinch && canvas) zoomPanPinch.zoomToElement(canvas);
  },
  setConfig: (setting: keyof Config, value: unknown) => set({ [setting]: value }),
}));

export default useConfig;
