import { SpanishThemeProvider } from './theme';

export default function SpanishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SpanishThemeProvider>
      {children}
    </SpanishThemeProvider>
  );
}