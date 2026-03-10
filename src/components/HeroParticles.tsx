'use client';

import { useEffect, useRef } from 'react';

const PALETTE = [
  'rgba(99,102,241,',   // indigo
  'rgba(139,92,246,',   // violet
  'rgba(167,139,250,',  // purple-light
  'rgba(248,250,252,',  // white
  'rgba(148,163,184,',  // slate
];

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
  dAlpha: number;
}

function makeDot(w: number, h: number): Dot {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -(Math.random() * 0.28 + 0.04),
    r: Math.random() * 2 + 0.6,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    alpha: Math.random() * 0.25 + 0.05,
    dAlpha: (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
  };
}

export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 28;
    const FRAME_MS = 1000 / 30;
    let dots: Dot[] = [];
    let raf: number;
    let last = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      dots = Array.from({ length: COUNT }, () => makeDot(canvas.width, canvas.height));
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        d.alpha += d.dAlpha;
        if (d.alpha <= 0.02 || d.alpha >= 0.42) d.dAlpha *= -1;

        if (d.x < -6) d.x = canvas.width + 6;
        if (d.x > canvas.width + 6) d.x = -6;
        if (d.y < -6) { d.y = canvas.height + 6; d.x = Math.random() * canvas.width; }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `${d.color}${Math.min(0.45, Math.max(0, d.alpha))})`;
        ctx.fill();
      }
    }

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
