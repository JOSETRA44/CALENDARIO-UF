'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

export function Header() {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const d = now.toLocaleDateString('es-CL', {
        weekday: 'long', day: 'numeric', month: 'long',
      });
      setDateStr(d.charAt(0).toUpperCase() + d.slice(1));
      setTimeStr(now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }));
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#07071a]/80 backdrop-blur-2xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <CalendarDays className="h-4 w-4 text-white" aria-hidden="true" />
            <span
              className="absolute inset-0 rounded-xl ring-1 ring-indigo-400/40 ping-slow"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-tight text-slate-100">Calendario UF</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400/60">Chile · Eventos</span>
          </div>
        </div>

        {/* Right: live indicator + date/time */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2" aria-label="Actualización en tiempo real">
            <span className="live-dot" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">En vivo</span>
          </div>

          {dateStr && (
            <time
              className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500"
              aria-label="Fecha y hora actuales"
            >
              <span>{dateStr}</span>
              <span className="text-slate-700" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-400">{timeStr}</span>
            </time>
          )}
        </div>
      </div>

      {/* Aurora animated border */}
      <div className="relative h-px overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/55 to-transparent aurora-bar"
        />
      </div>
    </header>
  );
}
