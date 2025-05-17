'use client';

import type { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '@/component/auth/auth-layout';
import { RegisterForm } from '@/component/auth/register-form';

/**
 * Registration page
 * Displays the registration form and handles user registration
 */
const RegisterPage: FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/protected';

  return (
    <AuthLayout title="Register" subtitle="Create your account, get started!">
      <RegisterForm redirectUrl={callbackUrl} />
    </AuthLayout>
  );
};

export default RegisterPage;
