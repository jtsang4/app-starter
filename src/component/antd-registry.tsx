// This component is used to register Ant Design styles correctly in the Next.js App Router.
'use client';

// Import React 19 compatibility patch
import '@/lib/react19-patch';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import { App, ConfigProvider, theme, type ThemeConfig } from 'antd';
import enUS from 'antd/locale/en_US';

// Theme configuration
const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#12a182',
    borderRadius: 4,
  },
  algorithm: theme.compactAlgorithm,
};

export const AntdRegistry = ({ children }: { children: ReactNode }) => {
  // Create a new cache instance to collect styles during server-side rendering.
  const cache = useMemo(() => createCache(), []);

  // Use the Next.js useServerInsertedHTML hook to insert styles during server-side rendering.
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache) }}
    />
  ));

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider locale={enUS} theme={antdTheme}>
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
};
