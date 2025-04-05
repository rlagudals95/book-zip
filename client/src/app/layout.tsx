import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/app/providers";
import { SERVICE_NAME } from "@/shared/const";

export const metadata: Metadata = {
  title: `${SERVICE_NAME} - 매일매일 책 한 권의 요약본을 받아보세요`,
  description: "관심사에 맞는 독서를 매일 구독해서 요약본으로 받아볼 수 있는 서비스입니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`font-pretendard antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
