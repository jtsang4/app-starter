'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';

/**
 * Forgot password form component
 * Handles password reset request
 */
export const ForgotPasswordForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // For demo purposes, we'll just simulate a successful request
      // In a real app, you would call the password reset API
      // const { error } = await authClient.resetPassword({ email: values.email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // if (error) {
      //   setError(error.message || 'Failed to send password reset email. Please try again later.');
      // } else {
      setSuccess(true);
      // }
    } catch (err) {
      setError(
        'An error occurred during password reset. Please try again later.',
      );
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Alert
          message="Password reset email sent"
          description={
            <div>
              <p>We have sent you an email with a password reset link.</p>
              <p>
                If you haven't received the email, please check your spam folder
                or try resending.
              </p>
            </div>
          }
          type="success"
          showIcon
          style={{ marginBottom: '24px', textAlign: 'left' }}
        />
        <Space>
          <Button type="primary" href="/login">
            Back to login
          </Button>
          <Button onClick={() => setSuccess(false)}>Resend</Button>
        </Space>
      </div>
    );
  }

  return (
    <Form
      name="forgotPassword"
      onFinish={handleSubmit}
      layout="vertical"
      size="large"
    >
      {error && (
        <Form.Item>
          <Alert message={error} type="error" showIcon />
        </Form.Item>
      )}

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please enter your email.' },
          { type: 'email', message: 'Please enter a valid email address.' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: '100%' }}
        >
          Send password reset email
        </Button>
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Space>
          Remember your password? <Link href="/login">Sign in</Link>
        </Space>
      </Form.Item>
    </Form>
  );
};
