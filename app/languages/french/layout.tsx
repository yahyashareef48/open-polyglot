import { FrenchThemeProvider } from './theme';

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FrenchThemeProvider>
      {children}
    </FrenchThemeProvider>
  );
}