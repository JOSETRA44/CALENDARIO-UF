'use client';

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

export function CountdownUnit({ value, label, color = 'indigo' }: Props) {
  const formatted = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="cd-card relative flex h-[76px] w-[64px] sm:h-[104px] sm:w-[88px] items-center justify-center overflow-hidden rounded-2xl backdrop-blur-xl">
        {/* Top shine */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* Bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        {/* Accent glow */}
        <div className={`pointer-events-none absolute inset-0 ${glowCls[color]}`} />
        {/* Center divider (flip-clock) */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/30" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y:   0, opacity: 1, scale: 1   }}
            exit={{    y:  20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative z-10 font-black tabular-nums text-white text-[2rem] sm:text-[3.25rem] leading-none"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
        {label}
      </span>
    </div>
  );
}

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
