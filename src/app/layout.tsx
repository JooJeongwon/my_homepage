import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 폰트
import "./globals.css";
// Force Rebuild
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import clsx from "clsx";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { SmoothFocusScroll } from "@/components/common/SmoothFocusScroll";

// 폰트 설정 (구글 폰트 Inter 사용)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jwjoo.com"),
  title: {
    default: "jwjoo Dev Log",
    template: "%s | jwjoo Dev Log",
  },
  description: "DEV : Creativity & Inspiration",
  keywords: [
    "jwjoo",
    "개발 블로그",
    "Software Engineer",
    "Clean Architecture",
    "TypeScript",
    "Next.js",
    "Frontend",
    "Backend",
    "Portfolio",
  ],
  authors: [{ name: "jwjoo", url: "https://jwjoo.com" }],
  creator: "jwjoo",
  publisher: "jwjoo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: {
      default: "jwjoo Dev Log",
      template: "%s | jwjoo Dev Log",
    },
    description: "DEV : Creativity & Inspiration",
    url: "https://jwjoo.com",
    siteName: "jwjoo Dev Log",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "jwjoo Dev Log",
      template: "%s | jwjoo Dev Log",
    },
    description: "DEV : Creativity & Inspiration",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased" suppressHydrationWarning style={{ scrollbarGutter: 'stable' }}>
      {/* suppressHydrationWarning: 테마 적용 시 깜빡임 방지용 필수 속성 */}

      <body suppressHydrationWarning={true} className={clsx(inter.className, "min-h-screen flex flex-col bg-neutral-50 dark:bg-[#121212] text-neutral-900 dark:text-neutral-100 overflow-x-hidden")}>

        {/* ★ Provider로 전체 감싸기 */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothFocusScroll />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-neutral-900 focus:border focus:border-neutral-200 dark:focus:bg-neutral-900 dark:focus:text-neutral-100 dark:focus:border-neutral-800 focus:text-sm focus:font-medium focus:rounded-md focus:shadow-lg"
          >
            본문 내용으로 바로가기
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} aria-label="본문 콘텐츠" className="flex-1 w-full outline-none">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>

      </body>
    </html>
  );
}