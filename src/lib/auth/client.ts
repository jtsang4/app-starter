'use client';

import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth client for React components
 * This client is used for client-side authentication operations
 */
export const authClient = createAuthClient({});

// Export individual methods for convenience
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
