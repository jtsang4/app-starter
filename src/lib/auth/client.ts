'use client';

import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth client for React components
 * This client is used for client-side authentication operations
 */
export const authClient = createAuthClient({
  // Base URL is optional if the auth server is on the same domain
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4023',
});

// Export individual methods for convenience
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
