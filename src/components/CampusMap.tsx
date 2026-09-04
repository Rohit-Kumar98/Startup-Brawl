import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Code2, 
  Palette, 
  PenTool, 
  TrendingUp, 
  Video, 
  AlertTriangle, 
  Briefcase, 
  Trophy,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const stationIcons = [
  Compass,      // 0 Mentorship
  Code2,        // 1 Tech
  Palette,      // 2 Design
  PenTool,      // 3 Content
  TrendingUp,   // 4 Marketing
  Video,        // 5 Media
  AlertTriangle,// 6 PR
  Briefcase,    // 7 BD
  Trophy        // 8 Pitch
];

export const CampusMap: React.FC = () => {
  const { currentStageIndex, proceedFromMapToStage, chosenStartup } = useGame();
  const currentStage = ecellConfig.stages[currentStageIndex];

  // Auto-advance after a fast, punchy 2.2 second journey preview if user doesn't click
  useEffect(() => {
    const timer = setTimeout(() => {
      proceedFromMapToStage();
    }, 2400);
    return () => clearTimeout(timer);
  }, [proceedFromMapToStage, currentStageIndex]);

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden">
      
      {/* Background Campus Grid Grid Lines & Ambient Glow */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-2">
          <span>{ecellConfig.clubShortName} CAMPUS MAP</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
          Navigating to: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">{currentStage.locationName}</span>
        </h2>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          {currentStage.departmentName} is ready to mentor <span className="text-white font-semibold">{chosenStartup?.name}</span>.
        </p>
      </div>

      {/* Stylized Campus Circuit Nodes */}
      <div className="relative z-10 w-full max-w-5xl my-auto py-6">
        
        {/* Connected Circuit Line */}
        <div className="relative grid grid-cols-3 md:grid-cols-9 gap-3 md:gap-2 items-center">
          
          {ecellConfig.stages.map((stage, idx) => {
            const Icon = stationIcons[idx];
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center relative group">
                
                {/* Node Box */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ 
                    scale: isCurrent ? 1.15 : 1, 
                    opacity: 1,
                    y: isCurrent ? -6 : 0
                  }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-b from-cyan-900/90 to-slate-900 border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)]'
                      : isCompleted
                      ? 'bg-slate-900/90 border border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950/70 border border-slate-800 text-gray-500'
                  }`}
                >
                  {/* Status Indicator Pill */}
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-0.5" />
                  ) : (
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 mb-0.5 ${isCurrent ? 'text-cyan-300 animate-pulse' : ''}`} />
                  )}

                  <span className="text-[9px] font-mono font-bold tracking-tight text-center line-clamp-1">
                    {stage.departmentName.split(' ')[0]}
                  </span>

                  {/* Player Avatar on Current Station */}
                  {isCurrent && (
                    <motion.div 
                      layoutId="player-avatar"
                      className="absolute -top-3 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-rose-500 text-black text-[10px] font-black rounded-full shadow-lg flex items-center gap-1"
                    >
                      <span>YOU</span>
                      <span className="text-[8px]">{chosenStartup?.icon}</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Subtitle label */}
                <div className="mt-2 text-center">
                  <div className={`text-[10px] font-mono ${isCurrent ? 'text-cyan-300 font-bold' : isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                    0{idx + 1}
                  </div>
                  <div className="text-[11px] font-medium text-gray-300 hidden md:block max-w-[80px] truncate">
                    {stage.locationName.split(' ')[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enter Station Action Button */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center mb-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={proceedFromMapToStage}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-3 group transition-all"
        >
          <span>ENTER {currentStage.locationName.toUpperCase()}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
        <span className="text-[11px] text-gray-400 mt-1.5 block">
          Auto-entering in 2 seconds...
        </span>
      </div>

    </div>
  );
};
