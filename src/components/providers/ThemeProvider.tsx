"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Next.js에서 next-themes를 쓰기 위한 껍데기 컴포넌트
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}