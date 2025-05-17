'use client';

import type { FC } from 'react';
import { AuthLayout } from '@/component/auth/auth-layout';
import { ForgotPasswordForm } from '@/component/auth/forgot-password-form';

/**
 * Forgot password page
 * Displays the forgot password form
 */
const ForgotPasswordPage: FC = () => {
  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email, we will send you a password reset link"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
