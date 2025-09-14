'use client';

import { ThemeProvider as BaseThemeProvider, useTheme } from '@/app/contexts/theme-context';
import { ReactNode, useEffect } from 'react';

interface GermanThemeProviderProps {
  children: ReactNode;
}

function GermanThemeEnhancer({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--german-primary', theme === 'dark' ? '#dc2626' : '#b91c1c');
    document.documentElement.style.setProperty('--german-secondary', theme === 'dark' ? '#f59e0b' : '#d97706');
    document.documentElement.style.setProperty('--german-accent', theme === 'dark' ? '#1f2937' : '#f9fafb');
    document.documentElement.style.setProperty('--german-gradient-from', theme === 'dark' ? '#1f2937' : '#000000');
    document.documentElement.style.setProperty('--german-gradient-via', theme === 'dark' ? '#dc2626' : '#ef4444');
    document.documentElement.style.setProperty('--german-gradient-to', theme === 'dark' ? '#f59e0b' : '#fbbf24');
  }, [theme]);

  return <>{children}</>;
}

export function GermanThemeProvider({ children }: GermanThemeProviderProps) {
  return (
    <BaseThemeProvider>
      <GermanThemeEnhancer>
        {children}
      </GermanThemeEnhancer>
    </BaseThemeProvider>
  );
}