'use client';

import { motion } from 'framer-motion';
import { EventCard } from './EventCard';
import type { CalendarEvent } from '@/types';

interface Props {
  events:  CalendarEvent[];
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="w-[190px] shrink-0 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 flex flex-col gap-3">
      <div className="h-8 w-8 rounded-xl bg-white/[0.05] animate-pulse" />
      <div className="h-3 w-4/5 rounded bg-white/[0.05] animate-pulse" />
      <div className="h-2 w-3/5 rounded bg-white/[0.04] animate-pulse" />
      <div className="mt-auto h-2 w-2/5 rounded bg-white/[0.03] animate-pulse" />
    </div>
  );
}

export function UpcomingStrip({ events, loading }: Props) {
  const slice = events.slice(0, 10);

  return (
    <section className="relative z-10 border-t border-white/[0.05] py-10">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8">

        <motion.h2
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="mb-5 text-lg font-bold tracking-tight text-slate-200"
        >
          Proximos Eventos
        </motion.h2>

        <div
          className="flex gap-3 overflow-x-auto pb-3"
          role="list"
          aria-label="Proximos eventos"
        >
          {loading
            ? Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)
            : slice.length === 0
            ? <p className="text-sm text-slate-600 py-4">Agrega eventos en Supabase para verlos aqui.</p>
            : slice.map((ev, i) => (
                <EventCard key={ev.id + ev.type} event={ev} index={i} variant="strip" />
              ))
          }
        </div>

      </div>
    </section>
  );
}
