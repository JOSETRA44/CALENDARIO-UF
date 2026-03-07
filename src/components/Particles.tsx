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
    let lastFrameTime = 0;
    const targetFPS = 30; // Reduced from 60 to 30
    const frameInterval = 1000 / targetFPS;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function makeStar(): Star {
      const bright = Math.random() > 0.75; // Reduced bright stars from 0.68 to 0.75
      return {
        x:     Math.random() * canvas!.width,
        y:     Math.random() * canvas!.height,
        r:     bright ? Math.random() * 1.4 + 0.6 : Math.random() * 0.6 + 0.15,
        vx:    (Math.random() - 0.5) * 0.08, // Reduced movement speed
        vy:    (Math.random() - 0.5) * 0.08,
        hue:   HUES[Math.floor(Math.random() * HUES.length)],
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 1.2 + 0.4, // Reduced twinkle speed
        maxA:  bright ? Math.random() * 0.55 + 0.15 : Math.random() * 0.25 + 0.05, // Reduced alpha
        bright,
      };
    }

    function tick(currentTime: number) {
      if (currentTime - lastFrameTime < frameInterval) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastFrameTime = currentTime;

      t += 0.016;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const s of stars) {
        const alpha = s.maxA * (0.4 + 0.6 * Math.sin(t * s.speed + s.phase));

        // Minimal glow only for bright stars
        if (s.bright && alpha > 0.15) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          g.addColorStop(0, `hsla(${s.hue},90%,85%,${alpha * 0.25})`);
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Core dot
        ctx.fillStyle = `hsla(${s.hue},85%,88%,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        s.x = (s.x + s.vx + canvas!.width)  % canvas!.width;
        s.y = (s.y + s.vy + canvas!.height) % canvas!.height;
      }

      raf = requestAnimationFrame(tick);
    }

    function init() {
      resize();
      // Reduced to 60 stars (from 120)
      stars = Array.from({ length: 60 }, makeStar);
      raf = requestAnimationFrame(tick);
    }

    init();

    const onResize = () => { resize(); stars = Array.from({ length: 60 }, makeStar); };
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
