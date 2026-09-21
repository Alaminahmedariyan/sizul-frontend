import { cn } from "@/lib/utils";

import { Reveal } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <Reveal
      className={cn(
        "mb-14 max-w-2xl md:mb-16",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="brand-badge mb-5">
          <span className="size-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold leading-[1.1] md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
