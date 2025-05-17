'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth/client';

interface RegisterFormProps {
  redirectUrl?: string;
}

/**
 * Registration form component
 * Handles user registration with email/password
 */
export const RegisterForm: FC<RegisterFormProps> = ({
  redirectUrl = '/protected',
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: redirectUrl,
      });

      if (error) {
        setError(
          error.message || 'Registration failed. Please try again later.',
        );
      } else if (data) {
        // Registration successful, user is automatically signed in
        // Redirect to the callback URL or dashboard
        router.push(redirectUrl);
      }
    } catch (err) {
      setError(
        'An error occurred during registration. Please try again later.',
      );
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="register"
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
        name="name"
        rules={[{ required: true, message: 'Please enter your name.' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Name" />
      </Form.Item>

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
        rules={[
          { required: true, message: 'Please enter your password.' },
          { min: 8, message: 'Password must be at least 8 characters long.' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password.' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match.'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm Password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: '100%' }}
        >
          Register
        </Button>
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Space>
          Already have an account? <Link href="/login">Sign in</Link>
        </Space>
      </Form.Item>
    </Form>
  );
};
