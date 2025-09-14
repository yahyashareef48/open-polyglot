'use client';

import { useTheme } from 'next-themes';
import { ReactNode, useEffect } from 'react';

interface SpanishThemeProviderProps {
  children: ReactNode;
}

function SpanishThemeEnhancer({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--spanish-primary', theme === 'dark' ? '#dc2626' : '#b91c1c');
    document.documentElement.style.setProperty('--spanish-secondary', theme === 'dark' ? '#f59e0b' : '#d97706');
    document.documentElement.style.setProperty('--spanish-accent', theme === 'dark' ? '#1f2937' : '#fef3c7');
    document.documentElement.style.setProperty('--spanish-gradient-from', theme === 'dark' ? '#dc2626' : '#ef4444');
    document.documentElement.style.setProperty('--spanish-gradient-via', theme === 'dark' ? '#f59e0b' : '#fbbf24');
    document.documentElement.style.setProperty('--spanish-gradient-to', theme === 'dark' ? '#1f2937' : '#fed7aa');
  }, [theme]);

  return <>{children}</>;
}

export function SpanishThemeProvider({ children }: SpanishThemeProviderProps) {
  return (
    <SpanishThemeEnhancer>
      {children}
    </SpanishThemeEnhancer>
  );
}