import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { getStartupChallenge } from '../config/startupChallenges';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Navigation,
  AlertCircle,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const ArcadeDialogueBox: React.FC = () => {
  const { 
    currentStageIndex, 
    chosenStartup, 
    applyDecision, 
    lastOutcome, 
    advanceToNextStage, 
    phase, 
    stats,
    openAskECellHelp,
    askECellUses
  } = useGame();

  const currentStage = ecellConfig.stages[currentStageIndex];

  // Retrieve official room challenge from content team
  const roomChallenge = useMemo(() => {
    if (!chosenStartup || !currentStage) return null;
    return getStartupChallenge(chosenStartup.id, currentStage.id);
  }, [chosenStartup, currentStage]);

  // Normalized choices
  const choices = useMemo(() => {
    if (roomChallenge) {
      return roomChallenge.choices.map((c) => ({
        id: c.id,
        letter: c.letter,
        title: `${c.letter}) ${c.text}`,
        text: c.text,
        ratingBadge: c.ratingBadge,
        scoreDelta: c.scoreDelta,
        deltas: { score: c.scoreDelta },
        isCorrect: c.isCorrect,
        outcomeNarrative: c.outcomeNarrative,
        ecellTakeaway: c.ecellTakeaway,
      }));
    }
    if (currentStage?.choices) {
      return currentStage.choices.map((c, idx) => ({
        id: c.id,
        letter: (['A', 'B', 'C'][idx] || 'A') as 'A' | 'B' | 'C',
        title: c.title,
        text: c.title,
        ratingBadge: c.isCorrect ? '🟢 +100%' : '🔴 −25%',
        scoreDelta: c.deltas?.score ?? 0,
        deltas: c.deltas,
        isCorrect: c.isCorrect,
        outcomeNarrative: c.outcomeNarrative,
        ecellTakeaway: c.ecellTakeaway,
      }));
    }
    return [];
  }, [roomChallenge, currentStage]);

  // Interactive Card Selection States (null by default so no option is pre-highlighted in yellow)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Reset interactive selections on stage change
  useEffect(() => {
    setSelectedOptionIndex(null);
  }, [currentStageIndex]);

  // Keyboard controls for options - Quick 1/A, 2/B, 3/C answerable!
  useEffect(() => {
    if (phase !== 'stage_active' || choices.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '1' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        sound.playClick();
        const ch = choices[0];
        if (ch) applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect, ch.ratingBadge);
      } else if ((e.key === '2' || e.key === 'b' || e.key === 'B') && choices.length > 1) {
        e.preventDefault();
        sound.playClick();
        const ch = choices[1];
        if (ch) applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect, ch.ratingBadge);
      } else if ((e.key === '3' || e.key === 'c' || e.key === 'C') && choices.length > 2) {
        e.preventDefault();
        sound.playClick();
        const ch = choices[2];
        if (ch) applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect, ch.ratingBadge);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setSelectedOptionIndex((prev) => (prev === null ? 0 : (prev + 1) % choices.length));
        sound.playChoiceHover();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedOptionIndex((prev) => (prev === null ? choices.length - 1 : (prev - 1 + choices.length) % choices.length));
        sound.playChoiceHover();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const ch = (selectedOptionIndex !== null ? choices[selectedOptionIndex] : null) || choices[0];
        if (ch) {
          applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect, ch.ratingBadge);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, choices, selectedOptionIndex, applyDecision]);

  if (!chosenStartup || !currentStage) return null;

  const successRate = Math.max(25, Math.min(75, stats.score));

  // Determine bar color theme dynamically
  const getTheme = (rate: number) => {
    if (rate >= 65) {
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
  const isPrRoom = currentStage.id === 'stage-pr';

  // -----------------------------------------------------------------
  // 0. TRAVELING MODE (MAP JOURNEY): COMPACT NON-BLOCKING NAVIGATION CHIP
  // -----------------------------------------------------------------
  if (phase === 'map_journey') {
    return (
      <div className="absolute bottom-4 left-4 z-30 pointer-events-none select-none max-w-sm sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="px-3.5 py-2 rounded-xl bg-[#080d22]/95 border-2 border-[#38bdf8] border-b-4 border-b-[#0284c7] backdrop-blur-md shadow-xl flex items-center gap-3 pointer-events-auto"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#38bdf8] to-[#1d4ed8] border border-white flex items-center justify-center text-lg shadow shrink-0">
            {currentStage.mentorAvatar}
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-black tracking-wider text-[#38bdf8] uppercase font-mono">
                ROOM TARGET:
              </span>
              <span className="text-[10px] font-extrabold text-yellow-300 uppercase font-mono">
                [{ecellConfig.buildingLocations[currentStageIndex]?.sectorCode || 'ROOM'}]
              </span>
            </div>
            <div className="text-xs font-bold text-white truncate font-sans">
              {currentStage.locationName} • <span className="text-yellow-300 font-mono font-bold">[E] ENTER</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 1. STAGE OUTCOME MODAL: HERO SUCCESS RATE BAR GOING UP / DOWN
  // -----------------------------------------------------------------
  if (phase === 'stage_outcome' && lastOutcome) {
    const scoreChange = lastOutcome.scoreDelta ?? 0;
    const isOptimal = scoreChange >= 8 || lastOutcome.ratingBadge?.includes('🟢');
    const isWrong = scoreChange < 0 || lastOutcome.isCorrect === false;

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          className={`brawl-card w-full max-w-xl sm:max-w-2xl p-5 md:p-6 border-4 border-b-8 max-h-[90vh] overflow-y-auto custom-scrollbar ${
            isWrong
              ? 'border-rose-500 border-b-rose-700 bg-[#0f0e1c] shadow-[0_0_40px_rgba(244,63,94,0.3)]'
              : isOptimal
              ? 'border-emerald-400 border-b-emerald-700 bg-[#091518] shadow-[0_0_40px_rgba(16,185,129,0.3)]'
              : 'border-amber-400 border-b-amber-700 bg-[#14120f] shadow-[0_0_40px_rgba(245,158,11,0.3)]'
          }`}
        >
          {/* Header Ribbon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`brawl-badge text-xs py-0.5 px-2.5 flex items-center gap-1.5 border-black ${
                isWrong
                  ? 'bg-rose-500 text-white font-bold'
                  : isOptimal 
                  ? 'bg-emerald-400 text-black font-bold' 
                  : 'bg-amber-400 text-black font-bold'
              }`}>
                {isWrong ? (
                  <>
                    <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>TACTICAL MISSTEP • {roomChallenge?.roomName || currentStage.departmentName}</span>
                  </>
                ) : isOptimal ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>STRATEGY VALIDATED • {roomChallenge?.roomName || currentStage.departmentName}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>SUBOPTIMAL MOVE • {roomChallenge?.roomName || currentStage.departmentName}</span>
                  </>
                )}
              </span>
            </div>

            {/* Official Content Team Rating Badge */}
            {lastOutcome.ratingBadge && (
              <span className="brawl-badge text-xs py-0.5 px-2.5 bg-black/80 text-yellow-300 border-yellow-400/60 font-mono font-bold tracking-wider">
                {lastOutcome.ratingBadge}
              </span>
            )}
          </div>

          {/* Outcome Choice Title & Clean Status Tag */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="brawl-text text-lg sm:text-xl text-white">
              {lastOutcome.choiceTitle}
            </h3>
            <span className={`brawl-badge text-xs py-0.5 px-2.5 ${
              isWrong 
                ? 'bg-rose-950 text-rose-300 border-rose-500' 
                : isOptimal 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 animate-pulse' 
                : 'bg-amber-950 text-yellow-300 border-yellow-500'
            }`}>
              {isWrong ? '❌ ROOKIE TRAP DETECTED' : isOptimal ? '🟢 STRATEGY VALIDATED' : '🟡 TRACTION WITH DOUBT'}
            </span>
          </div>

          {/* Narrative Result */}
          <div className={`p-4 rounded-xl border-2 mb-4 text-sm sm:text-base text-white font-medium font-sans leading-relaxed shadow-sm ${
            isWrong
              ? 'bg-[#170e17] border-rose-500/40'
              : isOptimal
              ? 'bg-[#081817] border-emerald-500/40'
              : 'bg-[#15120a] border-amber-500/40'
          }`}>
            {lastOutcome.narrative}
          </div>

          {/* DYNAMIC SUCCESS RATE BAR METER (UP/DOWN SCORE PROGRESSION) */}
          <div className="p-4 rounded-2xl bg-[#060a18] border-2 border-[#1e293b] mb-4 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-4 h-4 ${theme.textColor}`} />
                <span className="brawl-text text-xs sm:text-sm text-gray-300 tracking-wider">
                  STARTUP SUCCESS RATE:
                </span>
                <span className={`brawl-badge text-[10px] py-0.5 px-2 border ${theme.statusBg}`}>
                  {theme.statusLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`brawl-text text-xl sm:text-2xl font-black ${theme.textColor}`}>
                  {successRate}%
                </span>
                <span className={`brawl-badge text-xs py-0.5 px-2.5 font-black ${
                  isWrong
                    ? 'bg-rose-600 text-white border-black'
                    : isOptimal
                    ? 'bg-emerald-500 text-black border-black'
                    : 'bg-amber-400 text-black border-black'
                }`}>
                  {scoreChange > 0 ? `▲ +${scoreChange}% SCORE BOOST` : `▼ ${scoreChange}% RUNWAY HIT`}
                </span>
              </div>
            </div>

            {/* 3D Success Rate Bar */}
            <div className="relative w-full h-8 sm:h-9 bg-[#090d19] rounded-full border-3 border-black overflow-hidden p-0.5 shadow-inner">
              <div className="w-full h-full bg-[#050711] rounded-full overflow-hidden relative">
                <motion.div
                  initial={false}
                  animate={{ width: `${successRate}%` }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className={`h-full bg-gradient-to-r ${theme.barGradient} rounded-full relative shadow-[0_0_20px_rgba(56,189,248,0.5)]`}
                >
                  <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-full" />
                </motion.div>
                
                {/* 25%, 50%, 75% Ruler Markers */}
                <div className="absolute inset-0 flex justify-between pointer-events-none px-6 opacity-35">
                  <div className="w-0.5 h-full bg-white shadow-sm" />
                  <div className="w-0.5 h-full bg-white shadow-sm" />
                  <div className="w-0.5 h-full bg-white shadow-sm" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mt-1.5 px-1">
              <span>MIN: 25%</span>
              <span className="text-yellow-400">TARGET: 75%</span>
            </div>
          </div>

          {/* IEC SOA Ecosystem Lesson Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-950/70 via-indigo-950/50 to-purple-950/70 border border-[#38bdf8] mb-4">
            <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>THE IEC SOA LESSON</span>
            </div>
            <p className="text-sm text-sky-100 font-sans font-medium leading-relaxed">
              “{lastOutcome.ecellTakeaway}”
            </p>
          </div>

          {/* Action Push Button */}
          <button
            onClick={() => {
              sound.playClick();
              advanceToNextStage();
            }}
            className="w-full py-3 brawl-btn brawl-btn-yellow text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg"
          >
            <span>NEXT BATTLEGROUND</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </motion.div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 2. ACTIVE STAGE POP-UP: SITUATION + QUESTION + 3 OPTIONS (A, B, C)
  // -----------------------------------------------------------------
  const challengeTitle = roomChallenge?.challengeTitle || currentStage.locationName;
  const situationText = roomChallenge?.situation || currentStage.mentorDialogue;
  const questionText = roomChallenge?.question || currentStage.question;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className={`relative w-full max-w-xl sm:max-w-2xl brawl-card p-5 sm:p-6 border-4 border-b-8 max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col justify-between ${
          isPrRoom 
            ? 'border-red-500 border-b-red-800 shadow-[0_0_60px_rgba(239,68,68,0.45)] bg-[#0d0716]'
            : 'border-sky-400 border-b-sky-700 shadow-[0_0_60px_rgba(56,189,248,0.45),0_25px_60px_rgba(0,0,0,0.95)] bg-[#070f26]'
        }`}
      >
        {/* Top Window Header */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-sky-500/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-10 h-10 rounded-xl border-2 border-white flex items-center justify-center text-xl shadow-md shrink-0 ${
              isPrRoom ? 'bg-gradient-to-tr from-red-600 to-rose-700' : 'bg-gradient-to-tr from-sky-400 to-blue-600'
            }`}>
              {currentStage.mentorAvatar}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`brawl-badge text-black text-xs py-0.5 px-2.5 font-black uppercase tracking-wider ${
                  isPrRoom ? 'bg-red-500 text-white' : 'bg-sky-400'
                }`}>
                  {roomChallenge?.roomName ? roomChallenge.roomName.toUpperCase() : currentStage.departmentName}
                </span>
                <span className="text-xs sm:text-sm font-bold text-sky-200 font-sans truncate">
                  • {chosenStartup.name}
                </span>
              </div>
              <div className="text-[11px] font-bold text-sky-400 font-mono tracking-wider mt-0.5">
                ⚡ SECTOR: {ecellConfig.buildingLocations[currentStageIndex]?.sectorCode || 'SEC'} // “{challengeTitle}”
              </div>
            </div>
          </div>

          {askECellUses > 0 && (
            <button
              onClick={openAskECellHelp}
              className="text-xs font-brawl uppercase px-3 py-1.5 rounded-xl bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300 active:translate-y-0.5 transition-all shadow flex items-center gap-1.5 shrink-0"
              title="Get an E-Cell mentor hint"
            >
              <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>HINT ({askECellUses})</span>
            </button>
          )}
        </div>

        {/* 1. SITUATION CARD (WARM AMBER / GOLD INTEL BRIEFING) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#140e05] border-2 border-amber-500/80 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.15)] text-left">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-400 text-black font-black text-xs uppercase tracking-wider font-mono shadow-sm">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>SITUATION</span>
            </div>
            <span className="text-[11px] font-mono text-amber-300 font-extrabold tracking-wider">
              CHALLENGE: “{challengeTitle}”
            </span>
          </div>
          <p className="text-sm sm:text-base text-amber-50 font-sans font-medium leading-relaxed">
            {situationText}
          </p>
        </div>

        {/* 2. TACTICAL QUESTION CARD (ELECTRIC NEON CYAN / AZURE) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#051c2e] via-[#092a47] to-[#051c2e] border-2 border-cyan-400 mb-3.5 shadow-[0_0_25px_rgba(34,211,238,0.25)] text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-400 text-black font-black text-xs uppercase tracking-wider font-mono mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>TACTICAL QUESTION</span>
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-black text-white font-sans leading-snug tracking-normal">
            {questionText}
          </h2>
        </div>

        {/* 3. THREE QUICK-ANSWER CHOICES (A, B, C) (HOVER-ONLY YELLOW EFFECT) */}
        <div className="space-y-2.5 mb-3.5">
          {choices.map((ch, idx) => {
            const isKeyboardSelected = selectedOptionIndex === idx;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  sound.playClick();
                  applyDecision(
                    ch.deltas, 
                    ch.title, 
                    ch.outcomeNarrative, 
                    ch.ecellTakeaway, 
                    ch.isCorrect,
                    ch.ratingBadge
                  );
                }}
                onMouseEnter={() => {
                  sound.playChoiceHover();
                }}
                className={`w-full group relative flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isKeyboardSelected
                    ? 'border-yellow-400 bg-[#162758] shadow-[0_0_25px_rgba(250,204,21,0.3)] ring-2 ring-yellow-400 -translate-y-0.5'
                    : 'border-sky-500/40 bg-[#0c1636] hover:border-yellow-400 hover:bg-[#162758] hover:shadow-[0_0_25px_rgba(250,204,21,0.3)] hover:ring-2 hover:ring-yellow-400 hover:-translate-y-0.5'
                }`}
              >
                {/* Letter / Hotkey Badge */}
                <div className={`w-8 h-8 rounded-xl border-2 font-mono font-black text-sm flex items-center justify-center shrink-0 transition-colors shadow ${
                  isKeyboardSelected
                    ? 'bg-yellow-400 text-black border-black scale-105 shadow-md'
                    : 'border-sky-400/50 bg-[#081026] text-sky-300 group-hover:bg-yellow-400 group-hover:text-black group-hover:border-black group-hover:scale-105'
                }`}>
                  {ch.letter}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`text-sm sm:text-base font-bold font-sans tracking-wide leading-snug transition-colors ${
                    isKeyboardSelected ? 'text-yellow-300' : 'text-white group-hover:text-yellow-300'
                  }`}>
                    {ch.text}
                  </div>
                </div>

                {/* Instant Action Badge */}
                <div className="shrink-0">
                  <span className={`brawl-badge text-[10px] py-1 px-2.5 font-bold transition-all ${
                    isKeyboardSelected
                      ? 'bg-yellow-400 text-black border-black opacity-100'
                      : 'bg-[#081026] text-sky-300 border-sky-400/50 opacity-0 group-hover:opacity-100 group-hover:bg-yellow-400 group-hover:text-black group-hover:border-black'
                  }`}>
                    SELECT ➔
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Keyboard Shortcuts Helper */}
        <div className="flex items-center justify-between pt-2.5 border-t border-sky-500/30 text-xs font-sans text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-yellow-300 font-bold">HOTKEYS:</span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">A</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">1</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">B</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">2</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">C</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">3</kbd></span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-sky-300 font-extrabold text-xs">
            <span>⚡ INSTANT ANSWER</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
