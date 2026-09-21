"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "featured" | "flat";
}

export function SpotlightCard({
  children,
  className,
  variant = "default",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();

      element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      element.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    element.addEventListener("pointermove", handlePointerMove);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-variant={variant}
      className={cn("spotlight card-premium rounded-3xl", className)}
    >
      {children}
    </div>
  );
}