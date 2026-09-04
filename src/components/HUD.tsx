import React from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HUD: React.FC = () => {
  const { 
    stats, 
    chosenStartup, 
    currentStageIndex, 
    askECellUses, 
    openAskECellHelp, 
    isMuted, 
    toggleSound, 
    restartGame,
    floatingDeltas,
    phase
  } = useGame();

  if (phase === 'cinematic_intro' || phase === 'select_startup') {
    return null;
  }

  const currentStage = ecellConfig.stages[currentStageIndex];
  const successRate = Math.max(0, Math.min(100, stats.score));

  // Determine bar color theme dynamically
  const getTheme = (rate: number) => {
    if (rate >= 70) {
      return {
        barGradient: 'from-emerald-400 via-teal-300 to-cyan-400',
        textColor: 'text-emerald-300',
        statusLabel: '🔥 UNICORN TIER',
        statusBg: 'bg-emerald-950 text-emerald-300 border-emerald-500',
        glow: 'rgba(16, 185, 129, 0.4)',
        icon: TrendingUp,
      };
    }
    if (rate >= 40) {
      return {
        barGradient: 'from-yellow-400 via-amber-300 to-sky-400',
        textColor: 'text-yellow-300',
        statusLabel: '⚡ RUNWAY STABLE',
        statusBg: 'bg-amber-950 text-yellow-300 border-yellow-500',
        glow: 'rgba(250, 204, 21, 0.4)',
        icon: Activity,
      };
    }
    return {
      barGradient: 'from-rose-600 via-red-500 to-orange-500',
      textColor: 'text-rose-400',
      statusLabel: '⚠️ BURNOUT RISK',
      statusBg: 'bg-rose-950 text-rose-300 border-rose-500',
      glow: 'rgba(244, 63, 94, 0.5)',
      icon: TrendingDown,
    };
  };

  const theme = getTheme(successRate);
  const StatusIcon = theme.icon;

  return (
    <header className="sticky top-0 z-40 w-full px-3 py-2 bg-[#050711]/95 border-b-4 border-[#0e162e] backdrop-blur-xl shadow-[0_6px_25px_rgba(0,0,0,0.7)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* LEFT: BRAWLER FOUNDER PROFILE */}
        <div className="flex items-center gap-2 sm:gap-3">
          {chosenStartup && (
            <div className="flex items-center gap-2 bg-[#0b1227] border-2 border-[#38bdf8] border-b-4 border-b-[#0284c7] rounded-2xl px-2.5 py-1.5 shadow-md">
              
              {/* Avatar Frame with Star Power Badge */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#1d4ed8] border-2 border-white flex items-center justify-center text-2xl shadow-inner">
                  {chosenStartup.icon}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 border border-black rounded-md px-1 text-[9px] font-black text-black font-brawl shadow">
                  ★ 1
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="brawl-text text-xs sm:text-sm text-white tracking-wide">
                    {chosenStartup.name}
                  </span>
                  <span className="brawl-badge bg-[#240c31] border-[#c026d3] text-[#e879f9] text-[9px] py-0 px-1.5">
                    {chosenStartup.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className="text-[#38bdf8] font-brawl">[IEC SOA]</span>
                  <span className="text-gray-300 font-medium truncate max-w-[120px] sm:max-w-none">
                    • {currentStage?.departmentName || 'CAMPUS ARENA'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER & RIGHT: MASSIVE HIGH-VISIBILITY STARTUP SUCCESS RATE BAR */}
        <div className="flex-1 max-w-2xl flex flex-col items-center sm:items-end px-2">
          {/* Bar Header Details */}
          <div className="w-full flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className={`brawl-badge text-[10px] sm:text-xs py-0.5 px-2.5 border shadow-sm flex items-center gap-1.5 ${theme.statusBg}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{theme.statusLabel}</span>
              </span>
              <span className="hidden sm:inline brawl-text text-xs text-gray-300 tracking-wider">
                STARTUP RUNWAY
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="brawl-text text-xs sm:text-sm text-yellow-300">
                SUCCESS RATE:
              </span>
              <span className={`brawl-text text-base sm:text-2xl font-black ${theme.textColor}`}>
                {successRate}%
              </span>
            </div>
          </div>

          {/* The Dynamic 3D Up/Down Success Rate Bar (BIGGER & MORE VISIBLE) */}
          <div className="relative w-full h-8 sm:h-9 bg-[#090d1a] rounded-full border-3 border-black overflow-hidden p-0.5 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            {/* 3D Sunken Inner Track */}
            <div className="w-full h-full bg-[#050711] rounded-full overflow-hidden relative">
              {/* Dynamic Fill Bar with Spring Animation */}
              <motion.div
                initial={false}
                animate={{ width: `${successRate}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className={`h-full bg-gradient-to-r ${theme.barGradient} rounded-full relative shadow-[0_0_25px_var(--glow)]`}
                style={{
                  // @ts-expect-error CSS variable
                  '--glow': theme.glow,
                }}
              >
                {/* Top Gloss Reflection Line */}
                <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full" />
              </motion.div>

              {/* Subtle Ruler Tick Marks at 25%, 50%, 75% */}
              <div className="absolute inset-0 flex justify-between pointer-events-none px-6 opacity-35">
                <div className="w-0.5 h-full bg-white shadow-sm" />
                <div className="w-0.5 h-full bg-white shadow-sm" />
                <div className="w-0.5 h-full bg-white shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-3">

          {/* Action Buttons: Mentor, Mute, Restart */}
          <div className="flex items-center gap-1.5 ml-1">
            {phase === 'stage_active' && (
              <button
                onClick={openAskECellHelp}
                disabled={askECellUses <= 0}
                className={`brawl-btn px-2.5 py-1.5 text-xs text-black ${
                  askECellUses > 0 ? 'brawl-btn-yellow animate-pulse' : 'bg-slate-800 text-gray-500 cursor-not-allowed border-slate-700'
                }`}
                title="Ask IEC SOA Mentor (H)"
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1" />
                <span>HELP</span>
                <span className="ml-1 px-1 rounded bg-black text-yellow-300 text-[10px]">
                  {askECellUses}
                </span>
              </button>
            )}

            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-xl bg-[#0e162e] border-2 border-[#1e293b] border-b-4 border-b-[#060912] flex items-center justify-center text-gray-300 hover:text-white active:translate-y-0.5"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            </button>

            <button
              onClick={() => {
                if (window.confirm("Restart startup battle run?")) {
                  restartGame();
                }
              }}
              className="w-8 h-8 rounded-xl bg-[#0e162e] border-2 border-[#1e293b] border-b-4 border-b-[#060912] flex items-center justify-center text-gray-400 hover:text-rose-400 active:translate-y-0.5"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Floating Delta Popups */}
      <div className="fixed top-16 right-6 z-50 pointer-events-none flex flex-col gap-2">
        <AnimatePresence>
          {floatingDeltas.map((delta) => (
            <motion.div
              key={delta.id}
              initial={{ opacity: 0, y: -20, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.8 }}
              className={`px-3 py-1.5 rounded-xl brawl-text text-xs shadow-2xl border-2 flex items-center gap-1.5 ${
                delta.type === 'positive'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-400 shadow-emerald-500/50'
                  : 'bg-rose-950 text-rose-300 border-rose-400 shadow-rose-500/50'
              }`}
            >
              <span>{delta.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </header>
  );
};
