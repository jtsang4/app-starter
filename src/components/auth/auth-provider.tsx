import { useAuthInit } from "@/hooks/use-auth";
import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize auth state on mount
  useAuthInit();

  return <>{children}</>;
}
