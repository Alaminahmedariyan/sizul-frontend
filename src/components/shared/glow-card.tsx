"use client";

import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { cn } from "@/lib/utils";

type GlowCardProps = ComponentPropsWithoutRef<"div"> & {
  /** Classes for the inner surface (padding, layout, background). */
  contentClassName?: string;
};

// The outer element is a 1px "border" made of a spotlight gradient that
// follows the pointer. The inner surface covers everything except that edge,
// so the glow only shows on the border.
//
// Customize per usage with className:
//   [--glow-color:var(--your-token)]  glow color (default: --primary)
//   [--glow-radius:1.25rem]           corner radius (default: 0.75rem)
export function GlowCard({
  className,
  contentClassName,
  children,
  onPointerMove,
  ...props
}: GlowCardProps) {
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--glow-x",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--glow-y",
      `${event.clientY - rect.top}px`,
    );
    onPointerMove?.(event);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn(
        "group/glow relative rounded-[var(--glow-radius,0.75rem)] bg-border p-px [--glow-color:var(--primary)]",
        "transition-[box-shadow,transform] duration-300",
        "hover:shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--glow-color)_50%,transparent)]",
        "focus-within:shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--glow-color)_50%,transparent)]",
        "active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
          "group-hover/glow:opacity-100 group-focus-within/glow:opacity-100 group-active/glow:opacity-100",
          "[background:radial-gradient(160px_circle_at_var(--glow-x,50%)_var(--glow-y,50%),var(--glow-color),transparent_70%)]",
        )}
      />
      <div
        className={cn(
          "relative h-full rounded-[calc(var(--glow-radius,0.75rem)_-_1px)] bg-card",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}