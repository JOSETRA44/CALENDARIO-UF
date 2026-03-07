'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  value: number;
  label: string;
}

export function CountdownUnit({ value, label }: Props) {
  const formatted = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Digit card */}
      <div className="relative flex h-16 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] shadow-inner sm:h-20 sm:w-20 backdrop-blur-sm">
        {/* Inner glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15), transparent 70%)' }}
        />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: -24, opacity: 0, scale: 0.8 }}
            animate={{ y: 0,   opacity: 1, scale: 1 }}
            exit={{    y:  24, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="relative font-black tabular-nums text-white text-2xl sm:text-4xl leading-none"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Label */}
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
    </div>
  );
}

export function CountdownSep() {
  return (
    <span
      aria-hidden="true"
      className="mb-5 text-2xl font-black text-slate-600 sm:text-4xl animate-[blink_1.4s_step-end_infinite]"
    >
      :
    </span>
  );
}
