import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Rocket, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const PitchArena: React.FC = () => {
  const { chosenStartup, openECellReveal, restartGame } = useGame();

  if (!chosenStartup) return null;

  return (
    <div className="relative w-full h-full overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none custom-scrollbar">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#38bdf8]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-yellow-400/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-15 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative z-10 w-full max-w-lg my-auto brawl-card p-5 sm:p-6 md:p-7 border-3 border-[#38bdf8] border-b-6 border-b-[#0284c7] shadow-[0_0_40px_rgba(56,189,248,0.3)] bg-[#090d1f]"
      >
        {/* Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/60 text-sky-300 text-[11px] font-brawl uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>STAGE 9 • THE FINAL VERDICT</span>
        </div>

        {/* Headline */}
        <h1 className="brawl-text text-2xl sm:text-4xl text-white tracking-tight leading-tight mb-2">
          YOUR STARTUP NEEDS <span className="text-yellow-400">HELP!</span>
        </h1>

        <p className="text-xs sm:text-sm text-sky-200/90 font-sans max-w-md mx-auto leading-relaxed mb-4">
          You proved your grit and built the initial MVP. But scaling a real company alone is exhausting. <strong className="text-white">Startups are an ecosystem sport!</strong>
        </p>

        {/* Compact Startup Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/90 border border-yellow-400/40 text-xs font-brawl text-yellow-300 mb-4 shadow-sm">
          <span className="text-base">{chosenStartup.icon}</span>
          <span>{chosenStartup.name.toUpperCase()} (SOLO FOUNDER)</span>
        </div>

        {/* 3 Quick Superpower Bullets */}
        <div className="space-y-2 mb-5 text-left">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#060b1b] border border-sky-500/30">
            <div className="w-8 h-8 rounded-lg bg-sky-950 flex items-center justify-center shrink-0 border border-sky-400/40 text-sky-300">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-brawl text-sky-300 block">DEV LAB & CO-FOUNDERS</span>
              <span className="text-gray-300 font-sans text-[11px]">Stop coding & designing alone at 3 AM.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#060b1b] border border-purple-500/30">
            <div className="w-8 h-8 rounded-lg bg-purple-950 flex items-center justify-center shrink-0 border border-purple-400/40 text-purple-300">
              <Rocket className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-brawl text-purple-300 block">MEDIA STUDIO & 10K+ REACH</span>
              <span className="text-gray-300 font-sans text-[11px]">Get campus-wide buzz and active users on day one.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#060b1b] border border-emerald-500/30">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center shrink-0 border border-emerald-400/40 text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-brawl text-emerald-300 block">SEED CAPITAL & MENTORSHIP</span>
              <span className="text-gray-300 font-sans text-[11px]">Direct access to angel investors and seed incubation grants.</span>
            </div>
          </div>
        </div>

        {/* Primary CTA: Directly open the next registration/poster page */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playSuccessFanfare();
            openECellReveal();
          }}
          className="w-full py-3.5 px-6 brawl-btn brawl-btn-yellow text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(250,204,21,0.35)] mb-3"
        >
          <Sparkles className="w-4 h-4 fill-black text-black" />
          <span>SEE HOW IEC SOA CAN HELP</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </motion.button>

        {/* Replay Option */}
        <button
          onClick={() => {
            sound.playClick();
            restartGame();
          }}
          className="text-xs text-gray-400 hover:text-white font-brawl tracking-wider flex items-center justify-center gap-1.5 mx-auto transition-colors py-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>PITCH ANOTHER VENTURE</span>
        </button>
      </motion.div>
    </div>
  );
};
