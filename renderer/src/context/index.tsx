import React from "react";
import { Session, User } from "@supabase/supabase-js";
import { useContext, useState, useEffect, createContext } from "react";
import { supabase } from "../utils/supabase/supabase";
import { decideUserHomeScreen } from "../utils/decideUserHomeScreen";
import { ipcRenderer } from "electron";
import router from "next/router";

// create a context for authentication
const AuthContext = createContext<{
  session: Session | null | undefined;
  user: User | null | undefined;
  signOut: () => void;
  loading: boolean | null | undefined;
  activeSubscription: boolean;
}>({
  session: null,
  user: null,
  signOut: () => {},
  loading: true,
  activeSubscription: false,
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session | null>();
  const [loading, setLoading] = useState(true);
  const [activeSubscription, setActiveSubscription] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (supabase) {
      const setData = async () => {
        if (supabase) {
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();
          if (error) throw error;
          setSession(session);
          setUser(session?.user);
        }
      };

      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user);
        }
      );

      setData();

      setLoading(false);
      return () => {
        listener?.subscription.unsubscribe();
      };
    }
    setLoading(false);
  }, []);

  const value = {
    session,
    user,
    activeSubscription,
    signOut: () => {
      setLoading(true);
      if (supabase) {
        supabase.auth.signOut();
        setUser(null);
        setSession(null);
        ipcRenderer.send("user-is-logged-out");
        router.push("/login");
      }
      setLoading(false);
    },
    loading,
  };

  useEffect(() => {
    if (!loading) {
      decideUserHomeScreen(user);
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
