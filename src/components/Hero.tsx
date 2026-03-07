'use client';

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Cake, Flag, CalendarDays, Sparkles } from 'lucide-react';
import { CountdownUnit, CountdownSep } from './CountdownUnit';
import { useCountdown } from '@/hooks/useCountdown';
import { formatDateLong } from '@/lib/dates';
import type { CalendarEvent } from '@/types';

interface Props {
  nextEvent: CalendarEvent | null;
  loading:   boolean;
}

const container: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04, delayChildren: 0.05 } }, // Reduced from 0.08, 0.1
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 400,  // Increased from 300 for snappier feel
      damping: 40,     // Increased from 32 for less bounce
      mass: 0.4        // Decreased from 0.5 for faster response
    } 
  },
};

export function Hero({ nextEvent, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  const cd = useCountdown(nextEvent?.nextDate ?? null);

  useEffect(() => {
    setMounted(true);
  }, []);
  const isBirthday = nextEvent?.type === 'birthday';

  const nameGradient = isBirthday
    ? 'from-rose-200 via-pink-200 to-fuchsia-200'
    : 'from-amber-200 via-yellow-200 to-orange-200';

  const glowCls = loading || !nextEvent
    ? 'hero-glow-empty'
    : isBirthday ? 'hero-glow-birthday' : 'hero-glow-holiday';

  const badgeBg    = isBirthday
    ? 'bg-gradient-to-r from-rose-500/15 to-pink-500/10 border border-rose-500/40 text-rose-300'
    : 'bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/40 text-amber-300';
  const cdColor    = isBirthday ? 'rose' : 'amber';
  const TypeIcon   = isBirthday ? Cake : Flag;
  const isToday    = nextEvent?.isToday ?? false;

  return (
    <section
      className="relative z-10 flex min-h-[68vh] flex-col items-center justify-center overflow-hidden px-4 py-28 text-center"
      aria-labelledby="hero-event-name"
    >
      {/* Dot grid */}
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-60" />

      {/* Multi-layer ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-[40%] h-[640px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] ${glowCls}`}
        />
        {isToday && (
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.04] via-transparent to-transparent" />
        )}
      </div>

      <motion.div
        className="relative flex flex-col items-center gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Event-type badge */}
        <motion.div variants={item} className="opacity-0 animate-fade-in-up">
          {isToday ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 px-5 py-1.5 text-[11px] font-black uppercase tracking-widest text-emerald-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              ¡Es Hoy!
            </span>
          ) : (
            <span className={`inline-flex items-center gap-2 rounded-full border px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest ${badgeBg}`}>
              {!loading && nextEvent && <TypeIcon className="h-3 w-3" aria-hidden="true" />}
              <span aria-live="polite">
                {loading
                  ? 'Cargando…'
                  : nextEvent
                  ? (isBirthday ? 'Próximo Cumpleaños' : 'Próximo Día Festivo')
                  : 'Sin eventos próximos'}
              </span>
            </span>
          )}
        </motion.div>

        {/* Event name */}
        <motion.h1
          id="hero-event-name"
          variants={item}
          aria-live="polite"
          className={[
            'max-w-4xl bg-gradient-to-r bg-clip-text text-transparent',
            'font-black tracking-tight leading-[1.02]',
            'text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]',
            loading     ? 'from-slate-800 to-slate-700'
            : nextEvent ? nameGradient
            : 'from-slate-600 to-slate-500',
          ].join(' ')}
        >
          {loading ? '···' : (nextEvent?.nombre ?? 'Agrega eventos en Supabase')}
        </motion.h1>

        {/* Date + department */}
        {nextEvent && !loading && (
          <motion.p variants={item} className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-600" aria-hidden="true" />
            <span>{formatDateLong(nextEvent.dateStr)}</span>
            {nextEvent.departamento && (
              <>
                <span className="text-slate-700" aria-hidden="true">·</span>
                <span className="text-slate-600">{nextEvent.departamento}</span>
              </>
            )}
          </motion.p>
        )}

        {/* Divider */}
        <motion.div variants={item} className="h-px w-32 bg-gradient-to-r from-transparent via-slate-700 to-transparent" aria-hidden="true" />

        {/* Countdown */}
        {mounted && (
          <motion.div
            variants={item}
            className="flex items-center gap-2 sm:gap-4"
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

        {/* Subtle scroll hint */}
        {mounted && !loading && nextEvent && (
          <motion.div
            variants={item}
            className="mt-2 flex flex-col items-center gap-1.5 opacity-30"
            aria-hidden="true"
          >
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-500 to-transparent" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">Scroll</span>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
