import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";

type AuthSessionContextValue = {
  session: Session | null;
  activateDevelopmentFlow: () => void;
  isDevelopmentFlow: boolean;
};

export const AuthSessionContext = createContext<AuthSessionContextValue | null>(
  null,
);

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionContext");
  }

  return context;
}
