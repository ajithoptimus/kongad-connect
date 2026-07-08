import type { Metadata } from "next";
import { Manjari } from "next/font/google";
import "./globals.css";

const manjari = Manjari({
  subsets: ["malayalam", "latin"],
  weight: ["100", "400", "700"],
  variable: "--font-manjari",
});

export const metadata: Metadata = {
  title: "Kongad Connect - എന്റെ കോങ്ങാട്",
  description: "A Hyper-Local Progressive Web App for Kongad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ml">
      <body className={`${manjari.variable} font-sans bg-[#F4F7F5] text-slate-800 antialiased`}>
        {children}
      </body>
    </html>
  );
}
