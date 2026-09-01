import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Manjari } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const manjari = Manjari({
  subsets: ["malayalam"],
  weight: ["100", "400", "700"],
  variable: "--font-malayalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kongad Connect - എന്റെ കോങ്ങാട്",
  description: "A Hyper-Local Progressive Web App for Kongad Assembly Constituency. Powered by AI.",
  manifest: "/manifest.json",
  themeColor: "#1a7a3a",
  openGraph: {
    title: "Kongad Connect - എന്റെ കോങ്ങാട്",
    description: "Kerala's first AI-powered constituency portal for Kongad.",
    url: "https://entekongad.in",
    siteName: "Kongad Connect",
    images: [
      {
        url: "/dam.png",
        width: 1200,
        height: 630,
        alt: "Kongad Connect Banner",
      },
    ],
    locale: "ml_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kongad Connect - എന്റെ കോങ്ങാട്",
    description: "Kerala's first AI-powered constituency portal.",
    images: ["/dam.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml" suppressHydrationWarning>
      <body className={`${inter.variable} ${manjari.variable} font-sans antialiased text-slate-800 dark:text-slate-100 bg-[#F4F7F5] dark:bg-[#0a1510]`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
