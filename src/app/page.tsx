'use client';

import { Particles }     from '@/components/Particles';
import { Header }        from '@/components/Header';
import { Hero }          from '@/components/Hero';
import { UpcomingStrip } from '@/components/UpcomingStrip';
import { EventsGrid }    from '@/components/EventsGrid';
import { useEvents }     from '@/hooks/useEvents';

export default function Page() {
  const { events, loading, error } = useEvents();
  const nextEvent = events[0] ?? null;

  return (
    <>
      {/* Particle background */}
      <Particles />

      {/* Sticky header */}
      <Header />

      <main id="main-content">
        {/* Hero + big countdown */}
        <Hero nextEvent={nextEvent} loading={loading} />

        {/* Horizontal upcoming strip */}
        <UpcomingStrip events={events} loading={loading} />

        {/* Filterable events grid */}
        <EventsGrid events={events} loading={loading} error={error} />
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-8 text-center">
        <p className="text-xs text-slate-600">
          Calendario UF &copy; {new Date().getFullYear()} · Los datos se actualizan automáticamente
        </p>
      </footer>
    </>
  );
}
