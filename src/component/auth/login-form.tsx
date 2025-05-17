'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { Form, Input, Button, Checkbox, Alert, Space } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth/client';

interface LoginFormProps {
  redirectUrl?: string;
}

/**
 * Login form component
 * Handles email/password authentication
 */
export const LoginForm: FC<LoginFormProps> = ({
  redirectUrl = '/protected',
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: redirectUrl,
        rememberMe: values.remember,
      });

      if (error) {
        setError(
          error.message ||
            'Login failed. Please check your email and password.',
        );
      } else if (data) {
        router.push(redirectUrl);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
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

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please enter your password.' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: '100%' }}
        >
          Sign in
        </Button>
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Space>
          Don't have an account? <Link href="/register">Sign up</Link>
        </Space>
      </Form.Item>
    </Form>
  );
};
