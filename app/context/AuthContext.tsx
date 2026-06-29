"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { User } from "../../lib/types";
import { supabase } from "../../lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string, isRegister?: boolean) => Promise<{ session: any | null; error: any | null }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async (sessionParam?: any) => {
    try {
      const session = sessionParam || (await supabase.auth.getSession()).data.session;

      if (session?.user) {
        const basicUser: User = {
          id: session.user.id,
          email: session.user.email || null,
          full_name: session.user.email?.split("@")[0] || "User",
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
          phone: null,
        };

        // Load profile from shared DB profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || null,
            full_name: profile.full_name || basicUser.full_name,
            avatar_url: profile.avatar_url || basicUser.avatar_url,
            phone: profile.phone || null,
          });
        } else {
          // If profile row doesn't exist yet, insert a default one to respect RLS
          const defaultProfile = {
            id: session.user.id,
            full_name: basicUser.full_name,
            avatar_url: basicUser.avatar_url,
          };
          
          await supabase.from("profiles").insert(defaultProfile);
          setUser(basicUser);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext Maisonelle checkSession error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        checkSession(session);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession]);

  const login = useCallback(async (email: string, password?: string, isRegister = false) => {
    try {
      if (isRegister && password) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return { session: data.session, error: null };
      } else if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { session: data.session, error: null };
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        return { session: null, error: null };
      }
    } catch (err) {
      console.error("AuthContext Maisonelle action failed:", err);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    checkSession
  }), [user, loading, login, logout, checkSession]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
