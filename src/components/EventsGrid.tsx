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
    <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col gap-3 min-h-[180px] sm:min-h-[200px]">
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] animate-pulse" />
        <div className="h-4 w-16 rounded-lg bg-gradient-to-r from-white/[0.06] to-white/[0.02] animate-pulse" />
      </div>
      <div className="h-3 w-5/6 rounded-lg bg-gradient-to-r from-white/[0.08] to-white/[0.03] animate-pulse mt-1" />
      <div className="h-2.5 w-4/5 rounded-lg bg-gradient-to-r from-white/[0.06] to-white/[0.02] animate-pulse" />
      <div className="h-2 w-3/4 rounded-lg bg-gradient-to-r from-white/[0.04] to-white/[0.01] animate-pulse" />
      <div className="mt-auto h-px w-full bg-white/[0.05]" />
      <div className="h-2.5 w-2/5 rounded-lg bg-gradient-to-r from-white/[0.05] to-white/[0.01] animate-pulse" />
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
    <section className="relative z-10 border-t border-white/[0.05] py-16 pb-32">
      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12">

        {/* Header row */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }} // Optimized
          >
            <h2 className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-clip-text text-2xl sm:text-3xl font-black tracking-tight text-transparent">
              Todos los Eventos
            </h2>
            {!loading && (
              <p className="mt-1 text-sm text-slate-500">
                <span className="font-semibold text-slate-400">{counts.todos}</span> eventos totales · <span className="font-semibold text-rose-400/80">{counts.cumpleanos}</span> cumpleaños · <span className="font-semibold text-amber-400/80">{counts.festivos}</span> festivos
              </p>
            )}
          </motion.div>

          {/* Search */}
          <div className="relative flex items-center w-full sm:w-auto" role="search">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-600" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar evento…"
              aria-label="Buscar evento"
              autoComplete="off"
              className="w-full sm:w-56 h-10 rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] pl-10 pr-10 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/40 focus:bg-white/[0.08] focus:ring-1 focus:ring-indigo-500/30"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                type="button"
                className="absolute right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-slate-500 transition hover:bg-white/[0.15] hover:text-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex flex-wrap gap-3">
          {TABS.map(t => {
            const active = tab === t.id;
            const count  = counts[t.id];
            return (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={[
                  'inline-flex items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-250',
                  active
                    ? 'border-transparent bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-indigo-500/25 hover:bg-white/[0.06] hover:text-slate-300',
                ].join(' ')}
                aria-pressed={active}
              >
                {t.Icon && <t.Icon className="h-4 w-4" aria-hidden="true" />}
                {t.label}
                {!loading && (
                  <motion.span 
                    initial={false}
                    animate={{ scale: 1 }}
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${active ? 'bg-white/25 text-white' : 'bg-white/[0.08] text-slate-500'}`}
                  >
                    {count}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/[0.08] to-red-500/[0.04] px-6 py-4 text-sm text-red-300 backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 py-32 text-center"
            aria-live="polite"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.08]"
            >
              <SearchX className="h-10 w-10 text-slate-600" aria-hidden="true" />
            </motion.div>
            <div>
              <p className="text-base font-bold text-slate-400">No se encontraron eventos</p>
              <p className="mt-2 text-sm text-slate-600">Intenta con otro término o cambia el filtro</p>
            </div>
            {query && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setQuery('')}
                type="button"
                className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white/[0.08] hover:text-slate-300"
              >
                Limpiar búsqueda
              </motion.button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              aria-label="Lista de eventos"
            >
              {filtered.map((ev, i) => (
                <EventCard key={ev.id + ev.type} event={ev} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </section>
  );
}
