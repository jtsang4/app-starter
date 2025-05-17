import { headers } from 'next/headers';
import { auth } from './index';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Get the authenticated user from the request headers
 * This function should be used in server contexts (API routes, Server Components, etc.)
 */
export async function getAuthUser(request?: NextRequest) {
  try {
    // Use provided request headers or get from Next.js headers() function
    const headersList = request ? request.headers : await headers();

    // Get the session from Better Auth
    const session = await auth.api.getSession({
      headers: headersList,
    });

    return session?.user || null;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Get the authenticated user from cookies
 * This function should be used in Server Actions
 */
export async function getAuthUserFromServerAction() {
  try {
    // Get the headers from cookies for Server Actions
    const headersList = new Headers();

    // Get all cookies and convert them to a header string
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieString = allCookies
      .map(
        (cookie: { name: string; value: string }) =>
          `${cookie.name}=${cookie.value}`,
      )
      .join('; ');

    if (cookieString) {
      headersList.set('cookie', cookieString);
    }

    // Get the session from Better Auth using headers created from cookies
    const session = await auth.api.getSession({
      headers: headersList,
    });

    return session?.user || null;
  } catch (error) {
    console.error(
      'Error getting authenticated user from server action:',
      error,
    );
    return null;
  }
}

/**
 * Get the authenticated user ID from the request headers
 * Returns null if the user is not authenticated
 */
export async function getAuthUserId(
  request?: NextRequest,
): Promise<string | null> {
  const user = await getAuthUser(request);
  return user?.id || null;
}

/**
 * Get the authenticated user ID from cookies
 * This function should be used in Server Actions
 * Returns null if the user is not authenticated
 */
export async function getAuthUserIdFromServerAction(): Promise<string | null> {
  const user = await getAuthUserFromServerAction();
  return user?.id || null;
}
