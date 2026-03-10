'use client';

import { memo, useMemo } from 'react';
import { Particles }     from '@/components/Particles';
import { Header }        from '@/components/Header';
import { Hero }          from '@/components/Hero';
import { UpcomingStrip } from '@/components/UpcomingStrip';
import { EventsGrid }    from '@/components/EventsGrid';
import { Footer }        from '@/components/Footer';
import { useEvents }     from '@/hooks/useEvents';

const MemoizedHeader       = memo(Header);
const MemoizedHero         = memo(Hero);
const MemoizedUpcomingStrip = memo(UpcomingStrip);
const MemoizedEventsGrid   = memo(EventsGrid);
const MemoizedParticles    = memo(Particles);

export default function Page() {
  const { events, loading, error } = useEvents();
  const nextEvent = events[0] ?? null;

  const birthdayCount = useMemo(() => events.filter(e => e.type === 'birthday').length, [events]);
  const holidayCount  = useMemo(() => events.filter(e => e.type === 'holiday').length,  [events]);

  return (
    <>
      {/* Layer 0 — starfield canvas */}
      <MemoizedParticles />

      {/* Layer 1 — nebula glow orbs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div className="nebula-indigo absolute -right-48 -top-48 h-[700px] w-[700px] rounded-full opacity-[0.12] blur-[110px]" />
        <div className="nebula-rose   absolute -left-48 bottom-0   h-[580px] w-[580px] rounded-full opacity-[0.08] blur-[120px]" />
        <div className="nebula-amber  absolute right-1/4 top-2/3   h-[380px] w-[380px] rounded-full opacity-[0.06] blur-[140px]" />
        <div className="nebula-violet absolute -left-20 top-1/3    h-[320px] w-[320px] rounded-full opacity-[0.06] blur-[100px]" />
      </div>

      {/* Layer 2 — UI */}
      <MemoizedHeader />

      <main id="main-content">
        <MemoizedHero nextEvent={nextEvent} loading={loading} />
        <MemoizedUpcomingStrip events={events} loading={loading} />
        <MemoizedEventsGrid events={events} loading={loading} error={error} />
      </main>

      <Footer birthdayCount={birthdayCount} holidayCount={holidayCount} />
    </>
  );
}
