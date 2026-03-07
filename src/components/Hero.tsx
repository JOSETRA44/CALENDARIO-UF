'use client';

import { motion, type Variants } from 'framer-motion';
import { Cake, Flag, CalendarDays } from 'lucide-react';
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
  show:   { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } },
};

export function Hero({ nextEvent, loading }: Props) {
  const cd = useCountdown(nextEvent?.nextDate ?? null);
  const isBirthday = nextEvent?.type === 'birthday';

  const nameGradient = isBirthday
    ? 'from-rose-400 via-pink-300 to-fuchsia-400'
    : 'from-amber-400 via-yellow-300 to-orange-400';

  const glowColor   = isBirthday ? 'rgba(244,63,94,0.18)'   : 'rgba(245,158,11,0.18)';
  const badgeCls    = isBirthday
    ? 'border-rose-500/25 bg-rose-500/10 text-rose-400'
    : 'border-amber-500/25 bg-amber-500/10 text-amber-400';
  const cdColor     = isBirthday ? 'rose' : 'amber';
  const TypeIcon    = isBirthday ? Cake : Flag;

  return (
    <section
      className="relative z-10 flex min-h-[65vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center"
      aria-labelledby="hero-event-name"
    >
      {/* Dot grid texture */}
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0" />

      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/3 h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] opacity-60"
          style={{ background: `radial-gradient(ellipse, rgba(99,102,241,0.20), ${glowColor}, transparent 68%)` }}
        />
      </div>

      <motion.div
        className="relative flex flex-col items-center gap-5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Event-type badge */}
        <motion.div variants={item}>
          <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest ${badgeCls}`}>
            {!loading && nextEvent && <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            <span aria-live="polite">
              {loading ? 'Cargando…' : nextEvent
                ? (isBirthday ? 'Proximo Cumpleanos' : 'Proximo Dia Festivo')
                : 'Sin eventos proximos'}
            </span>
          </span>
        </motion.div>

        {/* Event name */}
        <motion.h1
          id="hero-event-name"
          variants={item}
          className={[
            'max-w-3xl bg-gradient-to-r bg-clip-text text-transparent',
            'font-black leading-[1.04] tracking-tight',
            'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
            loading       ? 'from-slate-800 to-slate-700'
            : nextEvent   ? nameGradient
            : 'from-slate-600 to-slate-500',
          ].join(' ')}
          aria-live="polite"
        >
          {loading ? '···' : (nextEvent?.nombre ?? 'Agrega eventos en Supabase')}
        </motion.h1>

        {/* Date + department */}
        {nextEvent && !loading && (
          <motion.p variants={item} className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {formatDateLong(nextEvent.dateStr)}
            {nextEvent.departamento && (
              <span className="text-slate-600">· {nextEvent.departamento}</span>
            )}
          </motion.p>
        )}

        {/* Countdown */}
        <motion.div
          variants={item}
          className="mt-3 flex items-center gap-3 sm:gap-5"
          aria-label="Cuenta regresiva"
          aria-live="polite"
          aria-atomic="true"
        >
          <CountdownUnit value={cd.days}    label="Días"  color={cdColor} />
          <CountdownSep />
          <CountdownUnit value={cd.hours}   label="Horas" color={cdColor} />
          <CountdownSep />
          <CountdownUnit value={cd.minutes} label="Min"   color={cdColor} />
          <CountdownSep />
          <CountdownUnit value={cd.seconds} label="Seg"   color={cdColor} />
        </motion.div>
      </motion.div>
    </section>
  );
}
