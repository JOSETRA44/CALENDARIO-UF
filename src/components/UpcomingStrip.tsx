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
    <div className="glass-card w-[200px] shrink-0 rounded-2xl p-5 sm:p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] animate-pulse" />
        <div className="h-3 w-12 rounded-lg bg-gradient-to-r from-white/[0.06] to-white/[0.02] animate-pulse" />
      </div>
      <div className="h-3 w-5/6 rounded-lg bg-gradient-to-r from-white/[0.08] to-white/[0.03] animate-pulse" />
      <div className="h-2 w-3/4 rounded-lg bg-gradient-to-r from-white/[0.06] to-white/[0.02] animate-pulse" />
      <div className="mt-auto h-px w-full bg-white/[0.05]" />
      <div className="h-2 w-1/2 rounded-lg bg-gradient-to-r from-white/[0.05] to-white/[0.01] animate-pulse" />
    </div>
  );
}

export function UpcomingStrip({ events, loading }: Props) {
  const slice = events.slice(0, 12);

  return (
    <section className="relative z-10 border-y border-white/[0.05] py-16">
      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-clip-text text-xl sm:text-2xl font-black tracking-tight text-transparent"
          >
            Próximos Eventos
          </motion.h2>
          {!loading && slice.length > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500/80 hover:text-slate-400 transition-colors"
            >
              Desliza
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </motion.div>
            </motion.span>
          )}
        </div>

        {/* Horizontal scroll strip */}
        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
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
