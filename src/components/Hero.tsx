'use client';

import { motion, type Variants } from 'framer-motion';
import { CountdownUnit, CountdownSep } from './CountdownUnit';
import { useCountdown } from '@/hooks/useCountdown';
import { formatDateLong } from '@/lib/dates';
import type { CalendarEvent } from '@/types';

interface Props {
  nextEvent: CalendarEvent | null;
  loading:   boolean;
}

const containerVariants: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

export function Hero({ nextEvent, loading }: Props) {
  const cd = useCountdown(nextEvent?.nextDate ?? null);
  const isBirthday = nextEvent?.type === 'birthday';

  const gradientName = isBirthday
    ? 'from-pink-400 via-rose-300 to-fuchsia-400'
    : 'from-amber-400 via-yellow-300 to-orange-400';

  const accentGlow = isBirthday
    ? 'rgba(236,72,153,0.2)'
    : 'rgba(245,158,11,0.2)';

  return (
    <section
      className="relative z-10 flex min-h-[62vh] flex-col items-center justify-center px-4 py-24 text-center"
      aria-labelledby="hero-event-name"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-[120px] opacity-30"
          style={{ background: `radial-gradient(ellipse, rgba(99,102,241,0.35), ${accentGlow}, transparent 70%)` }}
        />
      </div>

      <motion.div
        className="relative flex flex-col items-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Label */}
        <motion.p
          variants={itemVariants}
          className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400"
          aria-live="polite"
        >
          {loading
            ? 'Cargando…'
            : nextEvent
            ? (isBirthday ? 'Proximo Cumpleanos' : 'Proximo Dia Festivo')
            : 'Sin eventos próximos'}
        </motion.p>

        {/* Event name */}
        <motion.h1
          id="hero-event-name"
          variants={itemVariants}
          className={`
            max-w-2xl bg-gradient-to-r bg-clip-text text-transparent
            font-black leading-[1.05] tracking-tight
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl
            ${loading ? 'text-slate-700' : nextEvent ? gradientName : 'from-slate-600 to-slate-500'}
          `}
          aria-live="polite"
        >
          {loading ? 'Cargando evento…' : (nextEvent?.nombre ?? 'Agrega eventos en Supabase')}
        </motion.h1>

        {/* Subtitle: date + department */}
        {nextEvent && !loading && (
          <motion.p variants={itemVariants} className="text-sm text-slate-500 font-medium">
            {formatDateLong(nextEvent.dateStr)}
            {nextEvent.departamento && (
              <span className="text-slate-600"> · {nextEvent.departamento}</span>
            )}
          </motion.p>
        )}

        {/* Countdown */}
        <motion.div
          variants={itemVariants}
          className="mt-2 flex items-center gap-2 sm:gap-4"
          aria-label="Cuenta regresiva"
          aria-live="polite"
          aria-atomic="true"
        >
          <CountdownUnit value={cd.days}    label="Días"  />
          <CountdownSep />
          <CountdownUnit value={cd.hours}   label="Horas" />
          <CountdownSep />
          <CountdownUnit value={cd.minutes} label="Min"   />
          <CountdownSep />
          <CountdownUnit value={cd.seconds} label="Seg"   />
        </motion.div>
      </motion.div>
    </section>
  );
}
