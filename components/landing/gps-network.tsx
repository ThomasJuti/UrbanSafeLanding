"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  signalColor: string | null; // null = neutral graph node, else emits colored pings
}

interface Ping {
  x: number;
  y: number;
  age: number;
  color: string;
}

// Semantic risk colors, resolved to rgb triples so canvas doesn't need to parse oklch custom properties
const SIGNAL_COLORS = [
  "16 185 129", // --safe
  "251 191 36", // --caution
  "239 68 68", // --danger
];

/** Decorative background: a drifting GPS/mesh graph — nodes connect when close, and some nodes emit colored (safe/caution/danger) signal pings. */
export function GpsNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const parent = canvas.parentElement;
    const glyphRgb =
      (parent && getComputedStyle(parent).getPropertyValue("--glyph-rgb").trim()) ||
      "148 163 184";

    let points: Point[] = [];
    let pings: Ping[] = [];
    let width = 0;
    let height = 0;

    const LINK_DISTANCE = 190;
    const PING_LIFETIME = 100; // frames
    const PING_MAX_RADIUS = 46;
    const SIGNAL_NODE_RATIO = 0.18;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const count = Math.min(130, Math.max(50, Math.floor((width * height) / 8000)));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        signalColor:
          Math.random() < SIGNAL_NODE_RATIO
            ? SIGNAL_COLORS[Math.floor(Math.random() * SIGNAL_COLORS.length)]
            : null,
      }));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      seed();
    };

    resize();
    window.addEventListener("resize", resize);

    let pingTimer = 0;

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of points) {
        ctx.fillStyle = p.signalColor
          ? `rgb(${p.signalColor} / 0.8)`
          : `rgb(${glyphRgb} / 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.signalColor ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduceMotion) {
      drawStatic();
      return () => window.removeEventListener("resize", resize);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Drift points, wrap around edges
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      // Graph connections between nearby nodes
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.5;
            ctx.strokeStyle = `rgb(${glyphRgb} / ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes — neutral graph dots vs. colored signal nodes
      for (const p of points) {
        if (p.signalColor) {
          ctx.fillStyle = `rgb(${p.signalColor} / 0.9)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgb(${glyphRgb} / 0.6)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Signal nodes periodically emit colored pings (safe/caution/danger)
      const signalNodes = points.filter((p) => p.signalColor);
      pingTimer++;
      if (pingTimer > 25 && signalNodes.length > 0 && Math.random() < 0.5) {
        pingTimer = 0;
        const origin = signalNodes[Math.floor(Math.random() * signalNodes.length)];
        pings.push({ x: origin.x, y: origin.y, age: 0, color: origin.signalColor! });
      }

      // Draw + age pings (expanding, fading colored ring)
      pings = pings.filter((ping) => ping.age < PING_LIFETIME);
      for (const ping of pings) {
        const progress = ping.age / PING_LIFETIME;
        const radius = progress * PING_MAX_RADIUS;
        const alpha = (1 - progress) * 0.6;
        ctx.strokeStyle = `rgb(${ping.color} / ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ping.age++;
      }

      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
}
