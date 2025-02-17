import { create } from "zustand";
import { persist } from "zustand/middleware";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

const initialStates = {
  darkmodeEnabled: true,
  collapseButtonVisible: true,
  childrenCountVisible: true,
  imagePreviewEnabled: true,
  liveTransformEnabled: true,
  gesturesEnabled: false,
  rulersEnabled: true,
};

export interface ConfigActions {
  toggleDarkMode: (value: boolean) => void;
  toggleCollapseButton: (value: boolean) => void;
  toggleChildrenCount: (value: boolean) => void;
  toggleImagePreview: (value: boolean) => void;
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
      toggleCollapseButton: collapseButtonVisible => set({ collapseButtonVisible }),
      toggleChildrenCount: childrenCountVisible => set({ childrenCountVisible }),
      toggleImagePreview: imagePreviewEnabled => {
        set({ imagePreviewEnabled });
        useGraph.getState().setGraph();
      },
    }),
    {
      name: "config",
    }
  )
);

export default useConfig;
