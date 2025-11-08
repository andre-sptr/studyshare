// src/hooks/useAuth.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/intragation/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Tipe untuk data yang akan kita sediakan
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Buat Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Cek sesi yang ada saat aplikasi pertama kali dimuat
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    // Dengarkan perubahan status auth (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Hentikan listener saat komponen di-unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fungsi logout
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Buat Hook kustom untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};