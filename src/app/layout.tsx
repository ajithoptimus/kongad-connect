import type { Metadata } from "next";
import { Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const notoSansMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-malayalam",
  weight: ["400", "500", "600", "700"],
  subsets: ["malayalam", "latin"],
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
      <body className={`${notoSansMalayalam.variable} font-sans antialiased bg-[#FDFCF8] text-[#0A5C36]`}>
        {children}
      </body>
    </html>
  );
}
