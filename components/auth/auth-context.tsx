"use client";

import { createContext, useContext, useState, useCallback } from "react";

type AuthMode = "signin" | "signup";

interface AuthContextType {
  isOpen: boolean;
  mode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  switchMode: () => void;
  handleSignUpSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");

  const openAuth = useCallback((initialMode: AuthMode = "signin") => {
    setMode(initialMode);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  const switchMode = useCallback(() => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  }, []);

  const handleSignUpSuccess = useCallback(() => {
    // After successful signup, switch to signin mode
    setMode("signin");
  }, []);

  return (
    <AuthContext.Provider
      value={{ isOpen, mode, openAuth, closeAuth, switchMode, handleSignUpSuccess }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
