import React from "react";
import { supabase } from "src/lib/api/supabase";
import useUser from "src/store/useUser";

export const useCheckSession = () => {
  const [hasSession, setHasSession] = React.useState(false);
  const setSession = useUser(state => state.setSession);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setHasSession(true);
      } else setHasSession(false);
    });
  }, [setSession]);

  return { hasSession };
};
