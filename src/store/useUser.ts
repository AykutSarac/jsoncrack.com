import toast from "react-hot-toast";
import { create } from "zustand";
import { altogic } from "src/api/altogic";
import { AltogicAuth, User } from "src/typings/altogic";
import useModal from "./useModal";

const isDevelopment = process.env.NODE_ENV === "development";

interface CustomUser extends User {
  premium: {
    status: boolean;
    end_date: string;
  };
  type: 0 | 1;
}

interface UserActions {
  login: (response: AltogicAuth) => void;
  logout: () => void;
  setUser: (key: keyof typeof initialStates, value: any) => void;
  checkSession: () => void;
  isPremium: () => boolean;
}

const devUser = {
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
} as CustomUser;

interface UserStates {
  user: CustomUser | null;
  isAuthenticated: boolean;
}

const initialStates: UserStates = {
  isAuthenticated: false,
  user: null,
};

const useUser = create<UserStates & UserActions>()((set, get) => ({
  ...initialStates,
  setUser: (key, value) => set({ [key]: value }),
  isPremium: () => {
    const user = get().user;

    if (user) return user.type > 0;
    return false;
  },
  logout: async () => {
    const session = altogic.auth.getSession();
    if (!session) return;

    const { errors } = await altogic.auth.signOut(session.token);
    if (errors?.items) return console.error(errors);

    set(initialStates);
    altogic.auth.clearLocalData();
    toast.success("Logged out.");
    useModal.setState({ account: false });
  },
  login: user => set({ user: user as unknown as CustomUser, isAuthenticated: true }),
  checkSession: async () => {
    const currentSession = altogic.auth.getSession();

    if (currentSession) {
      if (isDevelopment) {
        return set({ user: devUser as CustomUser, isAuthenticated: true });
      }
      const { user, errors } = await altogic.auth.getUserFromDB();
      if (errors?.items || !user) {
        altogic.auth.clearLocalData();
        return;
      }

      altogic.auth.setUser(user);
      altogic.auth.setSession(currentSession);

      set({ user: user as CustomUser, isAuthenticated: true });
    } else if (new URLSearchParams(window.location.search).get("access_token")) {
      const { errors, user } = await altogic.auth.getAuthGrant();
      if (errors?.items) {
        toast.error(errors.items[0].message);
        return;
      }

      set({ user: user as CustomUser, isAuthenticated: true });
    }
  },
}));

export default useUser;
