'use client';

import { useTheme } from 'next-themes';
import { ReactNode, useEffect } from 'react';

interface FrenchThemeProviderProps {
  children: ReactNode;
}

function FrenchThemeEnhancer({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty('--french-primary', theme === 'dark' ? '#3b82f6' : '#2563eb');
    document.documentElement.style.setProperty('--french-secondary', theme === 'dark' ? '#f8fafc' : '#ffffff');
    document.documentElement.style.setProperty('--french-accent', theme === 'dark' ? '#dc2626' : '#b91c1c');
    document.documentElement.style.setProperty('--french-gradient-from', theme === 'dark' ? '#1e40af' : '#3b82f6');
    document.documentElement.style.setProperty('--french-gradient-via', theme === 'dark' ? '#f8fafc' : '#ffffff');
    document.documentElement.style.setProperty('--french-gradient-to', theme === 'dark' ? '#dc2626' : '#ef4444');
  }, [theme]);

  return <>{children}</>;
}

export function FrenchThemeProvider({ children }: FrenchThemeProviderProps) {
  return (
    <FrenchThemeEnhancer>
      {children}
    </FrenchThemeEnhancer>
  );
}