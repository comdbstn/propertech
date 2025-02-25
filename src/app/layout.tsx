import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

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
      <head>
        <script
          type="text/javascript"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}`}
          async
          defer
        />
      </head>
      <body className={sans.className}>
        <Script
          id="kakao-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.kakaoMapLoaded = false;
              window.initKakaoMap = function() {
                if (window.kakao && window.kakao.maps) {
                  window.kakao.maps.load(() => {
                    console.log('카카오맵 API 로드 완료');
                    window.kakaoMapLoaded = true;
                  });
                }
              };
              if (window.kakao && window.kakao.maps) {
                window.initKakaoMap();
              } else {
                document.addEventListener('kakao:loaded', window.initKakaoMap);
              }
            `
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
