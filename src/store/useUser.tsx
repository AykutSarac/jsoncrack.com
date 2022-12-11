import toast from "react-hot-toast";
import { altogic } from "src/api/altogic";
import { AltogicAuth } from "src/typings/altogic";
import create from "zustand";
import useModal from "./useModal";

type User = {
  _id: string;
  provider: string;
  providerUserId: string;
  email: string;
  name: string;
  profilePicture: string;
  signUpAt: Date;
  lastLoginAt: Date;
};
interface UserActions {
  login: (response: AltogicAuth) => void;
  logout: () => void;
  setUser: (key: keyof typeof initialStates, value: any) => void;
  checkSession: () => void;
}

const initialStates = {
  isAuthenticated: false,
  user: null as User | null,
};

export type UserStates = typeof initialStates;

const useUser = create<UserStates & UserActions>()(set => ({
  ...initialStates,
  setUser: (key, value) => set({ [key]: value }),
  logout: () => {
    altogic.auth.signOut();
    toast.success("Logged out.");
    useModal.setState({ account: false });
    set(initialStates);
  },
  login: response => {
    set({ user: response.user, isAuthenticated: true });
  },
  checkSession: async () => {
    const currentSession = altogic.auth.getSession();
    const currentUser = altogic.auth.getUser();

    if (currentSession) {
      altogic.auth.setSession(currentSession);
      set({ user: currentUser as any, isAuthenticated: true });
    } else {
      if (!new URLSearchParams(window.location.search).get("access_token")) return;

      const data = await altogic.auth.getAuthGrant();
      if (!data.errors?.items.length) {
        set({ user: data.user as any, isAuthenticated: true });
      }
    }
  },
}));

export default useUser;
