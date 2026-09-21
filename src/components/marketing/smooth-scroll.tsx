"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Silky page scroll for the public site.
 *
 * lerp  = how quickly the page catches up with the wheel (0–1).
 *         Lower = softer, longer glide. 0.1 was the old value.
 *         0.06 very heavy · 0.075 silky (default here) · 0.1 snappy · 0.14 light
 *
 * Touch devices keep their native momentum scrolling (syncTouch is off),
 * which feels better on phones than a JS-driven scroll.
 *
 * Any nested scrollable area (dropdown, dialog, sidebar list) should get the
 * attribute data-lenis-prevent so the wheel scrolls it instead of the page.
 */
const LERP = 0.075;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: LERP,
      smoothWheel: true,
      syncTouch: false,
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}