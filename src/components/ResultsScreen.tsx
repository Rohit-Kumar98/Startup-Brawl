import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Skull,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const ResultsScreen: React.FC = () => {
  const { stats, chosenStartup, openECellReveal, restartGame } = useGame();
  const [showTwist, setShowTwist] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Forced final score in failure range (always losses)
  const finalSoloScore = Math.min(20, Math.max(12, stats.score - 35));

  useEffect(() => {
    sound.playFailureDrone();

    // After 2.5s, trigger the dramatic revelation twist
    const timer = setTimeout(() => {
      setShowTwist(true);
      sound.playClick();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Smoothly scroll down when dramatic twist appears so buttons are in clear view
  useEffect(() => {
    if (showTwist && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 150);
    }
  }, [showTwist]);

  if (!chosenStartup) return null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 sm:p-6 md:p-8 pb-14 md:pb-16 text-center select-none custom-scrollbar"
    >
      
      {/* Red Alert Defeat Atmosphere */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Defeat Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
        className="relative z-10 w-full max-w-3xl my-auto brawl-card p-5 sm:p-7 md:p-8 border-4 border-red-500 border-b-8 border-b-red-800 shadow-[0_0_50px_rgba(239,68,68,0.4)] bg-[#090a16]"
      >
        
        {/* Top Failure Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/90 border-2 border-red-500 text-xs font-brawl tracking-widest text-red-300 uppercase mb-3">
          <Skull className="w-4 h-4 text-red-400" />
          <span>RUNWAY EXPIRED • MATCH DEFEAT</span>
        </div>

        <h1 className="brawl-text text-3xl sm:text-5xl text-white tracking-tight">
          YOUR STARTUP <span className="text-red-500">FAILED.</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-lg mx-auto font-sans leading-relaxed">
          You pulled all-nighters, spent every bit of energy, and tried to conquer all 9 battlegrounds alone.
        </p>

        {/* HERO STARTUP SUCCESS RATE PLUMMET BAR */}
        <div className="my-6 p-4 rounded-2xl bg-[#060814] border-2 border-red-900/60 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="brawl-text text-xs text-red-400 tracking-wider">
                FINAL STARTUP SUCCESS RATE:
              </span>
            </div>
            <span className="brawl-text text-xl sm:text-2xl text-red-500">
              {finalSoloScore}%
            </span>
          </div>

          {/* 3D Success Rate Bar dropping to red */}
          <div className="relative w-full h-7 bg-[#090d19] rounded-full border-3 border-black overflow-hidden p-0.5 shadow-inner">
            <div className="w-full h-full bg-[#050711] rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: '65%' }}
                animate={{ width: `${finalSoloScore}%` }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 rounded-full relative shadow-[0_0_20px_rgba(239,68,68,0.6)]"
              >
                <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/60 to-transparent rounded-t-full" />
              </motion.div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 font-brawl mt-2 px-1">
            <span>0% CRITICAL FAIL</span>
            <span className="text-red-400">⚠️ STATUS: LONE FOUNDER BURNOUT</span>
            <span>100% UNICORN</span>
          </div>
        </div>

        {/* 3 Fatal Solo Bottlenecks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-4">
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-left">
            <div className="flex items-center gap-1.5 text-red-400 font-brawl text-xs mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>TECH DEBT CRASH</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans">
              Solo codebase couldn't handle live stress. Bugs crashed the MVP.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-left">
            <div className="flex items-center gap-1.5 text-red-400 font-brawl text-xs mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ZERO DISTRIBUTION</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans">
              No campus ground-crew or video team. Nobody heard about the app.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-left">
            <div className="flex items-center gap-1.5 text-red-400 font-brawl text-xs mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>FOUNDER OVERLOAD</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans">
              1 student attempted 8 distinct specialized professions at once.
            </p>
          </div>
        </div>

        {/* The Dramatic Pivot Twist Box */}
        <AnimatePresence>
          {showTwist && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/90 via-indigo-950/80 to-purple-950/90 border-2 border-[#38bdf8] my-5 text-center space-y-2 shadow-lg"
            >
              <div className="text-base sm:text-lg font-brawl text-yellow-300 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span>THAT'S NOT THE REAL LESSON!</span>
              </div>
              <p className="text-xs sm:text-sm text-sky-100 max-w-lg mx-auto leading-relaxed font-sans">
                Why did your startup fail? <strong className="text-white">Not because your idea was bad.</strong><br />
                It failed because <span className="text-[#38bdf8] font-semibold">startups are an ecosystem sport. Nobody scales to Unicorn alone.</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              restartGame();
            }}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#0d1326] hover:bg-[#141d3b] text-gray-400 hover:text-white text-xs font-brawl tracking-wider flex items-center justify-center gap-2 transition-colors border border-slate-700 active:translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY SOLO AGAIN</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sound.playSuccessFanfare();
              openECellReveal();
            }}
            className="w-full sm:w-auto py-3.5 px-8 brawl-btn brawl-btn-yellow text-sm tracking-wider flex items-center justify-center gap-2"
          >
            <span>REVEAL THE IEC SOA SECRET WEAPON</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </motion.button>
        </div>

      </motion.div>

    </div>
  );
};
