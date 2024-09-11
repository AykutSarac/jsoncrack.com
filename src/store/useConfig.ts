import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ViewMode } from "src/enums/viewMode.enum";
import useGraph from "../containers/Editor/components/views/GraphView/stores/useGraph";

const initialStates = {
  darkmodeEnabled: false,
  collapseButtonVisible: true,
  childrenCountVisible: true,
  imagePreviewEnabled: true,
  liveTransformEnabled: true,
  gesturesEnabled: false,
  rulersEnabled: true,
  viewMode: ViewMode.Graph,
};

export interface ConfigActions {
  toggleDarkMode: (value: boolean) => void;
  toggleCollapseButton: (value: boolean) => void;
  toggleChildrenCount: (value: boolean) => void;
  toggleImagePreview: (value: boolean) => void;
  toggleLiveTransform: (value: boolean) => void;
  toggleGestures: (value: boolean) => void;
  toggleRulers: (value: boolean) => void;
  setViewMode: (value: ViewMode) => void;
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
      setViewMode: viewMode => set({ viewMode }),
    }),
    {
      name: "config",
    }
  )
);

export default useConfig;
