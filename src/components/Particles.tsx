'use client';

import { useEffect, useRef } from 'react';

// Inspired by agujero.html color palette: blues, indigo, violet, pink, amber
const HUES = [220, 235, 250, 268, 285, 310, 325, 35];

interface Star {
  x: number; y: number;
  r: number; vx: number; vy: number;
  hue: number;
  phase: number;    // twinkle phase offset
  speed: number;    // twinkle speed
  maxA: number;     // max alpha
  bright: boolean;  // gets a radial glow
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let stars: Star[] = [];
    let t = 0;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function makeStar(): Star {
      const bright = Math.random() > 0.72;
      return {
        x:     Math.random() * canvas!.width,
        y:     Math.random() * canvas!.height,
        r:     bright ? Math.random() * 1.4 + 0.7 : Math.random() * 0.7 + 0.15,
        vx:    (Math.random() - 0.5) * 0.15,
        vy:    (Math.random() - 0.5) * 0.15,
        hue:   HUES[Math.floor(Math.random() * HUES.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.2 + 0.4,
        maxA:  bright ? Math.random() * 0.55 + 0.2 : Math.random() * 0.25 + 0.05,
        bright,
      };
    }

    function tick() {
      t += 0.013;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const s of stars) {
        const alpha = s.maxA * (0.25 + 0.75 * (Math.sin(t * s.speed + s.phase) * 0.5 + 0.5));

        // Radial glow halo for bright stars
        if (s.bright) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
          g.addColorStop(0, `hsla(${s.hue},90%,82%,${alpha * 0.45})`);
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},85%,88%,${alpha})`;
        ctx.fill();

        s.x = (s.x + s.vx + canvas!.width)  % canvas!.width;
        s.y = (s.y + s.vy + canvas!.height) % canvas!.height;
      }

      raf = requestAnimationFrame(tick);
    }

    function init() {
      resize();
      stars = Array.from({ length: 240 }, makeStar);
      tick();
    }

    init();

    const onResize = () => { resize(); stars = Array.from({ length: 240 }, makeStar); };
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
