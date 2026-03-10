'use client';

import { useEffect, useRef } from 'react';

// Color palette matching the design system
const COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a78bfa', // purple
  '#f43f5e', // rose
  '#f472b6', // pink
  '#f59e0b', // amber
  '#fbbf24', // yellow
  '#10b981', // emerald
  '#34d399', // green
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  alphaSpeed: number;
  rotation: number;
  rotationSpeed: number;
  shape: 0 | 1 | 2; // 0=square, 1=circle, 2=diamond
}

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.1),
    size: Math.random() * 5 + 3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.15,
    alphaSpeed: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.03,
    shape: Math.floor(Math.random() * 3) as 0 | 1 | 2,
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = p.size * 1.5;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);

  const h = p.size / 2;

  if (p.shape === 1) {
    // Circle
    ctx.beginPath();
    ctx.arc(0, 0, h, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.shape === 2) {
    // Diamond
    ctx.beginPath();
    ctx.moveTo(0, -h * 1.4);
    ctx.lineTo(h, 0);
    ctx.lineTo(0, h * 1.4);
    ctx.lineTo(-h, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    // Rounded square
    const r = h * 0.35;
    const s = p.size;
    ctx.beginPath();
    ctx.moveTo(-h + r, -h);
    ctx.lineTo(h - r, -h);
    ctx.arcTo(h, -h, h, -h + r, r);
    ctx.lineTo(h, h - r);
    ctx.arcTo(h, h, h - r, h, r);
    ctx.lineTo(-h + r, h);
    ctx.arcTo(-h, h, -h, h - r, r);
    ctx.lineTo(-h, -h + r);
    ctx.arcTo(-h, -h, -h + r, -h, r);
    ctx.closePath();
    ctx.fill();
    void s; // suppress unused
  }

  ctx.restore();
}

export function FooterParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 55;
    let particles: Particle[] = [];
    let raf: number;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Re-create particles scaled to new size
      particles = Array.from({ length: COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      );
    }

    function tick() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha += p.alphaSpeed;

        // Reverse alpha fade
        if (p.alpha <= 0.1 || p.alpha >= 0.7) p.alphaSpeed *= -1;

        // Wrap horizontally
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Reset when particle drifts too high
        if (p.y < -20) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        drawParticle(ctx, p);
      }

      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
