'use client';

import { motion } from 'framer-motion';
import { Cake, Flag, Building2, MapPin, Clock } from 'lucide-react';
import { decompose, formatDateLong, labelCountdown, msUntil } from '@/lib/dates';
import type { CalendarEvent } from '@/types';

function EventIcon({ type, subtype }: { type: string; subtype?: string }) {
  const cls = 'h-[18px] w-[18px]';
  if (type === 'birthday')    return <Cake      className={cls} />;
  if (subtype === 'empresa')  return <Building2 className={cls} />;
  if (subtype === 'regional') return <MapPin    className={cls} />;
  return <Flag className={cls} />;
}

interface Props {
  event:    CalendarEvent;
  index:    number;
  variant?: 'strip' | 'grid';
}

export function EventCard({ event, index, variant = 'grid' }: Props) {
  const { type, nombre, dateStr, nextDate, isToday, descripcion, departamento, subtype } = event;
  const isBirthday = type === 'birthday';
  const isStrip    = variant === 'strip';

  const cd   = decompose(msUntil(nextDate));
  const text = labelCountdown(cd, isToday);

  const iconCls   = isBirthday ? 'bg-rose-500/10  text-rose-400'  : 'bg-amber-500/10 text-amber-400';
  const badgeCls  = isBirthday ? 'bg-rose-500/10  text-rose-400'  : 'bg-amber-500/10 text-amber-400';
  const accentClr = isBirthday ? '#f43f5e'                        : '#f59e0b';
  const footerCls = isToday
    ? 'text-emerald-400'
    : cd.days < 3 ? 'text-amber-400' : 'text-slate-500';

  return (
    <motion.article
      role="listitem"
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.035, type: 'spring', stiffness: 300, damping: 28 }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 30 } }}
      className={[
        'relative flex flex-col rounded-2xl overflow-hidden',
        'border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-4',
        isToday ? 'ring-1 ring-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.07)]' : '',
        isStrip ? 'w-[200px] flex-shrink-0' : '',
      ].filter(Boolean).join(' ')}
      style={{ borderLeft: `2px solid ${accentClr}` }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.08] blur-2xl"
        style={{ background: accentClr }}
      />

      {/* Icon + badge */}
      <div className="relative flex items-start justify-between mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconCls}`}>
          <EventIcon type={type} subtype={subtype} />
        </div>
        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${badgeCls}`}>
          {isBirthday ? 'Cumpleaños' : (subtype ?? 'Festivo')}
        </span>
      </div>

      {/* Name */}
      <h3
        title={nombre}
        className={`relative font-semibold leading-snug tracking-tight text-slate-100 ${isStrip ? 'truncate text-sm' : 'text-[0.95rem]'}`}
      >
        {nombre}
      </h3>

      {/* Date + department */}
      <p className="relative mt-1 text-xs text-slate-400">
        {formatDateLong(dateStr)}
        {departamento && !isStrip && (
          <span className="text-slate-600"> &middot; {departamento}</span>
        )}
      </p>

      {/* Description — grid only */}
      {descripcion && !isStrip && (
        <p className="relative mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {descripcion}
        </p>
      )}

      {/* Countdown footer */}
      <footer
        className={`relative mt-auto pt-3 flex items-center gap-1.5 border-t border-white/[0.06] text-xs font-semibold ${footerCls}`}
      >
        <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
        <span>{text}</span>
        {isToday && (
          <span className="ml-auto rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
            Hoy
          </span>
        )}
      </footer>
    </motion.article>
  );
}
