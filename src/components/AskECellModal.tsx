import React from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Lightbulb } from 'lucide-react';

export const AskECellModal: React.FC = () => {
  const { isHelpModalOpen, closeAskECellHelp, currentStageIndex, askECellUses } = useGame();
  const currentStage = ecellConfig.stages[currentStageIndex];

  if (!isHelpModalOpen || !currentStage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 md:p-8 border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.25)]"
        >
          {/* Close button */}
          <button
            onClick={closeAskECellHelp}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-2xl shadow-lg">
              {currentStage.mentorAvatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>E-CELL MENTORSHIP SOS</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {currentStage.mentorName}
              </h3>
              <div className="text-xs text-gray-400">
                {currentStage.mentorRole}
              </div>
            </div>
          </div>

          {/* Mentor Advice Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-300 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>INSIDER ADVICE:</span>
            </div>
            <p className="text-sm md:text-base text-gray-200 leading-relaxed font-medium">
              “{currentStage.mentorHint}”
            </p>
          </div>

          {/* Uses Remaining pill & Close */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-mono text-gray-400">
              Lifelines remaining: <span className="text-amber-400 font-bold">{askECellUses}</span>
            </span>

            <button
              onClick={closeAskECellHelp}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
            >
              GOT IT, THANKS!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
