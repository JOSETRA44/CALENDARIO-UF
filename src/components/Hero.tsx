'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Cake, Flag, CalendarDays, Sparkles, PartyPopper } from 'lucide-react';
import { CountdownUnit, CountdownSep } from './CountdownUnit';
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

  const chipIconCls = loading     ? 'chip-icon-loading'
                    : isToday     ? 'chip-icon-today'
                    : isBirthday  ? 'chip-icon-birthday'
                    : 'chip-icon-holiday';

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
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-35" />

      {/* Background layers */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main radial glow blob */}
        <div className={`absolute left-1/2 top-1/2 h-[800px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] opacity-60 transition-all duration-1000 ${glowCls}`} />

        {/* Decorative concentric rings — centered via flex */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={ringCls} />
        </div>

        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0a0a1a]/60 to-transparent" />
        {/* Bottom fade to next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a1a] to-transparent" />

        {/* Today special glow overlay */}
        {isToday && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_35%,rgba(16,185,129,0.09),transparent)]" />
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
            'w-full font-black leading-[0.98] tracking-tight',
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

        {/* ── Date + department glass chip ─────────────────── */}
        {mounted && (
          <motion.div variants={chipVariant}>
            {loading ? (
              <SkeletonBar w="w-56" h="h-14" />
            ) : nextEvent ? (
              <div className="glass-card inline-flex items-center gap-3 rounded-2xl px-4 py-3 sm:px-5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${chipIconCls}`}>
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Fecha</p>
                  <p className="text-sm font-bold text-slate-200">{formatDateLong(nextEvent.dateStr)}</p>
                </div>
                {nextEvent.departamento && (
                  <>
                    <div className="h-9 w-px bg-white/[0.07]" aria-hidden="true" />
                    <div className="text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Área</p>
                      <p className="text-sm font-bold text-slate-200">{nextEvent.departamento}</p>
                    </div>
                  </>
                )}
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
