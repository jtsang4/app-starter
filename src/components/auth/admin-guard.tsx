import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import {
  useAuthInitialized,
  useAuthLoading,
  useIsAdmin,
  useIsAuthenticated,
} from "@/hooks/use-auth";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  showAccessDenied?: boolean;
}

export function AdminGuard({
  children,
  fallback,
  redirectTo = "/",
  showAccessDenied = true,
}: AdminGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const isLoading = useAuthLoading();
  const isInitialized = useAuthInitialized();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated && !isAdmin) {
      navigate({ to: redirectTo });
    }
  }, [
    isInitialized,
    isLoading,
    isAuthenticated,
    isAdmin,
    redirectTo,
    navigate,
  ]);

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

  // Not authenticated - will be handled by AuthGuard
  if (!isAuthenticated) {
    return null;
  }

  // Not admin
  if (!isAdmin) {
    if (!showAccessDenied) {
      return null;
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 mx-auto">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-orange-600 dark:text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-center text-xl font-semibold mb-2">
            Admin Access Required
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            This page is only accessible to administrators. If you believe this
            is an error, please contact your system administrator.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: redirectTo })}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="w-full rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
