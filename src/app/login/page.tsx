'use client';

import type { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/component/auth/auth-layout';
import { LoginForm } from '@/component/auth/login-form';

/**
 * Login page
 * Displays the login form and handles authentication
 */
const LoginPage: FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/protected';

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back, please sign in to your account"
    >
      <LoginForm redirectUrl={callbackUrl} />
    </AuthLayout>
  );
};

export default LoginPage;
