"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Mode = "idle" | "link" | "label" | "native";

/** Elements that switch the cursor into "link" (or "label" when data-cursor is set). */
const INTERACTIVE = "[data-cursor], a, button, [role='button'], summary";
/** Elements where the real system cursor must stay visible (typing). */
const NATIVE = "input, textarea, select, [contenteditable='true']";

/**
 * Home-page-only cursor.
 * - A precise dot that follows the pointer instantly.
 * - A ring that trails with a spring and reshapes on links / labelled elements.
 * - A large, slow ambient glow tinted with the brand color.
 *
 * Render it ONLY inside the home page. It cleans itself up on unmount, so the
 * normal cursor returns on every other page. Disabled on touch devices and
 * when the user prefers reduced motion.
 */
export function HomeCursor() {
  const reduceMotion = useReducedMotion();

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const [label, setLabel] = useState("View");

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });

  const glowX = useSpring(x, { stiffness: 70, damping: 22, mass: 1 });
  const glowY = useSpring(y, { stiffness: 70, damping: 22, mass: 1 });

  useEffect(() => {
    if (reduceMotion) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    setEnabled(true);

    const root = document.documentElement;
    root.classList.add("home-cursor");

    const resolve = (target: Element | null) => {
      if (!target) {
        setMode("idle");
        return;
      }

      if (target.closest(NATIVE)) {
        setMode("native");
        return;
      }

      const element = target.closest<HTMLElement>(INTERACTIVE);

      if (!element) {
        setMode("idle");
        return;
      }

      const text = element.dataset.cursor;

      if (text) {
        setLabel(text);
        setMode("label");
        return;
      }

      setMode("link");
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      resolve(event.target as Element | null);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    // Re-check what is under the pointer while scrolling (cards move under a still mouse).
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        resolve(document.elementFromPoint(x.get(), y.get()));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("mouseleave", onLeave);
      root.classList.remove("home-cursor");
    };
  }, [reduceMotion, x, y]);

  if (!enabled || reduceMotion) return null;

  const hidden = !visible || mode === "native";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-100 overflow-hidden"
    >
      {/* Ambient brand glow — slow, large, low opacity */}
      <motion.div
        className="absolute top-0 left-0 will-change-transform"
        style={{ x: glowX, y: glowY }}
      >
        <div
          className={cn(
            "size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500",
            visible ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "radial-gradient(closest-side, var(--spotlight-glow), transparent)",
          }}
        />
      </motion.div>

      {/* Trailing ring — grows on links, becomes a labelled disc on data-cursor elements */}
      <motion.div
        className="absolute top-0 left-0 will-change-transform"
        style={{ x: ringX, y: ringY }}
      >
        <div
          className={cn(
            "grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border",
            "transition-[width,height,background-color,border-color,opacity,scale] duration-300 ease-(--ease-out)",
            hidden && "opacity-0",
            mode === "label"
              ? "size-24 border-transparent bg-primary text-primary-foreground shadow-(--shadow-primary)"
              : mode === "link"
                ? "size-14 border-primary/60 bg-primary/10"
                : "size-9 border-foreground/25",
            pressed && "scale-90",
          )}
        >
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-semibold tracking-tight transition-opacity duration-200",
              mode === "label" ? "opacity-100 delay-100" : "opacity-0",
            )}
          >
            {label}
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </motion.div>

      {/* Precise dot */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <div
          className={cn(
            "size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_2px_var(--background)] transition-opacity duration-200",
            hidden || mode === "label" ? "opacity-0" : "opacity-100",
          )}
        />
      </motion.div>
    </div>
  );
}