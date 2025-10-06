import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import {
  useAuthError,
  useAuthInitialized,
  useAuthLoading,
  useIsAuthenticated,
  useRefreshSession,
} from "@/hooks/use-auth";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  showLoginPrompt?: boolean;
}

export function AuthGuard({
  children,
  fallback,
  redirectTo = "/auth/sign-in",
  showLoginPrompt = true,
}: AuthGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const isInitialized = useAuthInitialized();
  const error = useAuthError();
  const refreshSession = useRefreshSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      const separator = redirectTo.includes("?") ? "&" : "?";
      const loginUrl = `${redirectTo}${separator}callbackUrl=${encodeURIComponent(currentPath)}`;
      navigate({ to: loginUrl });
    }
  }, [isInitialized, isLoading, isAuthenticated, redirectTo, navigate]);

  // Show loading state
  if (!isInitialized || isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-center text-xl font-semibold mb-2">
            Authentication Error
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            {error}
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => refreshSession()}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Refresh Session
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: redirectTo })}
              className="w-full rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt
  if (!isAuthenticated) {
    if (!showLoginPrompt) {
      return null;
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-center text-xl font-semibold mb-2">
            Access Denied
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            You need to be logged in to access this page.
          </p>
          <button
            type="button"
            onClick={() => {
              const currentPath =
                window.location.pathname + window.location.search;
              const separator = redirectTo.includes("?") ? "&" : "?";
              const loginUrl = `${redirectTo}${separator}callbackUrl=${encodeURIComponent(currentPath)}`;
              navigate({ to: loginUrl });
            }}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
