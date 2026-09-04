import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, XCircle, AlertOctagon } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const PitchArena: React.FC = () => {
  const { chosenStartup, finishPitchMontage } = useGame();
  const [montageStep, setMontageStep] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setMontageStep(1);
      sound.playNegative();
    }, 2000);

    const t2 = setTimeout(() => {
      setMontageStep(2);
      sound.playFailureDrone();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!chosenStartup) return null;

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 sm:p-6 md:p-8 pb-14 md:pb-16 text-center select-none custom-scrollbar">
      
      {/* Stadium Red Alert Lights */}
      <div className="absolute top-0 left-1/4 w-72 h-[600px] bg-red-600/15 blur-3xl transform -rotate-12 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-[600px] bg-yellow-500/10 blur-3xl transform rotate-12 pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl my-auto flex flex-col items-center">
        {/* Header */}
        <div className="relative z-10 max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border-2 border-red-500 text-red-300 text-xs font-brawl uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5 text-red-400" />
            <span>STAGE 9: THE GRAND PITCH FINALE</span>
          </div>
          
          <h1 className="brawl-text text-3xl sm:text-5xl text-white tracking-tight mb-1">
            THE FINAL <span className="text-red-500">VERDICT</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-sans">
            500 students and angel investors stare at the exhausted solo founder on stage.
          </p>
        </div>

        {/* Pitch Defeat Arena Card */}
        <div className="relative z-10 w-full max-w-3xl brawl-card p-6 md:p-8 border-4 border-red-500 border-b-8 border-b-red-800 shadow-[0_0_50px_rgba(239,68,68,0.4)] bg-[#0c0812]">
        
        {/* Stage Graphic */}
        <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-slate-950 to-red-950/40 border-2 border-red-500/40 flex flex-col items-center justify-center overflow-hidden mb-6">
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/30 via-transparent to-transparent" />
          
          {/* Avatar looking tired on stage */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-3 border-red-500 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              {chosenStartup.icon}
            </div>
            <div className="mt-2 px-3 py-0.5 rounded-full bg-black/90 border border-red-500 text-xs font-brawl text-red-300">
              {chosenStartup.name} (SOLO FOUNDER • 0 ENERGY)
            </div>
          </div>

          {/* Judges Desk */}
          <div className="absolute bottom-0 inset-x-0 h-9 bg-slate-950/90 border-t-2 border-red-500/30 flex items-center justify-around px-8 text-xs font-brawl text-red-200/80">
            <span>👨‍💼 VC PARTNER</span>
            <span>👩‍💼 ANGEL INVESTOR</span>
            <span>👨‍🏫 SENIOR DEAN</span>
          </div>
        </div>

        {/* Montage Steps */}
        <div className="min-h-[120px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            
            {montageStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-2"
              >
                <div className="text-xs font-brawl text-sky-400 uppercase tracking-widest">
                  SLIDE 1: THE LONE FOUNDER'S PITCH
                </div>
                <p className="text-sm md:text-base text-gray-200 font-sans">
                  “I coded the backend, designed the UI, ran the ads, shot the reels, and answered customer support alone at 3 AM...”
                </p>
              </motion.div>
            )}

            {montageStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-2"
              >
                <div className="text-xs font-brawl text-yellow-400 uppercase tracking-widest flex items-center justify-center gap-1">
                  <AlertOctagon className="w-4 h-4 text-yellow-400" />
                  <span>JUDGES QUESTIONING</span>
                </div>
                <p className="text-sm md:text-base text-gray-200 font-sans">
                  Lead VC: “Your idea has genuine spark. But you are one burnt-out student trying to be an entire company. Startup success rate is crashing to 0%. Bugs are piling up. You cannot scale alone.”
                </p>
              </motion.div>
            )}

            {montageStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="brawl-badge bg-red-600 text-white border-white text-xs px-3 py-1 animate-pulse">
                  <XCircle className="w-4 h-4 text-white" />
                  <span>VERDICT: DEFEAT — PITCH REJECTED!</span>
                </div>

                <p className="brawl-text text-lg sm:text-xl text-white">
                  “STARTUPS ARE AN ECOSYSTEM SPORT. A LONE FOUNDER BURNS OUT!”
                </p>

                <button
                  onClick={() => {
                    sound.playClick();
                    finishPitchMontage();
                  }}
                  className="py-3.5 px-8 brawl-btn brawl-btn-yellow text-sm tracking-wider flex items-center justify-center gap-2 mx-auto"
                >
                  <span>HOW TO FIX THIS? ➔</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>

  </div>
  );
};
