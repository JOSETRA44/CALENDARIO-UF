'use client';

import { useMemo, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type AccentColor = 'rose' | 'amber' | 'indigo';

interface Props {
  value: number;
  label: string;
  color?: AccentColor;
}

const glowCls: Record<AccentColor, string> = {
  rose:   'cd-glow-rose',
  amber:  'cd-glow-amber',
  indigo: 'cd-glow-indigo',
};

function CountdownUnitComponent({ value, label, color = 'indigo' }: Props) {
  const formatted = useMemo(() => String(value).padStart(2, '0'), [value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="cd-card relative flex h-[80px] w-[68px] sm:h-[110px] sm:w-[92px] lg:h-[120px] lg:w-[100px] items-center justify-center overflow-hidden rounded-3xl backdrop-blur-xl">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/3 to-white/1"
          aria-hidden="true"
        />
        
        {/* Top shine */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {/* Bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        
        {/* Accent glow */}
        <div className={`pointer-events-none absolute inset-0 ${glowCls[color]}`} />
        
        {/* Center divider (flip-clock) */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: -24, opacity: 0, scale: 0.85 }}
            animate={{ y:   0, opacity: 1, scale: 1   }}
            exit={{    y:  24, opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 480, damping: 36 }}
            className="relative z-10 font-black tabular-nums text-white text-[2.2rem] sm:text-[3.5rem] lg:text-[4rem] leading-none drop-shadow-lg"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </span>
    </div>
  );
}

// Memoize to prevent re-renders when parent updates
export const CountdownUnit = memo(CountdownUnitComponent);

export function CountdownSep() {
  return (
    <span
      aria-hidden="true"
      className="mb-8 sm:mb-10 text-[1.75rem] sm:text-[2.5rem] font-black text-slate-700/80 animate-[blink_1.4s_step-end_infinite] select-none"
    >
      :
    </span>
  );
}
