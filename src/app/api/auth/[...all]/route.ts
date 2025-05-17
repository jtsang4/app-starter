import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

/**
 * Better Auth API route handler
 * This catch-all route handles all authentication-related API requests
 */
export const { GET, POST } = toNextJsHandler(auth);
