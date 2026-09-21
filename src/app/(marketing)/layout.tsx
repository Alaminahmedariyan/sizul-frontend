import type { ReactNode } from "react";

import { Footer } from "@/components/marketing/footer";
import { MotionProvider, ScrollProgress } from "@/components/marketing/motion";
import { Navbar } from "@/components/marketing/navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollProgress />
        <Navbar />
        {/* The navbar is fixed (top-4 + about 56px tall), so main clears it with pt-20 */}
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </div>
    </MotionProvider>
  );
}
