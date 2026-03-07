'use client';

import { useEffect, useState } from 'react';
import { decompose, msUntil } from '@/lib/dates';
import type { Countdown } from '@/types';

const ZERO: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function useCountdown(targetDate: Date | null): Countdown {
  const [cd, setCd] = useState<Countdown>(ZERO);

  useEffect(() => {
    if (!targetDate) { setCd(ZERO); return; }

    function tick() {
      setCd(decompose(msUntil(targetDate!)));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return cd;
}
