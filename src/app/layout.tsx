import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 폰트
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import clsx from "clsx";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

// 폰트 설정 (구글 폰트 Inter 사용)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JW Dev Log",
  description: "백엔드 개발자 주정원의 기술 블로그 및 포트폴리오",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased" suppressHydrationWarning>
      {/* suppressHydrationWarning: 테마 적용 시 깜빡임 방지용 필수 속성 */}

      <body className={clsx(inter.className, "bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 min-h-screen flex flex-col")}>

        {/* ★ Provider로 전체 감싸기 */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </ThemeProvider>

      </body>
    </html>
  );
}