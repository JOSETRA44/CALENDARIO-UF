'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Cake, Flag, SearchX, X } from 'lucide-react';
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
  { id: 'cumpleanos', label: 'Cumpleaños',    Icon: Cake },
  { id: 'festivos',   label: 'Días Festivos', Icon: Flag },
];

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 min-h-[168px]">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-xl bg-white/[0.05] animate-pulse" />
        <div className="h-4 w-14 rounded-full bg-white/[0.04] animate-pulse" />
      </div>
      <div className="h-3 w-3/4 rounded-lg bg-white/[0.05] animate-pulse mt-1" />
      <div className="h-2.5 w-1/2 rounded-lg bg-white/[0.04] animate-pulse" />
      <div className="mt-auto h-px w-full bg-white/[0.04]" />
      <div className="h-2.5 w-2/5 rounded-lg bg-white/[0.03] animate-pulse" />
    </div>
  );
}

export function EventsGrid({ events, loading, error }: Props) {
  const [tab,   setTab]   = useState<TabFilter>('todos');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => ({
    todos:      events.length,
    cumpleanos: events.filter(e => e.type === 'birthday').length,
    festivos:   events.filter(e => e.type === 'holiday').length,
  }), [events]);

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
    <section className="relative z-10 border-t border-white/[0.05] py-14 pb-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8">

        {/* Header row */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <h2 className="text-xl font-black tracking-tight text-slate-100">
              Todos los Eventos
            </h2>
            {!loading && (
              <p className="mt-0.5 text-xs text-slate-600">
                {counts.todos} eventos · {counts.cumpleanos} cumpleaños · {counts.festivos} festivos
              </p>
            )}
          </motion.div>

          {/* Search */}
          <div className="relative flex items-center" role="search">
            <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar evento…"
              aria-label="Buscar evento"
              autoComplete="off"
              className="h-9 w-52 rounded-xl border border-white/[0.07] bg-white/[0.03] pl-9 pr-9 text-sm text-slate-300 placeholder-slate-700 outline-none transition focus:border-indigo-500/40 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/20"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                type="button"
                className="absolute right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.07] text-slate-500 transition hover:bg-white/[0.12] hover:text-slate-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por tipo de evento">
          {TABS.map(t => {
            const active = tab === t.id;
            const count  = counts[t.id];
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active ? true : false}
                onClick={() => setTab(t.id)}
                className={[
                  'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200',
                  active
                    ? 'border-transparent bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'border-white/[0.07] bg-white/[0.02] text-slate-500 hover:border-indigo-500/20 hover:bg-white/[0.05] hover:text-slate-300',
                ].join(' ')}
              >
                {t.Icon && <t.Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                {t.label}
                {!loading && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${active ? 'bg-white/20 text-white' : 'bg-white/[0.05] text-slate-600'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-24 text-center"
            aria-live="polite"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <SearchX className="h-7 w-7 text-slate-700" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">No se encontraron eventos</p>
              <p className="mt-1 text-xs text-slate-700">Intenta con otro término o cambia el filtro</p>
            </div>
            {query && (
              <button
                onClick={() => setQuery('')}
                type="button"
                className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-500 transition hover:text-slate-300"
              >
                Limpiar búsqueda
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            <div
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              aria-label="Lista de eventos"
            >
              {filtered.map((ev, i) => (
                <EventCard key={ev.id + ev.type} event={ev} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}

      </div>
    </section>
  );
}
