import { Session, User } from "@supabase/supabase-js";
import ReactGA from "react-ga4";
import toast from "react-hot-toast";
import { create } from "zustand";
import { supabase } from "src/lib/api/supabase";

interface UserActions {
  logout: () => void;
  setSession: (session: Session) => void;
}

interface UserStates {
  user: User | null;
  isAuthenticated: boolean;
  premium: boolean;
  premiumCancelled: boolean;
  organization: boolean;
  orgAdmin: boolean;
}

const initialStates: UserStates = {
  user: null,
  isAuthenticated: false,
  premium: false,
  premiumCancelled: false,
  organization: false,
  orgAdmin: false,
};

const useUser = create<UserStates & UserActions>()(set => ({
  ...initialStates,
  setSession: async session => {
    supabase.rpc("get_subscription_details").then(({ data }) => {
      if (data) {
        set({
          premium: data.premium,
          organization: data.orgPremium,
          premiumCancelled: !!data.cancelled,
          orgAdmin: data.orgAdmin,
        });

        ReactGA.set({ tier: data.premium ? "premium" : "free" });
      }

      set({ user: session.user, isAuthenticated: true });
      ReactGA.set({ userId: session.user.id });
    });
  },
  logout: async () => {
    toast.loading("Logging out...", { id: "logout" });
    await supabase.auth.signOut();
    set(initialStates);
    toast.success("Logged out.", { id: "logout" });
  },
}));

export default useUser;
