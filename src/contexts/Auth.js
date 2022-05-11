import React, { useContext, useState, useEffect } from "react";
import { supabase } from "../supabase";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check active session and sets user
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);

    // listen for changes on auth state
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    //listen for close page and signout on close
    const onBeforeUnload = (e) => {
      supabase.auth.signOut();
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    //unsubscribe on unmount & remove close page listener
    return () => {
      listener?.unsubscribe();
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  // Will be passed down to Signup, Login and Dashboard components
  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
