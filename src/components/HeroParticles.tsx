'use client';

import { useEffect, useRef } from 'react';

// Paleta visible contra fondo oscuro
const COLORS = [
  [139, 92,  246],  // violet
  [99,  102, 241],  // indigo
  [167, 139, 250],  // purple-light
  [255, 255, 255],  // white
  [196, 181, 253],  // lavender
  [244, 63,  94 ],  // rose accent
];

type Shape = 0 | 1 | 2; // círculo, diamante, cruz

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  r: number; g: number; b: number;
  alpha: number; dAlpha: number;
  rot: number; dRot: number;
  shape: Shape;
}

function make(w: number, h: number): Particle {
  const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    x:      Math.random() * w,
    y:      Math.random() * h,       // posición inicial aleatoria en toda la pantalla
    vx:     (Math.random() - 0.5) * 0.4,
    vy:     Math.random() * 0.6 + 0.2, // cae hacia abajo
    size:   Math.random() * 4 + 2.5,   // 2.5–6.5px — visible
    r, g, b,
    alpha:  Math.random() * 0.35 + 0.25,   // 0.25–0.60
    dAlpha: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    rot:    Math.random() * Math.PI * 2,
    dRot:   (Math.random() - 0.5) * 0.035,
    shape:  Math.floor(Math.random() * 3) as Shape,
  };
}

function draw(ctx: CanvasRenderingContext2D, p: Particle) {
  const a = Math.min(0.62, Math.max(0, p.alpha));
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle   = `rgb(${p.r},${p.g},${p.b})`;
  ctx.strokeStyle = `rgb(${p.r},${p.g},${p.b})`;
  ctx.lineWidth   = 1.4;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);

  const s = p.size;

  if (p.shape === 0) {
    // Círculo relleno
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.shape === 1) {
    // Diamante (◆)
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.65, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.65, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    // Cruz (+) girada — sparkle
    ctx.beginPath();
    ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
    ctx.moveTo(0, -s); ctx.lineTo(0, s);
    ctx.stroke();
  }

  ctx.restore();
}

export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT    = 42;
    const FRAME_MS = 1000 / 30; // 30fps cap
    let particles: Particle[] = [];
    let raf: number;
    let last = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = Array.from({ length: COUNT }, () => make(canvas.width, canvas.height));
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.dRot;
        p.alpha += p.dAlpha;

        if (p.alpha <= 0.12 || p.alpha >= 0.62) p.dAlpha *= -1;

        // Wrap horizontal
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Reset al salir por abajo — reaparece arriba
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        draw(ctx, p);
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
