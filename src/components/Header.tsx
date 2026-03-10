'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

function formatNow() {
  const now = new Date();
  const d = now.toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const t = now.toLocaleTimeString('es-CL', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  return { date: d.charAt(0).toUpperCase() + d.slice(1), time: t };
}

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    // Set immediately to avoid first-render flash
    const { date, time } = formatNow();
    setDateStr(date);
    setTimeStr(time);
    setMounted(true);

    // Update every second — date only changes at midnight, time every second
    const id = setInterval(() => {
      const { date: d, time: t } = formatNow();
      setDateStr(d);
      setTimeStr(t);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Backdrop with enhanced blur */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-950/40 to-purple-950/20 backdrop-blur-xl" 
        aria-hidden="true" 
      />
      <div 
        className="absolute inset-0 bg-[#050514]/70 backdrop-blur-2xl" 
        aria-hidden="true" 
      />

      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-8 lg:px-12 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/40 transition-all duration-300 hover:shadow-indigo-500/60">
            <CalendarDays className="h-5 w-5 text-white transition-transform group-hover:scale-110" aria-hidden="true" />
            <span
              className="absolute inset-0 rounded-xl ring-1 ring-indigo-300/60 ping-slow"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-sm font-black tracking-tight text-transparent">
              Calendario UF
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400/70">
              peru · Eventos
            </span>
          </div>
        </div>

        {/* Right: live indicator + date/time */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:flex items-center gap-2.5" aria-label="Actualización en tiempo real">
            <span className="live-dot" aria-hidden="true" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">En vivo</span>
          </div>

          {mounted && dateStr && (
            <time
              className="hidden md:flex items-center gap-2.5 text-xs font-medium text-slate-400 border-l border-slate-700/50 pl-4"
              aria-label="Fecha y hora actuales"
            >
              <span className="text-slate-300">{dateStr}</span>
              <span className="font-mono tabular-nums text-slate-500">{timeStr}</span>
            </time>
          )}
        </div>
      </div>

      {/* Aurora animated border */}
      <div className="relative h-px overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/50 via-purple-500/40 to-transparent aurora-bar"
        />
      </div>
    </header>
  );
}
