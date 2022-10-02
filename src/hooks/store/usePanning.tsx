import create from "zustand";

interface PanningState {
  panning: boolean;
  setPanning: (updatedPanningState: boolean) => void;
}

const usePanningStore = create<PanningState>()((set, get) => ({
  panning: false,
  setPanning: updatedPanningState => {
    set(state => ({
      panning: updatedPanningState,
    }));
  },
}));

export default usePanningStore;
