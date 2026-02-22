import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialStates = {
  darkmodeEnabled: true,
  liveTransformEnabled: true,
  gesturesEnabled: false,
  rulersEnabled: true,
};

export interface ConfigActions {
  toggleDarkMode: (value: boolean) => void;
  toggleLiveTransform: (value: boolean) => void;
  toggleGestures: (value: boolean) => void;
  toggleRulers: (value: boolean) => void;
}

const useConfig = create(
  persist<typeof initialStates & ConfigActions>(
    set => ({
      ...initialStates,
      toggleRulers: rulersEnabled => set({ rulersEnabled }),
      toggleGestures: gesturesEnabled => set({ gesturesEnabled }),
      toggleLiveTransform: liveTransformEnabled => set({ liveTransformEnabled }),
      toggleDarkMode: darkmodeEnabled => set({ darkmodeEnabled }),
    }),
    {
      name: "config",
    }
  )
);

export default useConfig;
