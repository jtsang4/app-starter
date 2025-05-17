'use client';

import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/client';

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Session provider component
 * Handles authentication state and redirects for protected routes
 */
export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Protected routes that require authentication
  const protectedRoutes = ['/protected'];

  // Public routes that should redirect to dashboard if already authenticated
  const publicAuthRoutes = ['/login', '/register', '/forgot-password'];

  useEffect(() => {
    // Skip during server-side rendering or while session is loading
    if (isPending) return;

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname?.startsWith(route),
    );

    // Check if the current route is a public auth route
    const isPublicAuthRoute = publicAuthRoutes.some((route) =>
      pathname?.startsWith(route),
    );

    // Redirect to login if trying to access a protected route without authentication
    if (isProtectedRoute && !session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || '')}`);
    }

    // Redirect to dashboard if already authenticated and trying to access a public auth route
    if (isPublicAuthRoute && session) {
      router.push('/protected');
    }
  }, [session, isPending, pathname, router]);

  return <>{children}</>;
};
