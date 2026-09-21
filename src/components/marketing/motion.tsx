"use client";

import {
  animate,
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const VIEWPORT = { once: true, margin: "-80px" } as const;

/** Wrap the marketing layout once. Honors the user's reduced-motion setting everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Thin brand-colored bar showing page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-primary via-primary to-signal"
    />
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 24,
  immediate = false,
}: RevealProps) {
  const target = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      {...(immediate
        ? { animate: target }
        : { whileInView: target, viewport: VIEWPORT })}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Stagger({
  children,
  className,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/** Horizontal line that draws itself from left to right when scrolled into view. */
export function GrowLine({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ originX: 0 }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
    />
  );
}

type CountUpProps = {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  className?: string;
  suffixClassName?: string;
};

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1.8,
  className,
  suffixClassName,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
}
