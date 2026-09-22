"use client";

import { useEffect, useRef } from "react";

// The site's one non-user-triggered animation: a slowly rotating
// particle sphere behind the home hero. Replaces the earlier ambient
// glow. Palette-native (paper dots, moss + amber orbital rings), drawn
// generatively so there's no raster payload and no stock license.
// prefers-reduced-motion gets a single static frame, no loop.

const DOTS = 850;
const ROTATION_PER_FRAME = 0.0008; // ~130s per revolution at 60fps

type Vec3 = { x: number; y: number; z: number };

function fibonacciSphere(n: number): Vec3[] {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

function ringPoints(tilt: number, phase: number, n = 120): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    // great circle in xz, tilted around x by `tilt`, spun by `phase`
    const x0 = Math.cos(a);
    const z0 = Math.sin(a);
    const y = z0 * Math.sin(tilt);
    const z = z0 * Math.cos(tilt);
    const x = x0 * Math.cos(phase) + z * Math.sin(phase);
    const z2 = -x0 * Math.sin(phase) + z * Math.cos(phase);
    pts.push({ x, y, z: z2 });
  }
  return pts;
}

export default function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const dots = fibonacciSphere(DOTS);
    const R = size * 0.46;
    const cx = size / 2;
    const cy = size / 2;

    let angle = 0.4;
    let raf = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);

      // dotted sphere
      for (const p of dots) {
        const x = p.x * Math.cos(angle) + p.z * Math.sin(angle);
        const z = -p.x * Math.sin(angle) + p.z * Math.cos(angle);
        if (z < -0.15) continue; // cull deep back for sparseness
        const depth = (z + 1) / 2; // 0 back, 1 front
        const alpha = 0.05 + depth * 0.3;
        const radius = 0.6 + depth * 0.9;
        ctx.beginPath();
        ctx.arc(cx + x * R, cy + p.y * R, radius, 0, Math.PI * 2);
        // a sparse minority of dots carry the accent
        ctx.fillStyle =
          p.y > 0.2 && p.y < 0.35
            ? `rgba(109, 168, 140, ${alpha})`
            : `rgba(237, 234, 226, ${alpha * 0.8})`;
        ctx.fill();
      }

      // orbital rings: one moss, one amber, front halves only
      const rings: Array<[number, string]> = [
        [0.5, "109, 168, 140"],
        [-0.9, "217, 164, 85"],
      ];
      for (const [tilt, rgb] of rings) {
        const pts = ringPoints(tilt, angle * 0.7);
        ctx.beginPath();
        let started = false;
        for (const p of pts) {
          if (p.z < 0.05) {
            started = false;
            continue;
          }
          const sx = cx + p.x * R * 1.12;
          const sy = cy + p.y * R * 1.12;
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = `rgba(${rgb}, 0.28)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (reduced) {
      draw();
      return;
    }

    function loop() {
      angle += ROTATION_PER_FRAME;
      draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute pointer-events-none -right-52 -top-24 sm:-right-32 sm:-top-16 w-[560px] h-[560px] sm:w-[640px] sm:h-[640px] opacity-70"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
