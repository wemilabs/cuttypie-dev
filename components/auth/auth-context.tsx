"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface AuthContextType {
  isOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAuth = useCallback(() => setIsOpen(true), []);
  const closeAuth = useCallback(() => setIsOpen(false), []);

  return (
    <AuthContext.Provider value={{ isOpen, openAuth, closeAuth }}>
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
