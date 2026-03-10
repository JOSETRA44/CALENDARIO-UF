'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Cake, Flag, Heart, Zap } from 'lucide-react';
import { FooterParticles } from './FooterParticles';

interface Props {
  birthdayCount: number;
  holidayCount:  number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 220, damping: 26 } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export function Footer({ birthdayCount, holidayCount }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 overflow-hidden">

      {/* Wave SVG separator */}
      <div className="relative -mb-px" aria-hidden="true">
        <svg
          viewBox="0 0 1440 72"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="block w-full h-[40px] sm:h-[60px]"
        >
          <path
            d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
            className="footer-wave-fill"
          />
          <path
            d="M0,52 C360,20 720,68 1080,36 C1260,20 1380,44 1440,52 L1440,72 L0,72 Z"
            fill="rgba(99,102,241,0.04)"
          />
        </svg>
      </div>

      {/* Body */}
      <div className="relative border-t border-white/[0.05] bg-gradient-to-b from-[#080820] to-[#020209]">

        {/* Canvas confetti — stays contained in footer */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <FooterParticles />
        </div>

        {/* Central glow */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="nebula-indigo absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-[120px]" />
          <div className="nebula-violet absolute left-1/4 bottom-0 h-[280px] w-[280px] rounded-full opacity-[0.05] blur-[80px]" />
          <div className="nebula-rose absolute right-1/4 top-0 h-[280px] w-[280px] rounded-full opacity-[0.05] blur-[80px]" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-screen-lg px-4 py-20 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col items-center gap-8"
          >

            {/* Logo icon */}
            <motion.div variants={fadeUp} className="relative">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-2xl shadow-indigo-500/40">
                <CalendarDays className="h-9 w-9 text-white drop-shadow-lg" aria-hidden="true" />
                {/* Ring glow */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-indigo-400/30 ping-slow" aria-hidden="true" />
              </div>
              {/* Outer halo */}
              <div className="nebula-indigo absolute inset-0 rounded-3xl opacity-40 blur-xl" aria-hidden="true" />
            </motion.div>

            {/* Brand name — massive gradient shimmer */}
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
              <h2 className="footer-brand text-6xl font-black tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
                Calendario UF
              </h2>
              <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Cake className="h-3.5 w-3.5 text-rose-400/60" aria-hidden="true" />
                <span>Cumpleaños y Días Festivos · Chile</span>
                <Flag className="h-3.5 w-3.5 text-amber-400/60" aria-hidden="true" />
              </p>
            </motion.div>

            {/* Stat pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <span className="stat-rose inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold">
                <Cake className="h-3.5 w-3.5" aria-hidden="true" />
                {birthdayCount > 0 ? `${birthdayCount} Cumpleaños` : 'Cumpleaños'}
              </span>
              <span className="stat-amber inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold">
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                {holidayCount > 0 ? `${holidayCount} Festivos` : 'Días Festivos'}
              </span>
              <span className="stat-indigo inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                Tiempo real
              </span>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              className="h-px w-48 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"
              aria-hidden="true"
            />

            {/* Copyright */}
            <motion.p
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-700"
            >
              <span className="text-slate-600 font-semibold">Calendario UF</span>
              <span>&copy; {year}</span>
              <span className="text-slate-800" aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                Hecho con
                <Heart className="inline h-3 w-3 text-rose-500/50" aria-hidden="true" />
                en Chile
              </span>
              <span className="text-slate-800" aria-hidden="true">·</span>
              <span>Datos vía Supabase</span>
            </motion.p>

          </motion.div>
        </div>
      </div>
    </footer>
  );
}
