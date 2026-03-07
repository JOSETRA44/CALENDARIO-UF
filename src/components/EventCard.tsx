'use client';

import { motion } from 'framer-motion';
import { Cake, Flag, Building2, MapPin, Clock } from 'lucide-react';
import { decompose, formatDateLong, labelCountdown, msUntil } from '@/lib/dates';
import type { CalendarEvent } from '@/types';

function EventIcon({ type, subtype }: { type: string; subtype?: string }) {
  const cls = 'h-4 w-4';
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

  const accent    = isBirthday ? '#f43f5e' : '#f59e0b';
  const iconCls   = isBirthday ? 'bg-rose-500/10 text-rose-400'  : 'bg-amber-500/10 text-amber-400';
  const badgeCls  = isBirthday ? 'text-rose-400'                 : 'text-amber-400';
  const footerCls = isToday    ? 'text-emerald-400'
                  : cd.days < 3 ? 'text-amber-400' : 'text-slate-500';

  return (
    <motion.article
      role="listitem"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 300, damping: 28 }}
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 500, damping: 32 } }}
      className={[
        'glass-card group relative flex flex-col overflow-hidden rounded-2xl p-5',
        isToday ? 'ring-1 ring-emerald-500/25' : '',
        isStrip ? 'w-[200px] shrink-0' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Left accent gradient bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-[2px]"
        style={{ background: `linear-gradient(to bottom, ${accent}cc, ${accent}22)` }}
      />

      {/* Corner glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-[0.07] blur-2xl"
        style={{ background: accent }}
      />

      {/* Icon + badge row */}
      <div className="relative mb-3 flex items-center justify-between">
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconCls}`}>
          <EventIcon type={type} subtype={subtype} />
        </div>
        {isToday ? (
          <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
            HOY
          </span>
        ) : (
          <span className={`text-[10px] font-bold uppercase tracking-widest ${badgeCls}`}>
            {isBirthday ? 'Cumple' : (subtype ?? 'Festivo')}
          </span>
        )}
      </div>

      {/* Name */}
      <h3
        title={nombre}
        className={`relative font-bold leading-snug text-slate-100 ${isStrip ? 'truncate text-sm' : 'text-sm'}`}
      >
        {nombre}
      </h3>

      {/* Date + department */}
      <p className="relative mt-1 text-xs text-slate-500">
        {formatDateLong(dateStr)}
        {departamento && !isStrip && (
          <span className="text-slate-600"> · {departamento}</span>
        )}
      </p>

      {/* Description — grid only */}
      {descripcion && !isStrip && (
        <p className="relative mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {descripcion}
        </p>
      )}

      {/* Countdown footer */}
      <footer className={`relative mt-auto flex items-center gap-1.5 border-t border-white/[0.05] pt-3 text-xs font-semibold ${footerCls}`}>
        <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>{text}</span>
      </footer>
    </motion.article>
  );
}
