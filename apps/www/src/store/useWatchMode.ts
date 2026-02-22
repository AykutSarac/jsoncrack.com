import { create } from "zustand";

interface WatchModeState {
  isWatching: boolean;
  interval: NodeJS.Timeout | null;
  setWatcherInterval: (interval: NodeJS.Timeout) => void;
  toggleWatchMode: (isWatching?: boolean) => boolean;
  getIsWatching: () => boolean;
}

const useWatchMode = create<WatchModeState>((set, get) => ({
  isWatching: false,
  interval: null,

  toggleWatchMode: isWatching => {
    const newState = isWatching !== undefined ? isWatching : !get().isWatching;
    if (!newState) {
      const interval = get().interval;
      if (interval) clearInterval(interval);
    }
    set({ isWatching: newState });
    return newState;
  },

  getIsWatching: () => get().isWatching,

  setWatcherInterval: interval => {
    const oldInterval = get().interval;
    if (oldInterval) clearInterval(oldInterval);
    set({ interval });
  },
}));

export default useWatchMode;
