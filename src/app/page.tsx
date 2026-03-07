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
      {/* Layer 0 — starfield canvas */}
      <Particles />

      {/* Layer 1 — nebula glow orbs (between stars and UI) */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div className="nebula-indigo absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full opacity-[0.13] blur-[110px]" />
        <div className="nebula-rose   absolute -left-48 bottom-0   h-[580px] w-[580px] rounded-full opacity-[0.09] blur-[120px]" />
        <div className="nebula-amber  absolute right-1/4 top-2/3   h-[380px] w-[380px] rounded-full opacity-[0.07] blur-[140px]" />
        <div className="nebula-violet absolute -left-20 top-1/3    h-[320px] w-[320px] rounded-full opacity-[0.07] blur-[100px]" />
      </div>

      {/* Layer 2 — UI */}
      <Header />

      <main id="main-content">
        <Hero nextEvent={nextEvent} loading={loading} />
        <UpcomingStrip events={events} loading={loading} />
        <EventsGrid events={events} loading={loading} error={error} />
      </main>

      <footer className="relative z-10 border-t border-white/[0.05] py-8 text-center">
        <p className="text-xs text-slate-700">
          Calendario UF &copy; {new Date().getFullYear()} &nbsp;·&nbsp; Datos actualizados automáticamente
        </p>
      </footer>
    </>
  );
}
