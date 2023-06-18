import { create } from "zustand";
import { persist } from "zustand/middleware";
import useGraph from "./useGraph";

const initialStates = {
  lightmode: false,
  hideCollapse: true,
  childrenCount: true,
  imagePreview: true,
  liveTransform: true,
};

export interface ConfigActions {
  setLightTheme: (theme: boolean) => void;
  toggleHideCollapse: (value: boolean) => void;
  toggleChildrenCount: (value: boolean) => void;
  toggleImagePreview: (value: boolean) => void;
  toggleLiveTransform: (value: boolean) => void;
}

const useStored = create(
  persist<typeof initialStates & ConfigActions>(
    set => ({
      ...initialStates,
      toggleLiveTransform: liveTransform => set({ liveTransform }),
      setLightTheme: (value: boolean) =>
        set({
          lightmode: value,
        }),
      toggleHideCollapse: (value: boolean) => set({ hideCollapse: value }),
      toggleChildrenCount: (value: boolean) => set({ childrenCount: value }),
      toggleImagePreview: (value: boolean) => {
        set({ imagePreview: value });
        useGraph.getState().setGraph();
      },
    }),
    {
      name: "config",
    }
  )
);

export default useStored;
