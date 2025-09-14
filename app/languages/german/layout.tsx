import { GermanThemeProvider } from './theme';

export default function GermanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GermanThemeProvider>
      {children}
    </GermanThemeProvider>
  );
}