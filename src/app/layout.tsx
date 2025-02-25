import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const serif = Noto_Serif_KR({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
});

const sans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "PropTech AI",
  description: "AI-powered real estate investment recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body className={sans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
