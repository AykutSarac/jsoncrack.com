import toast from "react-hot-toast";
import { create } from "zustand";
import { altogic } from "src/api/altogic";
import { AltogicAuth, User } from "src/typings/altogic";
import useModal from "./useModal";

const isDevelopment = process.env.NODE_ENV === "development";

interface UserActions {
  login: (response: AltogicAuth) => void;
  logout: () => void;
  setUser: (key: keyof typeof initialStates, value: any) => void;
  checkSession: () => void;
  isPremium: () => boolean;
}

const initialUser = () => {
  if (isDevelopment) {
    return {
      _id: "0",
      provider: "google",
      providerUserId: "115637229829349229857",
      email: "test@jsoncrack.com",
      name: "JSON Crack",
      profilePicture: "",
      signUpAt: "2022-12-04T11:07:32.000Z",
      lastLoginAt: "2023-05-13T09:56:02.915Z",
      updatedAt: "2023-05-06T16:19:47.486Z",
      type: 1,
    } as User;
  } else null;
};

const initialStates = {
  isAuthenticated: isDevelopment,
  user: initialUser() as User | null,
};

export type UserStates = typeof initialStates;

const useUser = create<UserStates & UserActions>()((set, get) => ({
  ...initialStates,
  setUser: (key, value) => set({ [key]: value }),
  isPremium: () => {
    const user = get().user;

    if (isDevelopment) return true;
    if (user) return user.type > 0;
    return false;
  },
  logout: () => {
    altogic.auth.signOut();
    toast.success("Logged out.");
    useModal.setState({ account: false });
    set(initialStates);
  },
  login: response => {
    set({ user: response.user as any, isAuthenticated: true });
  },
  checkSession: async () => {
    const currentSession = altogic.auth.getSession();

    if (currentSession) {
      const dbUser = await altogic.auth.getUserFromDB();

      altogic.auth.setSession(currentSession);
      set({ user: dbUser.user as any, isAuthenticated: true });
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
