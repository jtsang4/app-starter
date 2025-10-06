import { Store } from "@tanstack/store";
import { authClient } from "./auth-client";

// Use better-auth's inferred types
type AuthUser = typeof authClient.$Infer.Session.user | null;
type AuthSession = typeof authClient.$Infer.Session.session | null;

export interface AuthState {
  user: AuthUser;
  session: AuthSession;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const authStore = new Store<AuthState>(initialState);

// Actions
export const authActions = {
  setLoading: (isLoading: boolean) => {
    authStore.setState((state) => ({ ...state, isLoading }));
  },

  setError: (error: string | null) => {
    authStore.setState((state) => ({ ...state, error }));
  },

  setAuth: (user: AuthUser, session: AuthSession) => {
    authStore.setState((state) => ({
      ...state,
      user,
      session,
      isAuthenticated: !!user && !!session,
      error: null,
    }));
  },

  clearAuth: () => {
    authStore.setState((state) => ({
      ...state,
      user: null,
      session: null,
      isAuthenticated: false,
    }));
  },

  setInitialized: (isInitialized: boolean) => {
    authStore.setState((state) => ({ ...state, isInitialized }));
  },

  // Initialize auth state from server
  initialize: async () => {
    if (authStore.state.isInitialized) return;

    authActions.setLoading(true);
    try {
      const session = await authClient.getSession();
      if (session.data) {
        authActions.setAuth(session.data.user, session.data.session);
      } else {
        authActions.clearAuth();
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      authActions.setError(
        error instanceof Error ? error.message : "Failed to initialize auth",
      );
      authActions.clearAuth();
    } finally {
      authActions.setLoading(false);
      authActions.setInitialized(true);
    }
  },

  // Sign in with email/password
  signIn: async (email: string, password: string) => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.data) {
        // Refresh session to get full user data
        await authActions.refreshSession();
        return { success: true };
      }

      const errorMessage = result.error?.message || "Sign in failed";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign in failed";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      authActions.setLoading(false);
    }
  },

  // Sign up with email/password
  signUp: async (email: string, password: string, name?: string) => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name: name || "",
      });

      if (result.data) {
        // Refresh session to get full user data
        await authActions.refreshSession();
        return { success: true };
      }

      const errorMessage = result.error?.message || "Sign up failed";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign up failed";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      authActions.setLoading(false);
    }
  },

  // Sign out
  signOut: async () => {
    authActions.setLoading(true);
    try {
      await authClient.signOut();
      authActions.clearAuth();
    } catch (error) {
      console.error("Sign out failed:", error);
      // Clear auth state anyway
      authActions.clearAuth();
    } finally {
      authActions.setLoading(false);
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      await authClient.signIn.social({
        provider: "google",
      });
      // The redirect will happen automatically
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Google sign in failed";
      authActions.setError(errorMessage);
      authActions.setLoading(false);
    }
  },

  // Refresh session
  refreshSession: async () => {
    try {
      const session = await authClient.getSession();
      if (session.data) {
        authActions.setAuth(session.data.user, session.data.session);
      } else {
        authActions.clearAuth();
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      authActions.clearAuth();
    }
  },

  // Update user profile
  updateUser: async (data: { name?: string; image?: string }) => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const result = await authClient.updateUser(data);

      if (result.data?.status) {
        await authActions.refreshSession();
        return { success: true };
      }

      const errorMessage = result.error?.message || "Update failed";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Update failed";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      authActions.setLoading(false);
    }
  },

  // Send OTP to phone number
  sendPhoneOTP: async (phoneNumber: string) => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const result = await authClient.phoneNumber.sendOtp({
        phoneNumber,
      });

      if (result.data) {
        authActions.setLoading(false);
        return { success: true };
      }

      const errorMessage = result.error?.message || "Failed to send OTP";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      authActions.setLoading(false);
    }
  },

  // Verify OTP and sign in with phone number
  verifyPhoneOTP: async (phoneNumber: string, otp: string) => {
    authActions.setLoading(true);
    authActions.setError(null);

    try {
      const result = await authClient.phoneNumber.verify({
        phoneNumber,
        code: otp,
      });

      if (result.data) {
        // Refresh session to get full user data
        await authActions.refreshSession();
        return { success: true };
      }

      const errorMessage = result.error?.message || "Invalid OTP";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid OTP";
      authActions.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      authActions.setLoading(false);
    }
  },
};

// Selectors
export const authSelectors = {
  user: () => authStore.state.user,
  session: () => authStore.state.session,
  isAuthenticated: () => authStore.state.isAuthenticated,
  isLoading: () => authStore.state.isLoading,
  isInitialized: () => authStore.state.isInitialized,
  error: () => authStore.state.error,
};
