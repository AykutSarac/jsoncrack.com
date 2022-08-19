import create from "zustand";
import { persist } from "zustand/middleware";
import { defaultConfig, defaultJson } from "src/constants/data";
import { StorageConfig } from "src/typings/global";

type Sponsor = {
  handle: string;
  avatar: string;
  profile: string;
};

function getTomorrow() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Date(tomorrow).getTime();
}

export interface Config {
  json: string;
  getJson: () => string;
  settings: StorageConfig;
  sponsors: {
    users: Sponsor[];
    nextDate: number;
  } | null;
  setSponsors: (sponsors: Sponsor[]) => void;
  updateJson: (json: string) => void;
  loadSettings: (settings: StorageConfig) => void;
  updateSetting: (setting: keyof StorageConfig, value: unknown) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
}

const useConfig = create(
  persist<Config>(
    (set, get) => ({
      json: JSON.stringify(defaultJson),
      getJson: () => get().json,
      settings: defaultConfig,
      sponsors: null,
      setSponsors: (users) =>
        set((state) => ({
          ...state,
          sponsors: {
            users,
            nextDate: getTomorrow(),
          },
        })),
      updateJson: (json: string) => set((state) => ({ ...state, json })),
      zoomIn: () => {
        const zoomPanPinch = get().settings.zoomPanPinch;
        if (zoomPanPinch) {
          zoomPanPinch.setTransform(
            zoomPanPinch?.state.positionX,
            zoomPanPinch?.state.positionY,
            zoomPanPinch?.state.scale + 0.4
          );
        }
      },
      zoomOut: () => {
        const zoomPanPinch = get().settings.zoomPanPinch;
        if (zoomPanPinch) {
          zoomPanPinch.setTransform(
            zoomPanPinch?.state.positionX,
            zoomPanPinch?.state.positionY,
            zoomPanPinch?.state.scale - 0.4
          );
        }
      },
      centerView: () => {
        const zoomPanPinch = get().settings.zoomPanPinch;
        if (zoomPanPinch) zoomPanPinch.resetTransform();
      },
      loadSettings: (settings: StorageConfig) =>
        set((state) => ({ ...state, settings })),
      updateSetting: (setting: keyof StorageConfig, value: unknown) =>
        set((state) => ({
          ...state,
          settings: { ...state.settings, [setting]: value },
        })),
    }),
    {
      name: "config",
      partialize: (state) =>
        ({
          sponsors: {
            ...state.sponsors,
          },
          settings: {
            ...state.settings,
            zoomPanPinch: undefined,
          },
        } as any),
    }
  )
);

export default useConfig;
