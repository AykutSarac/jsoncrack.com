import toast from "react-hot-toast";
import { altogic } from "src/api/altogic";
import { AltogicAuth, User } from "src/typings/altogic";
import { create } from "zustand";
import useModal from "./useModal";

interface UserActions {
  login: (response: AltogicAuth) => void;
  logout: () => void;
  setUser: (key: keyof typeof initialStates, value: any) => void;
  checkSession: () => void;
  isPremium: () => boolean;
  tokenAuth: () => Promise<void>;
  validatePremium: (cb: () => void) => void;
}

const initialStates = {
  isAuthenticated: false,
  user: null as User | null,
};

export type UserStates = typeof initialStates;

const useUser = create<UserStates & UserActions>()((set, get) => ({
  ...initialStates,
  setUser: (key, value) => set({ [key]: value }),
  isPremium: () => {
    const user = get().user;

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
  tokenAuth: async () => {
    if (new URLSearchParams(window.location.search).get("access_token")) {
      const data = await altogic.auth.getAuthGrant();

      if ((data.user as any)?.type > 0) {
        location.replace(location.href.replace("://", "://pro."));
      } else {
        set({ user: data.user as any, isAuthenticated: true });
      }
    }
  },
  checkSession: async () => {
    if (process.env.NODE_ENV === "development") {
      return set({
        user: {
          _id: "0",
          provider: "altogic",
          providerUserId: "1",
          email: "development@jsoncrack.com",
          name: "JSON Crack",
          profilePicture: "",
          signUpAt: "2022-12-04T11:07:32.000Z",
          lastLoginAt: "2023-03-12T14:17:03.146Z",
          type: 1,
          updatedAt: "2022-12-30T10:56:29.772Z",
        },
        isAuthenticated: true,
      });
    }

    const currentSession = altogic.auth.getSession();

    if (currentSession) {
      const dbUser = await altogic.auth.getUserFromDB();
      console.log(dbUser);

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
  validatePremium: callback => {
    if (get().isAuthenticated) {
      if (!get().isPremium()) return useModal.getState().setVisible("premium")(true);
      return callback();
    } else {
      return useModal.getState().setVisible("account")(true);
    }
  },
}));

export default useUser;
