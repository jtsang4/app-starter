# Better Auth Integration Guide

This document explains how Better Auth has been integrated into the App Starter project.

## Overview

The authentication system is built using:
- **Better Auth** - Core authentication library
- **TanStack Store** - State management for auth state
- **TanStack Router** - Routing and navigation
- **Drizzle ORM** - Database integration

## Architecture

### Core Components

1. **Server Configuration** (`src/lib/auth.ts`)
   - Better Auth server instance
   - Database adapter configuration
   - Session management
   - Admin plugin

2. **Client Configuration** (`src/lib/auth-client.ts`)
   - Better Auth React client
   - Admin client plugin

3. **Auth Store** (`src/lib/auth-store.ts`)
   - TanStack Store for auth state
   - Actions for sign in/up/out
   - Session management

4. **Auth Hooks** (`src/hooks/use-auth.ts`)
   - React hooks for accessing auth state
   - Convenience hooks for auth actions

5. **Auth Provider** (`src/components/auth/auth-provider.tsx`)
   - Initializes auth state on app mount
   - Wraps the entire application

6. **Auth Guards** (`src/components/auth/`)
   - `AuthGuard` - Protects routes requiring authentication
   - `AdminGuard` - Protects routes requiring admin access

7. **UI Components** (`src/components/auth/`)
   - `SignInForm` - Login form with email/password and Google OAuth
   - `SignUpForm` - Registration form

8. **API Routes** (`src/routes/api/auth.$.ts`)
   - Handles all Better Auth API requests
   - Catch-all route for auth endpoints

## Environment Variables

Add these to your `.env` file:

```bash
# App Configuration
VITE_APP_URL="http://localhost:3000"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/appstarter"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin Configuration
ADMIN_EMAILS="admin@appstarter.com"
```

### Generating BETTER_AUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

## Database Setup

The database schemas are already defined in `src/db/schema/`:
- `user.ts` - User table
- `account.ts` - OAuth accounts
- `session.ts` - User sessions
- `verification.ts` - Email/phone verification

Run migrations:

```bash
pnpm db:push
```

## Usage Examples

### Protecting Routes

#### Basic Authentication

```tsx
import { AuthGuard } from "@/components/auth/auth-guard";

function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

#### Admin-Only Routes

```tsx
import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminGuard } from "@/components/auth/admin-guard";

function AdminPage() {
  return (
    <AuthGuard>
      <AdminGuard>
        <div>This content is only visible to administrators</div>
      </AdminGuard>
    </AuthGuard>
  );
}
```

### Using Auth Hooks

```tsx
import { useUser, useIsAuthenticated, useSignOut } from "@/hooks/use-auth";

function MyComponent() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Manual Sign In/Up

```tsx
import { useSignIn, useSignUp } from "@/hooks/use-auth";

function LoginComponent() {
  const signIn = useSignIn();
  const signUp = useSignUp();

  const handleSignIn = async () => {
    const result = await signIn("user@example.com", "password");
    if (result.success) {
      console.log("Signed in successfully!");
    } else {
      console.error("Sign in failed:", result.error);
    }
  };

  const handleSignUp = async () => {
    const result = await signUp("user@example.com", "password", "John Doe");
    if (result.success) {
      console.log("Signed up successfully!");
    } else {
      console.error("Sign up failed:", result.error);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
```

## Available Routes

- `/auth/sign-in` - Email/password sign in page
- `/auth/sign-up` - Registration page
- `/auth/phone-sign-in` - Phone number sign in page
- `/dashboard` - Example protected route
- `/admin` - Example admin-only route
- `/api/auth/*` - Better Auth API endpoints

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to `.env`

## Phone Number Authentication

Phone number authentication is **fully implemented** with a mock SMS provider for development.

### Current Implementation

The `phoneNumber` plugin in `src/lib/auth.ts` uses a mock SMS implementation that logs OTP codes to the console. This is perfect for development and testing.

**In development:**
- OTP codes are logged to the server console
- No actual SMS is sent
- You can copy the code from console logs

**For production:**
Replace the mock implementation with a real SMS provider:

```typescript
phoneNumber({
  sendOTP: async (phoneNumber, otp) => {
    // Example with Twilio
    await twilioClient.messages.create({
      body: `Your verification code is: ${otp}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  },
}),
```

### Using Phone Authentication

1. **Navigate to phone sign-in page:** `/auth/phone-sign-in`
2. **Enter phone number** with country code (e.g., +1234567890)
3. **Check server console** for the OTP code (in development)
4. **Enter the OTP code** to sign in

### Available Hooks

```typescript
import { useSendPhoneOTP, useVerifyPhoneOTP } from "@/hooks/use-auth";

function MyComponent() {
  const sendOTP = useSendPhoneOTP();
  const verifyOTP = useVerifyPhoneOTP();

  const handleSendOTP = async () => {
    const result = await sendOTP("+1234567890");
    if (result.success) {
      console.log("OTP sent!");
    }
  };

  const handleVerify = async () => {
    const result = await verifyOTP("+1234567890", "123456");
    if (result.success) {
      console.log("Signed in!");
    }
  };
}
```

### Database Schema

The `user` table includes phone number fields:
- `phoneNumber` - User's phone number
- `phoneNumberVerified` - Whether the phone number is verified

## Admin Configuration

To make a user an administrator:

1. Add their email to the `ADMIN_EMAILS` environment variable:
   ```bash
   ADMIN_EMAILS="admin1@example.com,admin2@example.com"
   ```

2. The `useIsAdmin()` hook will automatically check if the current user's email is in this list.

## Security Best Practices

1. **Always use HTTPS in production**
2. **Keep BETTER_AUTH_SECRET secure** - Never commit it to version control
3. **Use strong passwords** - Enforce minimum 8 characters
4. **Enable email verification** in production:
   ```typescript
   emailAndPassword: {
     enabled: true,
     requireEmailVerification: true,
   }
   ```
5. **Configure session expiry** appropriately for your use case
6. **Regularly rotate secrets** and OAuth credentials

## Troubleshooting

### Auth state not persisting

- Check that `AuthProvider` is wrapping your app in `__root.tsx`
- Verify browser localStorage is enabled

### OAuth redirect not working

- Check redirect URIs in OAuth provider settings
- Verify `VITE_APP_URL` matches your current domain

### Database connection errors

- Verify `DATABASE_URL` is correct
- Ensure database is running
- Check that migrations have been applied

### Session expires immediately

- Check `BETTER_AUTH_SECRET` is set and at least 32 characters
- Verify session configuration in `src/lib/auth.ts`

## Next Steps

1. **Implement email verification** - Add email sending service
2. **Add phone number auth** - Configure SMS provider
3. **Customize UI** - Style auth forms to match your brand
4. **Add more OAuth providers** - GitHub, Facebook, etc.
5. **Implement password reset** - Add forgot password flow
6. **Add 2FA** - Enhance security with two-factor authentication

## Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [TanStack Store Documentation](https://tanstack.com/store)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

