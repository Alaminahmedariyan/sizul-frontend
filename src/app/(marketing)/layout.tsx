import type { ReactNode } from "react";

import { Footer } from "@/components/marketing/footer";
import { MotionProvider, ScrollProgress } from "@/components/marketing/motion";
import { Navbar } from "@/components/marketing/navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="flex min-h-screen flex-col">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </div>
    </MotionProvider>
  );
}