import create from "zustand";
import { persist } from "zustand/middleware";

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
  lightmode: boolean;
  sponsors: {
    users: Sponsor[];
    nextDate: number;
  };
  setSponsors: (sponsors: Sponsor[]) => void;
  setLightTheme: (theme: boolean) => void;
}

const useStored = create(
  persist<Config>(
    (set) => ({
      lightmode: true,
      sponsors: {
        users: [],
        nextDate: Date.now(),
      },
      setLightTheme: (enabled: boolean) =>
        set((state) => {
          return {
            ...state,
            lightmode: enabled,
          };
        }),
      setSponsors: (users) =>
        set((state) => ({
          ...state,
          sponsors: {
            users,
            nextDate: getTomorrow(),
          },
        })),
    }),
    {
      name: "config",
    }
  )
);

export default useStored;
