import { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import create from "zustand";

type StateType = keyof typeof initialStates;
type StateKey<T extends StateType> = typeof initialStates[T];

interface ConfigActions {
  setConfig: <T extends StateType, K extends StateKey<T>>(key: T, value: K) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

const initialStates = {
  foldNodes: false,
  fullscreen: false,
  performanceMode: true,
  zoomPanPinch: undefined as ReactZoomPanPinchRef | undefined,
};

export type Config = typeof initialStates;

const useConfig = create<Config & ConfigActions>()((set, get) => ({
  ...initialStates,
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
  setConfig: (setting, value) => {
    if (setting === "fullscreen" && value) {
      set({ fullscreen: true });
      return get().centerView();
    }

    set({ [setting]: value });
  },
}));

export default useConfig;
