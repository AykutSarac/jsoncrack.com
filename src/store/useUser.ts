import { Session, User } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { create } from "zustand";
import { supabase } from "src/lib/api/supabase";

interface UserActions {
  logout: () => void;
  setSession: (session: Session) => void;
}

interface Premium {
  id: 101;
  created_at: "2023-07-29T17:33:10.403228+00:00";
  user: null;
  status: "active";
  ends_at: null;
  subscription_id: null;
  variant_id: null;
  renews_at: null;
  cancelled: null;
  email: "aykutsarac0@gmail.com";
}

interface UserStates {
  user: User | null;
  isAuthenticated: boolean;
  premium: boolean;
  premiumCancelled: boolean;
}

const initialStates: UserStates = {
  user: null,
  isAuthenticated: false,
  premium: false,
  premiumCancelled: false,
};

const useUser = create<UserStates & UserActions>()(set => ({
  ...initialStates,
  setSession: async session => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) return toast.error(error.message);

    supabase.rpc("get_subscription", { email_arg: session.user.email }).then(({ data }) => {
      if (data) set({ premium: data[0].status === "active" });
      set({ user, isAuthenticated: true });
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
