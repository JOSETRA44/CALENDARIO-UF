'use client';

import { motion } from 'framer-motion';
import { decompose, formatDateLong, labelCountdown, msUntil } from '@/lib/dates';
import type { CalendarEvent } from '@/types';

interface Props {
  event: CalendarEvent;
  index: number;
  variant?: 'strip' | 'grid';
}

const STRIP_W = 'w-[190px] flex-shrink-0';

export function EventCard({ event, index, variant = 'grid' }: Props) {
  const { type, nombre, dateStr, nextDate, isToday, emoji, descripcion, departamento, subtype } = event;
  const isBirthday = type === 'birthday';

  const cd   = decompose(msUntil(nextDate));
  const text = labelCountdown(cd, isToday);

  // Accent colors based on type
  const borderTop  = isBirthday ? 'border-t-[#ec4899]'  : 'border-t-[#f59e0b]';
  const badgeBg    = isBirthday ? 'bg-pink-500/10 text-pink-400'    : 'bg-amber-500/10 text-amber-400';
  const footerColor = isToday
    ? 'text-emerald-400'
    : cd.days < 3 ? 'text-amber-400' : 'text-slate-500';

  const glowColor  = isBirthday
    ? 'rgba(236,72,153,0.18)'
    : 'rgba(245,158,11,0.18)';

  const isStrip = variant === 'strip';

  return (
    <motion.article
      role="listitem"
      layout
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 8,  scale: 0.96 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 26 }}
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
      className={`
        relative flex flex-col gap-2 overflow-hidden rounded-2xl
        border border-white/[0.08] border-t-2 ${borderTop}
        bg-white/[0.04] backdrop-blur-xl p-4
        cursor-default
        ${isToday ? 'ring-1 ring-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.12)]' : ''}
        ${isStrip ? STRIP_W : ''}
        scroll-snap-align-start
      `}
    >
      {/* Glow orb top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-xl"
        style={{ background: glowColor }}
      />

      {/* Type badge */}
      <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${badgeBg}`}>
        {isBirthday ? 'Cumpleaños' : (subtype ?? 'Festivo')}
      </span>

      {/* Emoji */}
      <span className="text-3xl leading-none" aria-hidden="true">{emoji}</span>

      {/* Name */}
      <h3
        className={`font-bold leading-snug tracking-tight text-slate-100 ${isStrip ? 'truncate text-sm pr-16' : 'text-base pr-14'}`}
        title={nombre}
      >
        {nombre}
      </h3>

      {/* Date + department */}
      <p className="text-xs text-slate-400">
        {formatDateLong(dateStr)}
        {departamento && !isStrip && (
          <span className="text-slate-600"> · {departamento}</span>
        )}
      </p>

      {/* Description (grid only) */}
      {descripcion && !isStrip && (
        <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed">{descripcion}</p>
      )}

      {/* Footer: countdown */}
      <footer className={`mt-auto flex items-center gap-1.5 border-t border-white/[0.06] pt-2 text-xs font-bold ${footerColor}`}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <span>{text}</span>
        {isToday && (
          <span className="ml-auto animate-[pulse-glow_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
            HOY
          </span>
        )}
      </footer>
    </motion.article>
  );
}
