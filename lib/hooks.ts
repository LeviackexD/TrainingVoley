"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { SessionContext } from "@/contexts/SessionContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useSessions = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSessions must be used within a SessionProvider");
    }
    return context;
}
