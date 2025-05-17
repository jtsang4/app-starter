'use client';

import type { FC, ReactNode } from 'react';
import { Card, Layout, Typography } from 'antd';
import Link from 'next/link';

const { Content } = Layout;
const { Title, Text } = Typography;

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * Layout component for authentication pages
 * Provides a consistent look and feel for login, register, etc.
 */
export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <Layout className="min-h-screen bg-[#f0f2f5]">
      <Content className="py-12">
        <div className="max-w-[400px] mx-auto">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <Title level={2} className="m-0">
                App Stater
              </Title>
            </Link>
            <Text type="secondary" className="text-base">
              A modern full-stack application scaffold template with the latest
              technologies for building web applications.
            </Text>
          </div>

          <Card
            title={
              <div className="text-center">
                <Title level={3} className="m-0">
                  {title}
                </Title>
                {subtitle && (
                  <Text type="secondary" className="mt-2">
                    {subtitle}
                  </Text>
                )}
              </div>
            }
            className="shadow-sm"
          >
            {children}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};
