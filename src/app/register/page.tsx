'use client';

import type { FC } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/component/auth/auth-layout';
import { RegisterForm } from '@/component/auth/register-form';

/**
 * Register form wrapper that uses search params
 */
const RegisterFormWrapper: FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/protected';

  return <RegisterForm redirectUrl={callbackUrl} />;
};

/**
 * Registration page
 * Displays the registration form and handles user registration
 */
const RegisterPage: FC = () => {
  return (
    <AuthLayout title="Register" subtitle="Create your account, get started!">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterFormWrapper />
      </Suspense>
    </AuthLayout>
  );
};

export default RegisterPage;
