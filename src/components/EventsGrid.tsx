'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Cake, Flag, SearchX } from 'lucide-react';
import { EventCard } from './EventCard';
import type { CalendarEvent, TabFilter } from '@/types';

interface Props {
  events:  CalendarEvent[];
  loading: boolean;
  error:   string | null;
}

interface Tab { id: TabFilter; label: string; Icon?: React.ElementType }
const TABS: Tab[] = [
  { id: 'todos',      label: 'Todos' },
  { id: 'cumpleanos', label: 'Cumpleaños',   Icon: Cake },
  { id: 'festivos',   label: 'Dias Festivos', Icon: Flag },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 flex flex-col gap-3 min-h-[160px]">
      <div className="flex items-start justify-between">
        <div className="h-9 w-9 rounded-xl bg-white/[0.06] animate-pulse" />
        <div className="h-5 w-20 rounded-md bg-white/[0.04] animate-pulse" />
      </div>
      <div className="h-3.5 w-3/4 rounded bg-white/[0.06] animate-pulse mt-1" />
      <div className="h-2.5 w-1/2 rounded bg-white/[0.04] animate-pulse" />
      <div className="mt-auto h-2.5 w-2/5 rounded bg-white/[0.04] animate-pulse" />
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

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="text-xl font-bold tracking-tight text-slate-100"
          >
            Todos los Eventos
          </motion.h2>

          {/* Search */}
          <div className="relative flex items-center" role="search">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar evento o persona"
              aria-label="Buscar evento"
              autoComplete="off"
              className="h-10 w-52 rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Tabs */}
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtrar por tipo de evento"
        >
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={[
                  'inline-flex items-center gap-1.5 min-h-[40px] rounded-xl border px-4 text-sm font-semibold transition-all',
                  active
                    ? 'border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.15] hover:text-slate-200',
                ].join(' ')}
              >
                {t.Icon && <t.Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Error */}
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-20 text-center"
            aria-live="polite"
          >
            <SearchX className="h-10 w-10 text-slate-600" aria-hidden="true" />
            <p className="text-base font-semibold text-slate-400">No se encontraron eventos</p>
            <p className="text-sm text-slate-600">Intenta con otro termino o revisa los filtros</p>
          </motion.div>
        ) : (
          <div
            className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            role="list"
            aria-label="Lista de eventos"
          >
            <AnimatePresence>
              {filtered.map((ev, i) => (
                <EventCard key={ev.id + ev.type} event={ev} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}
