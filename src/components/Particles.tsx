'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  r: number; vx: number; vy: number;
  a: number; hue: number;
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let particles: Particle[] = [];

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function make(): Particle {
      return {
        x:   Math.random() * canvas!.width,
        y:   Math.random() * canvas!.height,
        r:   Math.random() * 1.5 + 0.4,
        vx:  (Math.random() - 0.5) * 0.3,
        vy:  (Math.random() - 0.5) * 0.3,
        a:   Math.random() * 0.35 + 0.06,
        hue: Math.random() > 0.5 ? 246 : 322,   // indigo or pink
      };
    }

    function tick() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},75%,72%,${p.a})`;
        ctx.fill();
        p.x = (p.x + p.vx + canvas!.width)  % canvas!.width;
        p.y = (p.y + p.vy + canvas!.height) % canvas!.height;
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    particles = Array.from({ length: 90 }, make);
    tick();

    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
