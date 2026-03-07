'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { EventCard } from './EventCard';
import type { CalendarEvent, TabFilter } from '@/types';

interface Props {
  events:  CalendarEvent[];
  loading: boolean;
  error:   string | null;
}

const TABS: { id: TabFilter; label: string }[] = [
  { id: 'todos',      label: 'Todos'         },
  { id: 'cumpleanos', label: '🎂 Cumpleaños' },
  { id: 'festivos',   label: '🎉 Días Festivos' },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 flex flex-col gap-3 min-h-[160px]">
      <div className="h-8 w-8 rounded-full bg-white/[0.06] animate-pulse" />
      <div className="h-3 w-3/4 rounded bg-white/[0.06] animate-pulse" />
      <div className="h-2 w-1/2 rounded bg-white/[0.04] animate-pulse" />
      <div className="mt-auto h-2 w-2/5 rounded bg-white/[0.04] animate-pulse" />
    </div>
  );
}

export function EventsGrid({ events, loading, error }: Props) {
  const [tab,   setTab]   = useState<TabFilter>('todos');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = events;
    if (tab === 'cumpleanos') list = list.filter(e => e.type === 'birthday');
    if (tab === 'festivos')   list = list.filter(e => e.type === 'holiday');
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e =>
        e.nombre.toLowerCase().includes(q) ||
        e.descripcion?.toLowerCase().includes(q) ||
        e.departamento?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [events, tab, query]);

  return (
    <section className="relative z-10 border-t border-white/[0.06] py-12 pb-20">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8">

        {/* Section header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="text-xl font-black tracking-tight text-slate-100"
          >
            Todos los Eventos
          </motion.h2>

          {/* Search */}
          <div className="relative flex items-center" role="search">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar evento o persona…"
              aria-label="Buscar evento"
              autoComplete="off"
              className="
                h-11 w-56 rounded-full border border-white/[0.08] bg-white/[0.04]
                pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600
                outline-none transition
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
              "
            />
          </div>
        </div>

        {/* Tabs */}
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrar por tipo de evento"
        >
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`
                min-h-[44px] rounded-full border px-5 text-sm font-bold transition-all
                ${tab === t.id
                  ? 'border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'border-white/[0.08] bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-slate-200'}
              `}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-20 text-center"
            aria-live="polite"
          >
            <span className="text-5xl">🔍</span>
            <p className="text-lg font-bold text-slate-300">No se encontraron eventos</p>
            <p className="text-sm text-slate-500">Intenta con otro término o revisa los filtros</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            role="list"
            aria-label="Lista de eventos"
          >
            <AnimatePresence>
              {filtered.map((ev, i) => (
                <EventCard key={ev.id + ev.type} event={ev} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
}
