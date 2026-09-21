import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>
      {children}
    </div>
  );
}

/** One place that controls vertical rhythm and background tone for every home section. */
export function Section({
  children,
  id,
  tone = "default",
  className,
  containerClassName,
}: {
  children: ReactNode;
  id?: string;
  tone?: "default" | "muted";
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-24 md:py-32",
        tone === "muted" && "border-y border-border bg-muted/40",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
