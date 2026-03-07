'use client';

import { AnimatePresence, motion } from 'framer-motion';

type AccentColor = 'rose' | 'amber' | 'indigo';

interface Props {
  value: number;
  label: string;
  color?: AccentColor;
}

const glowMap: Record<AccentColor, string> = {
  rose:   'radial-gradient(ellipse at 50% 0%, rgba(244,63,94,0.22), transparent 68%)',
  amber:  'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.22), transparent 68%)',
  indigo: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.22), transparent 68%)',
};

export function CountdownUnit({ value, label, color = 'indigo' }: Props) {
  const formatted = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex h-[68px] w-[58px] sm:h-24 sm:w-20 items-center justify-center overflow-hidden rounded-2xl backdrop-blur-xl"
        style={{
          background: 'rgba(255,255,255,0.035)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 16px 40px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Top shine */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        {/* Accent glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: glowMap[color] }} />
        {/* Flip-clock center divider */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/25" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y:   0, opacity: 1 }}
            exit={{    y:  18, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative z-10 font-black tabular-nums text-white text-3xl sm:text-5xl leading-none"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>

      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </span>
    </div>
  );
}

export function CountdownSep() {
  return (
    <span
      aria-hidden="true"
      className="mb-7 text-2xl sm:text-4xl font-black text-slate-700 animate-[blink_1.4s_step-end_infinite]"
    >
      :
    </span>
  );
}
