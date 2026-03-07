'use client';

import { useEffect, useRef } from 'react';

// Inspired by agujero.html color palette: blues, indigo, violet, pink, amber
const HUES = [200, 220, 240, 260, 280, 300, 320, 340, 35];

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
      const bright = Math.random() > 0.68;
      return {
        x:     Math.random() * canvas!.width,
        y:     Math.random() * canvas!.height,
        r:     bright ? Math.random() * 1.6 + 0.8 : Math.random() * 0.8 + 0.2,
        vx:    (Math.random() - 0.5) * 0.12,
        vy:    (Math.random() - 0.5) * 0.12,
        hue:   HUES[Math.floor(Math.random() * HUES.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.4 + 0.5,
        maxA:  bright ? Math.random() * 0.65 + 0.25 : Math.random() * 0.35 + 0.08,
        bright,
      };
    }

    function tick() {
      t += 0.013;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.filter = 'blur(0.5px)';

      for (const s of stars) {
        const alpha = s.maxA * (0.3 + 0.7 * (Math.sin(t * s.speed + s.phase) * 0.5 + 0.5));

        // Enhanced radial glow halo for bright stars
        if (s.bright) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 8);
          g.addColorStop(0, `hsla(${s.hue},92%,85%,${alpha * 0.55})`);
          g.addColorStop(0.5, `hsla(${s.hue},88%,80%,${alpha * 0.25})`);
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 8, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Core dot with glow
        const coreSat = s.bright ? 95 : 85;
        const coreLum = s.bright ? 90 : 88;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},${coreSat}%,${coreLum}%,${alpha})`;
        ctx.fill();

        s.x = (s.x + s.vx + canvas!.width)  % canvas!.width;
        s.y = (s.y + s.vy + canvas!.height) % canvas!.height;
      }

      ctx.filter = 'none';
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
