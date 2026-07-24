import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-malayalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kongad Connect - എന്റെ കോങ്ങാട്",
  description: "A Hyper-Local Progressive Web App for Kongad Assembly Constituency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansMalayalam.variable} font-sans antialiased text-slate-800 dark:text-slate-100 bg-[#F4F7F5] dark:bg-[#0a1510]`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
