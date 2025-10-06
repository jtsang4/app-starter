import { useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import { authActions, authStore } from "@/lib/auth-store";
import { env } from "@/env";

// Hook to get current user
export function useUser() {
  return useStore(authStore, (state) => state.user);
}

// Hook to get current session
export function useSession() {
  return useStore(authStore, (state) => state.session);
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  return useStore(authStore, (state) => state.isAuthenticated);
}

// Hook to get loading state
export function useAuthLoading() {
  return useStore(authStore, (state) => state.isLoading);
}

// Hook to get initialized state
export function useAuthInitialized() {
  return useStore(authStore, (state) => state.isInitialized);
}

// Hook to get error state
export function useAuthError() {
  return useStore(authStore, (state) => state.error);
}

// Hook to get all auth state
export function useAuthState() {
  return useStore(authStore);
}

// Hook to initialize auth (call once in root component)
export function useAuthInit() {
  useEffect(() => {
    authActions.initialize();
  }, []);
}

// Hook to get auth actions
export function useAuthActions() {
  return authActions;
}

// Convenience hooks for specific actions
export function useSignIn() {
  return authActions.signIn;
}

export function useSignUp() {
  return authActions.signUp;
}

export function useSignOut() {
  return authActions.signOut;
}

export function useSignInWithGoogle() {
  return authActions.signInWithGoogle;
}

export function useRefreshSession() {
  return authActions.refreshSession;
}

export function useUpdateUser() {
  return authActions.updateUser;
}

// Hook to check if user is admin
export function useIsAdmin() {
  const user = useUser();
  // Check if user email is in admin list
  // You can customize this logic based on your needs
  return user?.email ? isAdminEmail(user.email) : false;
}

// Helper function to check admin status
function isAdminEmail(email: string): boolean {
  const adminEmails =
    env.VITE_ADMIN_EMAILS?.split(",").map((e: string) => e.trim()) || [];
  return adminEmails.includes(email);
}

// Phone number authentication hooks
export function useSendPhoneOTP() {
  return authActions.sendPhoneOTP;
}

export function useVerifyPhoneOTP() {
  return authActions.verifyPhoneOTP;
}
