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
    <header className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-2xl bg-[#070714]/80">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-8 flex items-center justify-between h-16">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <CalendarDays className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Calendario UF
          </span>
        </div>

        {/* Current date */}
        <time
          className="hidden sm:block text-xs font-medium text-slate-400"
          aria-label="Fecha actual"
        >
          {dateStr}
        </time>

      </div>
    </header>
  );
}
