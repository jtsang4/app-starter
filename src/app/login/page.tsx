'use client';

import type { FC } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/component/auth/auth-layout';
import { LoginForm } from '@/component/auth/login-form';

/**
 * Login form wrapper that uses search params
 */
const LoginFormWrapper: FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/protected';

  return <LoginForm redirectUrl={callbackUrl} />;
};

/**
 * Login page
 * Displays the login form and handles authentication
 */
const LoginPage: FC = () => {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back, please sign in to your account"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormWrapper />
      </Suspense>
    </AuthLayout>
  );
};

export default LoginPage;
