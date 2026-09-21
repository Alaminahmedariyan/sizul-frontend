import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "@/providers";

import "./globals.css";

export const metadata = {
  title: "Sizul",
  description: "Agency management platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
