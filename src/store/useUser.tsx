import jwt_decode from "jwt-decode";
import { validateToken } from "src/services/google";
import create from "zustand";

interface GoogleUser {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

interface UserActions {
  login: (credential: string) => void;
  setUser: (key: keyof typeof initialStates, value: any) => void;
  checkSession: () => void;
}

const initialStates = {
  isAuthorized: false,
  user: null as GoogleUser | null,
};

export type UserStates = typeof initialStates;

const useUser = create<UserStates & UserActions>()(set => ({
  ...initialStates,
  setUser: (key, value) => set({ [key]: value }),
  checkSession: async () => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        const { data: user } = await validateToken<GoogleUser>(token);
        set({ user, isAuthorized: true });
      } catch (error) {
        set({ isAuthorized: false });
      }
    }
  },
  login: credential => {
    const googleUser = jwt_decode<GoogleUser>(credential);
    localStorage.setItem("auth_token", credential);
    set({ user: googleUser, isAuthorized: true });
  },
}));

export default useUser;
