import toast from "react-hot-toast";
import { altogic } from "src/services/altogic";
import { AltogicAuth } from "src/typings/altogic";
import create from "zustand";

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
    localStorage.removeItem("auth_token");
    toast.success("Logged out.");
    set(initialStates);
  },
  login: response => {
    // localStorage.setItem("auth_token", response.session.token);
    set({ user: response.user, isAuthenticated: true });
  },
  checkSession: () => {
    const currentSession = altogic.auth.getSession();
    const currentUser = altogic.auth.getUser();

    if (currentSession) {
      altogic.auth.setSession(currentSession);
      set({ user: currentUser as any, isAuthenticated: true });
    }
  },
}));

export default useUser;
