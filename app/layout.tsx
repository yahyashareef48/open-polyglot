import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/theme-context";
import { Navigation } from "./components/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Open Polyglot - Learn Languages for Free",
  description:
    "The free, open-source language learning platform. Learn German, French, Spanish and more without expensive courses. Structured A1-B2 curriculum with games and AI pronunciation help.",
  keywords: [
    "free language learning",
    "open source language app",
    "learn languages free",
    "German learning",
    "French learning",
    "Spanish learning",
    "language courses alternative",
  ],
  authors: [{ name: "Open Polyglot" }],
  openGraph: {
    title: "Open Polyglot - Learn Languages for Free",
    description: "The free, open-source language learning platform. Learn German, French, Spanish and more without expensive courses.",
    type: "website",
    locale: "en_US",
    url: "https://openpolyglot.org",
    siteName: "Open Polyglot",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Polyglot - Learn Languages for Free",
    description: "The free, open-source language learning platform. Learn German, French, Spanish and more without expensive courses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://openpolyglot.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Open Polyglot",
              description: "The free, open-source language learning platform. Learn German, French, Spanish and more without expensive courses.",
              url: "https://openpolyglot.org",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Structured A1-B2 curriculum",
                "Multiple languages support",
                "Interactive games and exercises",
                "AI pronunciation help",
                "Offline PWA functionality",
                "No ads or subscriptions",
              ],
              inLanguage: ["en", "de", "fr", "es"],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <Navigation />
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
