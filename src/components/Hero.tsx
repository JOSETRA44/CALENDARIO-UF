'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Cake, Flag, CalendarDays, Sparkles, PartyPopper } from 'lucide-react';
import { CountdownUnit, CountdownSep } from './CountdownUnit';
import { HeroParticles } from './HeroParticles';
import { useCountdown } from '@/hooks/useCountdown';
import { formatDateLong } from '@/lib/dates';
import type { CalendarEvent } from '@/types';

interface Props {
  nextEvent: CalendarEvent | null;
  loading:   boolean;
}

/* ── Motion variants ─────────────────────────────────────────── */
const container: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
};
const chipVariant: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1,   transition: { type: 'spring', stiffness: 360, damping: 28, delay: 0.32 } },
};

/* ── Skeleton bar ────────────────────────────────────────────── */
function SkeletonBar({ w, h = 'h-4' }: { w: string; h?: string }) {
  return <div className={`${h} ${w} rounded-xl bg-white/[0.06] animate-pulse`} />;
}

export function Hero({ nextEvent, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const cd = useCountdown(nextEvent?.nextDate ?? null);

  useEffect(() => { setMounted(true); }, []);

  const isBirthday = nextEvent?.type === 'birthday';
  const isToday    = nextEvent?.isToday ?? false;

  /* ── CSS class maps (zero inline styles) ──────────────────── */
  const nameCls = !nextEvent || loading
    ? 'hero-name-empty'
    : isToday      ? 'hero-name-today'
    : isBirthday   ? 'hero-name-birthday'
    : 'hero-name-holiday';

  const ringCls = !nextEvent || loading
    ? 'hero-ring-indigo'
    : isToday      ? 'hero-ring-emerald'
    : isBirthday   ? 'hero-ring-rose'
    : 'hero-ring-amber';

  const glowCls = !nextEvent || loading
    ? 'hero-glow-empty'
    : isBirthday   ? 'hero-glow-birthday'
    : 'hero-glow-holiday';

  const badgeCls = isToday
    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/15 border-emerald-500/35 text-emerald-300'
    : isBirthday
    ? 'bg-gradient-to-r from-rose-500/15 to-pink-500/10 border-rose-500/40 text-rose-300'
    : 'bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border-amber-500/40 text-amber-300';

  const cdColor = isToday ? 'indigo' : isBirthday ? 'rose' : 'amber';

  const TypeIcon = isToday ? PartyPopper : isBirthday ? Cake : Flag;

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <section
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-24 text-center"
      aria-labelledby="hero-event-name"
    >
      {/* Dot grid texture */}
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-50" />

      {/* Floating particles canvas */}
      <HeroParticles />

      {/* Background layers — sin overflow-hidden para que blur no sea clipeado */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Glow blob: sin transition-all (los gradientes no interpolan en CSS) */}
        <div className={`absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] opacity-90 ${glowCls}`} />

        {/* Anillos concéntricos */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={ringCls} />
        </div>

        {/* Orbes flotantes — translate en vez de negativo para no salir del DOM box */}
        <div className={`absolute right-0 top-[10%] h-[420px] w-[420px] translate-x-1/3 animate-[float-slow_9s_ease-in-out_infinite] rounded-full blur-[80px] opacity-30 ${isBirthday ? 'nebula-rose' : isToday ? 'nebula-teal' : 'nebula-violet'}`} />
        <div className={`absolute left-0 top-[48%] h-[320px] w-[320px] -translate-x-1/3 animate-[float-slow_11s_ease-in-out_infinite] rounded-full blur-[70px] opacity-25 ${isBirthday ? 'nebula-violet' : isToday ? 'nebula-cyan' : 'nebula-indigo'}`} />
        <div className={`absolute left-[38%] bottom-[6%] h-[280px] w-[280px] -translate-x-1/2 animate-[float-slow_13s_ease-in-out_infinite] rounded-full blur-[60px] opacity-20 ${isBirthday ? 'nebula-rose' : isToday ? 'nebula-teal' : 'nebula-amber'}`} />

        {/* Rayos de luz diagonales */}
        <div className="absolute top-[28%] left-0 h-px w-full -rotate-[8deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="absolute top-[65%] left-0 h-px w-full rotate-[5deg] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

        {/* Viñetas laterales — estrechas para no tapar el glow central */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#070714]/50 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#070714]/50 to-transparent" />

        {/* Viñeta superior */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0a0a1a]/70 to-transparent" />
        {/* Fade inferior */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a0a1a] to-transparent" />

        {/* Overlay especial para hoy */}
        {isToday && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,rgba(16,185,129,0.14),transparent)]" />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="relative flex w-full max-w-4xl flex-col items-center gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >

        {/* ── Event type badge ─────────────────────────────── */}
        <motion.div variants={item}>
          {loading ? (
            <SkeletonBar w="w-44" h="h-7" />
          ) : (
            <span className={`inline-flex items-center gap-2 rounded-full border px-5 py-1.5 text-[11px] font-black uppercase tracking-widest backdrop-blur-sm ${badgeCls}`}>
              {nextEvent && <TypeIcon className="h-3 w-3" aria-hidden="true" />}
              <span aria-live="polite">
                {isToday      ? '¡Es Hoy!'
                : nextEvent
                ? (isBirthday ? 'Próximo Cumpleaños' : 'Próximo Día Festivo')
                : 'Sin eventos próximos'}
              </span>
              {isToday && <Sparkles className="h-3 w-3" aria-hidden="true" />}
            </span>
          )}
        </motion.div>

        {/* ── Event name ───────────────────────────────────── */}
        <motion.h1
          id="hero-event-name"
          variants={item}
          aria-live="polite"
          className={[
            'w-full font-black leading-none tracking-[-0.03em]',
            'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl',
            nameCls,
          ].join(' ')}
        >
          {loading ? (
            <span className="flex flex-col items-center gap-3">
              <SkeletonBar w="w-3/4" h="h-14 sm:h-20" />
              <SkeletonBar w="w-1/2" h="h-14 sm:h-20" />
            </span>
          ) : (
            nextEvent?.nombre ?? 'Agrega eventos en Supabase'
          )}
        </motion.h1>

        {/* ── Date + department — minimal ───────────────────── */}
        {mounted && (
          <motion.div variants={chipVariant}>
            {loading ? (
              <SkeletonBar w="w-44" h="h-4" />
            ) : nextEvent ? (
              <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" aria-hidden="true" />
                <CalendarDays className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                <span>{formatDateLong(nextEvent.dateStr)}</span>
                {nextEvent.departamento && (
                  <>
                    <span className="text-white/20" aria-hidden="true">·</span>
                    <span className="text-slate-500">{nextEvent.departamento}</span>
                  </>
                )}
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/20" aria-hidden="true" />
              </div>
            ) : null}
          </motion.div>
        )}

        {/* ── Divider ──────────────────────────────────────── */}
        <motion.div
          variants={item}
          className="h-px w-24 sm:w-36 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
          aria-hidden="true"
        />

        {/* ── Countdown ────────────────────────────────────── */}
        {mounted && (
          <motion.div
            variants={item}
            className="flex items-center gap-1.5 sm:gap-3 md:gap-5"
            aria-label="Cuenta regresiva"
            aria-live="polite"
            aria-atomic="true"
          >
            <CountdownUnit value={cd.days}    label="Días"   color={cdColor} />
            <CountdownSep />
            <CountdownUnit value={cd.hours}   label="Horas"  color={cdColor} />
            <CountdownSep />
            <CountdownUnit value={cd.minutes} label="Min"    color={cdColor} />
            <CountdownSep />
            <CountdownUnit value={cd.seconds} label="Seg"    color={cdColor} />
          </motion.div>
        )}

        {/* ── Scroll hint ──────────────────────────────────── */}
        {mounted && !loading && nextEvent && (
          <motion.div
            variants={item}
            className="mt-4 flex flex-col items-center gap-2 opacity-25"
            aria-hidden="true"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1"
            >
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-slate-400 to-transparent" />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">
                Scroll
              </span>
            </motion.div>
          </motion.div>
        )}

      </motion.div>
    </section>
  );
}
