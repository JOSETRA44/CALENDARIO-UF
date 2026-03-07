'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

export function Header() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const s = now.toLocaleDateString('es-CL', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
      setDateStr(s.charAt(0).toUpperCase() + s.slice(1));
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#060612]/75 backdrop-blur-2xl">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 flex items-center justify-between h-16">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
            <CalendarDays className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-black tracking-tight text-slate-100">
            Calendario UF
          </span>
        </div>

        {/* Current date */}
        <time className="hidden sm:block text-xs font-medium text-slate-500" aria-label="Fecha actual">
          {dateStr}
        </time>

      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
    </header>
  );
}
