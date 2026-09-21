"use client";

import { Palette as PaletteIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Tuning knobs — change these to taste. */
const LINE_COUNT = 220; // fibres on desktop (mobile draws every second one)
const INTRO_SECONDS = 1.9; // how long one fibre takes to grow out
const MOTION_SPEED = 0.7; // speed of ALL movement: 1 = fast, 0.7 = calm (default), 0.5 = very slow
const STRETCH_X = 1.12; // dome is a little wider than it is tall, like Stripe's

/** Look: thin, crisp fibres that stay easy to tell apart. */
const LINE_WIDTH_MIN = 0.45; // css px (never thinner than one device pixel)
const LINE_WIDTH_MAX = 0.9;
const FADE_FROM_ORIGIN = 0.28; // fibres fade in over this share of their length, so the centre is not a solid blob

/**
 * Hover: every fibre is its own little spring with its own stiffness, weight
 * and reaction time, so they never move in unison. Fibres near the cursor lean
 * towards it, stretch by different amounts and get brushed sideways when the
 * cursor sweeps across them, then swing back and settle at their own pace.
 */
const HOVER_RADIUS = 0.13; // reach of the cursor, as a share of the dome radius
const HOVER_ATTRACT = 0.45; // how strongly nearby fibres lean towards the cursor
const HOVER_MAX_BEND = 0.14; // biggest lean in radians (about 8 degrees)
const HOVER_STRETCH = 0.14; // nearby fibres grow by up to this share
const HOVER_SWEEP = 3.4; // how much moving the cursor brushes the fibres
const HOVER_SPRING = 70; // average spring stiffness (higher = snappier)
const HOVER_DAMPING = 10; // average damping (lower = more wobble)
const HOVER_LEAN = 0.04; // the whole fan leans slightly towards the cursor
const HOVER_GLOW_RADIUS = 170; // size of the soft light that follows the cursor (if lighting is on)
/**
 * false = hovering only MOVES the fibres; every colour stays exactly as it is.
 * true  = hovering also lights the fibres up and shows a soft light under the cursor.
 */
const HOVER_LIGHTING = false;

const LUT_SIZE = 48;
const STORAGE_KEY = "footer-burst-palette";
const TAU = Math.PI * 2;

type Rgb = [number, number, number];

type Palette = {
  name: string;
  /** Four colours, blended left to right across the fan. Theme variables are allowed. */
  colors: string[];
  /** Colour of the soft glow behind the dome. */
  glow: string;
};

const OCEAN: Palette = {
  name: "Ocean",
  colors: ["#38bdf8", "#0a84ff", "#3a4bff", "#1b2bd1"],
  glow: "#0a84ff",
};

const PALETTES: Palette[] = [
  OCEAN,
  {
    name: "Sunset",
    colors: ["#ff4d6d", "#ff8a3d", "#ffc857", "#ff5fa2"],
    glow: "#ff7a45",
  },
  {
    name: "Aurora",
    colors: ["#00e0b8", "#22d3ee", "#6366f1", "#c084fc"],
    glow: "#22d3ee",
  },
  {
    name: "Violet",
    colors: ["#8b5cf6", "#d946ef", "#f472b6", "#6366f1"],
    glow: "#a855f7",
  },
  {
    name: "Brand",
    colors: [
      "var(--primary)",
      "var(--chart-3)",
      "var(--signal)",
      "var(--chart-1)",
    ],
    glow: "var(--primary)",
  },
];

type Line = {
  angle: number;
  length: number;
  alpha: number;
  width: number;
  dot: number;
  tone: number;
  delay: number;
  phaseLength: number;
  phaseAngle: number;
  pulse: { speed: number; offset: number } | null;

  /** This fibre's own character, so no two move alike. */
  swaySpeed: number;
  swayAmp: number;
  breathSpeed: number;
  breathAmp: number;
  stiffness: number;
  damping: number;
  gain: number; // how strongly it reacts to the cursor
  jitter: number; // a private lean, so neighbours do not all bend the same way
  reach: number; // how far from the cursor it still reacts (multiplier)
  reaction: number; // how quickly it notices the cursor (per second)
  stretchGain: number;

  /** Live hover physics (spring state), all start at rest. */
  offset: number; // extra angle in radians
  velocity: number;
  stretch: number; // extra length as a share of the base length
  stretchVelocity: number;
  heat: number; // 0-1, how strongly the cursor is affecting this fibre
};

type Engine = { setPalette: (index: number) => void };

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const easeOut = (x: number) => 1 - (1 - x) ** 3;
const between = (min: number, max: number) => min + Math.random() * (max - min);

function createLines(): Line[] {
  return Array.from({ length: LINE_COUNT }, (_, index) => {
    const angle =
      Math.PI * (0.01 + 0.98 * ((index + Math.random()) / LINE_COUNT));
    const shape = 0.72 + 0.28 * Math.sin(angle);
    const tone = clamp(0.62 * (angle / Math.PI) + 0.38 * Math.random(), 0, 1);

    return {
      angle,
      length: shape * (0.4 + 0.6 * Math.random() ** 0.55),
      alpha: between(0.45, 0.95),
      width: between(LINE_WIDTH_MIN, LINE_WIDTH_MAX),
      dot: between(0.7, 1.6),
      tone: Math.round(tone * (LUT_SIZE - 1)),
      delay: (angle / Math.PI) * 0.7 + Math.random() * 0.35,
      phaseLength: Math.random() * TAU,
      phaseAngle: Math.random() * TAU,
      pulse:
        Math.random() < 0.14
          ? { speed: 0.12 + Math.random() * 0.2, offset: Math.random() }
          : null,

      swaySpeed: between(0.3, 1.2),
      swayAmp: between(0.008, 0.03),
      breathSpeed: between(0.4, 1.4),
      breathAmp: between(0.015, 0.05),
      stiffness: HOVER_SPRING * between(0.55, 1.5),
      damping: HOVER_DAMPING * between(0.65, 1.35),
      gain: between(0.45, 1.5),
      jitter: between(-0.05, 0.05),
      reach: between(0.7, 1.35),
      reaction: between(6, 20),
      stretchGain: between(0.3, 1.5),

      offset: 0,
      velocity: 0,
      stretch: 0,
      stretchVelocity: 0,
      heat: 0,
    };
  });
}

/** Resolves `var(--token)` to the real colour string; other values pass through. */
function resolveCss(value: string) {
  if (!value.startsWith("var(")) return value;

  const name = value.slice(4, -1).trim();
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return resolved || "#3b82f6";
}

const FALLBACK_RGB: Rgb = [59, 130, 246];

function buildLut(stops: Rgb[]): string[] {
  const last = stops.length - 1;

  return Array.from({ length: LUT_SIZE }, (_, index) => {
    const position = (index / (LUT_SIZE - 1)) * last;
    const low = Math.min(Math.floor(position), last - 1);
    const mix = position - low;
    const a = stops[low] ?? FALLBACK_RGB;
    const b = stops[low + 1] ?? a;

    return `rgb(${Math.round(a[0] + (b[0] - a[0]) * mix)},${Math.round(
      a[1] + (b[1] - a[1]) * mix,
    )},${Math.round(a[2] + (b[2] - a[2]) * mix)})`;
  });
}

/** "rgb(1,2,3)" -> "rgba(1,2,3,alpha)" */
const withAlpha = (rgb: string, alpha: number) =>
  rgb.replace("rgb(", "rgba(").replace(")", `,${alpha})`);

/**
 * Top stage of the footer: a fan of thin coloured fibres with dots on the tips,
 * growing from the bottom centre. A button in the corner cycles the colour
 * palette (the choice is remembered in this browser).
 */
export function FooterStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const [paletteIndex, setPaletteIndex] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = context;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Tiny canvas used to turn any CSS colour (hex, oklch, ...) into RGB numbers.
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    const probeCtx = probe.getContext("2d", { willReadFrequently: true });

    const toRgb = (css: string): Rgb => {
      if (!probeCtx) return FALLBACK_RGB;

      probeCtx.clearRect(0, 0, 1, 1);
      probeCtx.fillStyle = "#000000";
      probeCtx.fillStyle = css;
      probeCtx.fillRect(0, 0, 1, 1);
      const data = probeCtx.getImageData(0, 0, 1, 1).data;

      return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0];
    };

    const stopsFor = (index: number): Rgb[] =>
      (PALETTES[index] ?? OCEAN).colors.map((color) =>
        toRgb(resolveCss(color)),
      );

    const cloneStops = (stops: Rgb[]): Rgb[] =>
      stops.map((stop) => [stop[0], stop[1], stop[2]]);

    const allLines = createLines();
    let activeLines = allLines;

    let width = 0;
    let height = 0;
    let radius = 0;
    let dpr = 1;

    let dark = false;
    let paletteNow = 0;
    let currentStops: Rgb[] = [];
    let targetStops: Rgb[] = [];

    let visible = false;
    let armed = false; // true once enough of the stage has been on screen
    let raf = 0;
    let last = 0;
    let elapsed = 0;

    // Cursor position inside the stage (smoothed), its speed, and how "present" it is (0-1).
    let pointerX = 0;
    let pointerY = 0;
    let pointerVX = 0;
    let pointerVY = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerStrength = 0;
    let targetStrength = 0;

    const timeNow = () => (reduceMotion ? 10 : elapsed);

    // Each fibre sways and breathes on its own rhythm (frozen when motion is reduced).
    const swayOf = (line: Line, t: number) =>
      Math.sin(t * MOTION_SPEED * line.swaySpeed + line.phaseAngle) * line.swayAmp;
    const breathOf = (line: Line, t: number) =>
      Math.sin(t * MOTION_SPEED * line.breathSpeed + line.phaseLength) *
      line.breathAmp;

    /**
     * Spring physics for the hover. Returns true while any fibre is still moving,
     * so the loop knows when it may go back to sleep.
     */
    const stepPhysics = (dt: number) => {
      const t = timeNow();
      const originX = width / 2;
      const originY = height;

      // Cursor in the dome's own space: x to the right, y UP, horizontal stretch undone.
      const px = (pointerX - originX) / STRETCH_X;
      const py = originY - pointerY;
      const pvx = pointerVX / STRETCH_X;
      const pvy = -pointerVY;
      const pointerAngle = clamp(Math.atan2(py, px), 0, Math.PI);
      const baseSigma = clamp(radius * HOVER_RADIUS, 36, 120);

      let moving = false;

      for (const line of activeLines) {
        const grow = easeOut(clamp((t - line.delay) / INTRO_SECONDS, 0, 1));
        const angle = line.angle + swayOf(line, t) + line.offset;
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const lineLength =
          radius * line.length * grow * (1 + line.stretch + breathOf(line, t));
        const sigma = baseSigma * line.reach;

        let rawHeat = 0;
        if (pointerStrength > 0.002 && grow > 0.3) {
          // Closest point of this fibre to the cursor, and how far away it is.
          const s = clamp(px * ux + py * uy, 0, lineLength);
          const dist = Math.hypot(px - ux * s, py - uy * s);

          rawHeat = pointerStrength * Math.exp(-(dist * dist) / (2 * sigma * sigma));
        }

        // Each fibre notices the cursor at its own speed.
        line.heat += (rawHeat - line.heat) * clamp(dt * line.reaction, 0, 1);
        const heat = line.heat;

        let angleTarget = 0;
        let stretchTarget = 0;
        let push = 0;

        if (heat > 0.001) {
          // Lean towards the cursor (each fibre by its own amount, plus a private tilt)...
          angleTarget =
            (clamp(
              (pointerAngle - angle) * HOVER_ATTRACT * line.gain,
              -HOVER_MAX_BEND,
              HOVER_MAX_BEND,
            ) +
              line.jitter) *
            heat;
          stretchTarget = HOVER_STRETCH * line.stretchGain * heat;

          // ...and get brushed by the sideways part of the cursor's movement.
          const along = Math.max(px * ux + py * uy, 80);
          const omega = (pvx * -uy + pvy * ux) / along;
          push = omega * heat * HOVER_SWEEP * line.gain;
        }

        const angleAcc =
          line.stiffness * (angleTarget - line.offset) -
          line.damping * line.velocity +
          push;
        line.velocity += angleAcc * dt;
        line.offset = clamp(line.offset + line.velocity * dt, -0.28, 0.28);

        const stretchAcc =
          line.stiffness * (stretchTarget - line.stretch) -
          line.damping * line.stretchVelocity;
        line.stretchVelocity += stretchAcc * dt;
        line.stretch = clamp(line.stretch + line.stretchVelocity * dt, -0.2, 0.4);

        if (
          Math.abs(line.offset) > 0.0006 ||
          Math.abs(line.velocity) > 0.004 ||
          Math.abs(line.stretch) > 0.0006 ||
          Math.abs(line.stretchVelocity) > 0.004 ||
          line.heat > 0.01
        ) {
          moving = true;
        }
      }

      return moving;
    };

    const draw = () => {
      if (currentStops.length === 0) return;

      const t = timeNow();
      const gain = dark ? 0.8 : 1;
      const lut = buildLut(currentStops);
      const minWidth = 1 / dpr; // never thinner than one device pixel

      const originX = width / 2;
      const originY = height;

      const dx = (pointerX - originX) / STRETCH_X;
      const dy = originY - pointerY;
      const pointerAngle = clamp(Math.atan2(dy, dx), 0, Math.PI);
      const lean = (pointerAngle - Math.PI / 2) * HOVER_LEAN * pointerStrength;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      ctx.globalAlpha = 1;

      // Optional soft coloured light that follows the cursor.
      if (HOVER_LIGHTING && pointerStrength > 0.02) {
        const spot = lut[Math.floor(LUT_SIZE / 2)] ?? "rgb(59,130,246)";
        const spotAlpha = (dark ? 0.36 : 0.26) * pointerStrength;
        const gradient = ctx.createRadialGradient(
          pointerX,
          pointerY,
          0,
          pointerX,
          pointerY,
          HOVER_GLOW_RADIUS,
        );

        gradient.addColorStop(0, withAlpha(spot, spotAlpha));
        gradient.addColorStop(1, withAlpha(spot, 0));
        ctx.fillStyle = gradient;
        ctx.fillRect(
          pointerX - HOVER_GLOW_RADIUS,
          pointerY - HOVER_GLOW_RADIUS,
          HOVER_GLOW_RADIUS * 2,
          HOVER_GLOW_RADIUS * 2,
        );
      }

      for (const line of activeLines) {
        const grow = easeOut(clamp((t - line.delay) / INTRO_SECONDS, 0, 1));
        if (grow <= 0) continue;

        const angle = line.angle + swayOf(line, t) + lean + line.offset;
        const length =
          radius * line.length * grow * (1 + breathOf(line, t) + line.stretch);

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = originX + cos * length * STRETCH_X;
        const y = originY - sin * length;

        const lit = HOVER_LIGHTING ? line.heat : 0;
        const color = lut[line.tone] ?? "rgb(59,130,246)";
        const alpha = Math.min(1, line.alpha * gain * (1 + lit * 1.1));
        const glowing = HOVER_LIGHTING && line.heat > 0.3;

        // The fibre fades in from the centre, so each one stays readable.
        const stroke = ctx.createLinearGradient(originX, originY, x, y);
        stroke.addColorStop(0, withAlpha(color, 0));
        stroke.addColorStop(FADE_FROM_ORIGIN, withAlpha(color, alpha));
        stroke.addColorStop(1, withAlpha(color, alpha));

        ctx.strokeStyle = stroke;
        ctx.lineWidth = Math.max(line.width + lit * 0.9, minWidth);

        if (glowing) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 9 * line.heat;
        }

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, line.dot + line.heat * 1.0, 0, TAU);
        ctx.fill();

        if (glowing) ctx.shadowBlur = 0;

        if (line.pulse && !reduceMotion) {
          const progress =
            (t * MOTION_SPEED * line.pulse.speed + line.pulse.offset) % 1;
          ctx.globalAlpha =
            Math.min(1, alpha + 0.3) * Math.sin(progress * Math.PI);
          ctx.beginPath();
          ctx.arc(
            originX + cos * length * STRETCH_X * progress,
            originY - sin * length * progress,
            1.5,
            0,
            TAU,
          );
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }
    };

    // A drawing error must never freeze the animation, so it is caught and logged.
    const safeDraw = () => {
      try {
        draw();
      } catch (error) {
        console.error("FooterStage: draw failed", error);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      radius = Math.min(height * 0.8, ((width / 2) * 0.98) / STRETCH_X);
      activeLines =
        width < 640 ? allLines.filter((_, index) => index % 2 === 0) : allLines;

      if (reduceMotion || !raf) safeDraw();
    };

    const tick = (now: number) => {
      raf = 0;

      if (!visible || document.hidden) {
        last = 0;
        return;
      }

      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      elapsed += dt;

      // Cursor follows quickly but never jumps; its strength fades in and out.
      const previousX = pointerX;
      const previousY = pointerY;
      const follow = 1 - Math.exp(-dt * 10);
      pointerX += (targetX - pointerX) * follow;
      pointerY += (targetY - pointerY) * follow;
      pointerStrength +=
        (targetStrength - pointerStrength) * (1 - Math.exp(-dt * 7));

      // Cursor speed (smoothed), used to brush the fibres sideways.
      if (dt > 0) {
        const blend = 1 - Math.exp(-dt * 14);
        pointerVX += ((pointerX - previousX) / dt - pointerVX) * blend;
        pointerVY += ((pointerY - previousY) / dt - pointerVY) * blend;
      }

      // Springs run on a slowed clock, which makes every fibre move more calmly.
      const moving = dt > 0 ? stepPhysics(dt * MOTION_SPEED) : false;

      // Smooth colour change between palettes.
      const colorEase = 1 - Math.exp(-dt * 4);
      currentStops = currentStops.map((stop, index) => {
        const target = targetStops[index] ?? stop;

        return [
          stop[0] + (target[0] - stop[0]) * colorEase,
          stop[1] + (target[1] - stop[1]) * colorEase,
          stop[2] + (target[2] - stop[2]) * colorEase,
        ];
      });

      // Reduced motion: no automatic animation, but the cursor still moves the
      // fibres (that motion is caused by the user). Sleep again once everything rests.
      if (
        reduceMotion &&
        targetStrength === 0 &&
        pointerStrength < 0.01 &&
        !moving
      ) {
        pointerStrength = 0;
        safeDraw();
        return;
      }

      safeDraw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && (armed || reduceMotion)) raf = requestAnimationFrame(tick);
    };

    const setPalette = (index: number) => {
      paletteNow = index;
      targetStops = stopsFor(index);

      if (currentStops.length === 0 || reduceMotion || !raf) {
        currentStops = cloneStops(targetStops);
        safeDraw();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (inside) {
        targetX = event.clientX - rect.left;
        targetY = event.clientY - rect.top;

        // Entering the stage: start right under the cursor instead of flying in.
        if (pointerStrength < 0.05) {
          pointerX = targetX;
          pointerY = targetY;
          pointerVX = 0;
          pointerVY = 0;
        }
      }

      targetStrength = inside ? 1 : 0;
      if (inside) start();
    };

    const onVisibilityChange = () => {
      last = 0;
      start();
    };

    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (entry.intersectionRatio >= 0.35) armed = true;
        }
        if (visible) start();
      },
      { threshold: [0, 0.35] },
    );

    const resizeObserver = new ResizeObserver(resize);

    // Light / dark switch: re-read theme colours and blending.
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      targetStops = stopsFor(paletteNow);

      if (reduceMotion || !raf) {
        currentStops = cloneStops(targetStops);
        safeDraw();
      }
    });

    dark = document.documentElement.classList.contains("dark");
    engineRef.current = { setPalette };
    setPalette(0);
    resize();

    intersection.observe(canvas);
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      engineRef.current = null;
      cancelAnimationFrame(raf);
      intersection.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Restore the palette this visitor picked last time.
  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(STORAGE_KEY));

      if (Number.isInteger(saved) && saved > 0 && saved < PALETTES.length) {
        setPaletteIndex(saved);
      }
    } catch {
      // Storage can be unavailable (private mode); the default palette is fine.
    }
  }, []);

  // Tell the canvas engine whenever the palette changes.
  useEffect(() => {
    engineRef.current?.setPalette(paletteIndex);
  }, [paletteIndex]);

  const palette = PALETTES[paletteIndex] ?? OCEAN;
  const nextPalette = PALETTES[(paletteIndex + 1) % PALETTES.length] ?? OCEAN;

  const cycle = () => {
    const next = (paletteIndex + 1) % PALETTES.length;

    setPaletteIndex(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore storage errors.
    }
  };

  return (
    <div className="relative isolate border-b border-border">
      {/* Soft glow behind the dome; crossfades when the palette changes */}
      {PALETTES.map((item, index) => (
        <div
          key={item.name}
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
          style={{
            opacity: index === paletteIndex ? 1 : 0,
            background: `radial-gradient(ellipse 60% 78% at 50% 100%, color-mix(in oklch, ${item.glow} 26%, transparent), transparent 72%)`,
          }}
        />
      ))}

      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      />

      <div className="relative mx-auto h-[clamp(320px,40vw,540px)] max-w-6xl border-x border-border/60">
        <button
          type="button"
          onClick={cycle}
          aria-label={`Change animation colors. Current: ${palette.name}. Next: ${nextPalette.name}.`}
          className="absolute right-4 top-4 z-10 inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/70 pl-2.5 pr-3.5 text-xs font-medium backdrop-blur-md transition-colors hover:bg-background"
        >
          <span
            aria-hidden
            className="size-4 rounded-full ring-1 ring-border"
            style={{
              background: `linear-gradient(135deg, ${palette.colors.join(", ")})`,
            }}
          />
          {palette.name}
          <PaletteIcon className="size-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}