'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { EventCard } from './EventCard';
import type { CalendarEvent } from '@/types';

interface Props {
  events:  CalendarEvent[];
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="glass-card w-[196px] shrink-0 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-xl bg-white/[0.05] animate-pulse" />
        <div className="h-3 w-10 rounded-full bg-white/[0.04] animate-pulse" />
      </div>
      <div className="h-3 w-4/5 rounded-lg bg-white/[0.05] animate-pulse" />
      <div className="h-2 w-3/5 rounded-lg bg-white/[0.04] animate-pulse" />
      <div className="mt-auto h-px w-full bg-white/[0.04]" />
      <div className="h-2 w-2/5 rounded-lg bg-white/[0.03] animate-pulse" />
    </div>
  );
}

export function UpcomingStrip({ events, loading }: Props) {
  const slice = events.slice(0, 12);

  return (
    <section className="relative z-10 border-t border-white/[0.05] py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="text-lg font-black tracking-tight text-slate-100"
          >
            Próximos Eventos
          </motion.h2>
          {!loading && slice.length > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600"
            >
              Desliza
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.span>
          )}
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          aria-label="Próximos eventos"
        >
          {loading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : slice.length === 0
            ? (
              <p className="py-6 text-sm text-slate-700">
                Agrega eventos en Supabase para verlos aquí.
              </p>
            )
            : slice.map((ev, i) => (
                <EventCard key={ev.id + ev.type} event={ev} index={i} variant="strip" />
              ))
          }
        </div>

      </div>
    </section>
  );
}
