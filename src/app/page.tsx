'use client';

import { Suspense, memo } from 'react';
import { Particles }     from '@/components/Particles';
import { Header }        from '@/components/Header';
import { Hero }          from '@/components/Hero';
import { UpcomingStrip } from '@/components/UpcomingStrip';
import { EventsGrid }    from '@/components/EventsGrid';
import { useEvents }     from '@/hooks/useEvents';

// Memoize components to prevent unnecessary re-renders
const MemoizedHeader = memo(Header);
const MemoizedHero = memo(Hero);
const MemoizedUpcomingStrip = memo(UpcomingStrip);
const MemoizedEventsGrid = memo(EventsGrid);
const MemoizedParticles = memo(Particles);

export default function Page() {
  const { events, loading, error } = useEvents();
  const nextEvent = events[0] ?? null;

  return (
    <>
      {/* Layer 0 — starfield canvas */}
      <MemoizedParticles />

      {/* Layer 2 — UI */}
      <MemoizedHeader />

      <main id="main-content">
        <MemoizedHero nextEvent={nextEvent} loading={loading} />
        <MemoizedUpcomingStrip events={events} loading={loading} />
        <MemoizedEventsGrid events={events} loading={loading} error={error} />
      </main>

      <footer className="relative z-10 border-t border-white/[0.05] py-8 text-center">
        <p className="text-xs text-slate-700">
          Calendario UF &copy; {new Date().getFullYear()} &nbsp;·&nbsp; Datos actualizados automáticamente
        </p>
      </footer>
    </>
  );
}
