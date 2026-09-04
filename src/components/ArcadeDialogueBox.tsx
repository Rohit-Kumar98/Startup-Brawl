import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  HelpCircle, 
  Timer, 
  Trophy, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Navigation 
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

  // Interactive Card Selection States
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [crisisTimeLeft, setCrisisTimeLeft] = useState<number>(10);

  // Reset interactive selections on stage change
  useEffect(() => {
    setSelectedOptionIndex(0);
    setCrisisTimeLeft(10);
  }, [currentStageIndex]);

  // 10s Crisis countdown
  useEffect(() => {
    if (phase !== 'crisis_active') return;
    if (crisisTimeLeft <= 0) {
      const crisis = chosenStartup?.crisisType || ecellConfig.startups[0].crisisType;
      applyDecision(
        { score: -15 },
        crisis.consequences.choiceB.label,
        "Time ran out! Silence allowed rumors to spread unchecked across hostel groups.",
        "In PR, rapid transparency is the only way to manage a crisis."
      );
      return;
    }
    const timer = setInterval(() => setCrisisTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, crisisTimeLeft, chosenStartup, applyDecision]);

  // Keyboard controls for options - Quick 1-key answerable!
  useEffect(() => {
    if (phase !== 'stage_active' || !currentStage?.choices) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const choices = currentStage.choices;
      if (!choices || choices.length === 0) return;

      if (e.key === '1') {
        e.preventDefault();
        sound.playClick();
        const ch = choices[0];
        if (ch) applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect);
      } else if (e.key === '2' && choices.length > 1) {
        e.preventDefault();
        sound.playClick();
        const ch = choices[1];
        if (ch) applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect);
      } else if (e.key === '3' && choices.length > 2) {
        e.preventDefault();
        sound.playClick();
        const ch = choices[2];
        if (ch) applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setSelectedOptionIndex((prev) => (prev + 1) % choices.length);
        sound.playClick();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setSelectedOptionIndex((prev) => (prev - 1 + choices.length) % choices.length);
        sound.playClick();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const ch = choices[selectedOptionIndex] || choices[0];
        if (ch) {
          applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentStage, selectedOptionIndex, applyDecision]);

  if (!chosenStartup || !currentStage) return null;

  // Auto-dismiss outcome after 3.8 seconds if user doesn't click
  useEffect(() => {
    if (phase === 'stage_outcome') {
      const timer = setTimeout(() => {
        advanceToNextStage();
      }, 3800);
      return () => clearTimeout(timer);
    }
  }, [phase, advanceToNextStage]);

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

  // -----------------------------------------------------------------
  // 0. TRAVELING MODE (MAP JOURNEY): OPTIONS ARE HIDDEN!
  // -----------------------------------------------------------------
  if (phase === 'map_journey') {
    return (
      <div className="absolute bottom-4 inset-x-4 max-w-xl mx-auto z-30 pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-3.5 rounded-2xl bg-[#080d22]/90 border-2 border-[#38bdf8] border-b-4 border-b-[#0284c7] backdrop-blur-md shadow-2xl flex items-center justify-between gap-3 pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#38bdf8] to-[#1d4ed8] border-2 border-white flex items-center justify-center text-2xl shadow-md shrink-0 animate-bounce">
              {currentStage.mentorAvatar}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="brawl-text text-[11px] text-[#38bdf8]">
                  TRAVELING TO NEXT STATION:
                </span>
              </div>
              <div className="brawl-text text-sm sm:text-base text-white tracking-wide">
                {currentStage.locationName} • {currentStage.departmentName}
              </div>
              <div className="text-[11px] text-gray-300 font-sans">
                Walk into the glowing light beacon to unlock options!
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c142c] border border-sky-500/50 text-sky-300 font-brawl text-xs">
              <Navigation className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>FOLLOW CHEVRONS</span>
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
    const isPositive = lastOutcome.isCorrect !== undefined 
      ? lastOutcome.isCorrect 
      : ((lastOutcome.deltasSummary['Startup Score'] ?? 0) > 0);

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm select-none pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 25 }}
          className={`brawl-card w-full max-w-xl sm:max-w-2xl p-5 md:p-6 border-4 border-b-8 shadow-[0_0_50px_rgba(56,189,248,0.4)] max-h-[90vh] overflow-y-auto custom-scrollbar ${
            isPositive
              ? 'border-emerald-400 border-b-emerald-700 bg-[#071714] shadow-[0_0_50px_rgba(16,185,129,0.35)]'
              : 'border-rose-500 border-b-rose-800 bg-[#160a0f] shadow-[0_0_50px_rgba(244,63,94,0.35)]'
          }`}
        >
          {/* Header Ribbon */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className={`brawl-badge text-xs py-0.5 px-2.5 flex items-center gap-1.5 border-black ${
                isPositive ? 'bg-emerald-400 text-black' : 'bg-red-500 text-white'
              }`}>
                <Trophy className="w-3.5 h-3.5 fill-current" />
                <span>{isPositive ? 'STRATEGY VALIDATED' : 'TACTICAL MISSTEP'} • {currentStage.departmentName}</span>
              </span>
            </div>

            <span className="brawl-font text-xs text-sky-400 tracking-wider">
              {currentStage.locationName.toUpperCase()}
            </span>
          </div>

          {/* Outcome Choice Title */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="brawl-text text-lg sm:text-xl text-white">
              {lastOutcome.choiceTitle}
            </h3>
            <span className={`brawl-badge text-xs py-0.5 px-2.5 ${
              isPositive 
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500 animate-pulse' 
                : 'bg-rose-950 text-rose-300 border-rose-500'
            }`}>
              {isPositive ? '✅ BRILLIANT STRATEGY!' : '❌ ROOKIE TRAP DETECTED!'}
            </span>
          </div>

          {/* Narrative Result - High Contrast & Crisp Font */}
          <div className="bg-[#081228] p-4 rounded-xl border-2 border-sky-500/40 mb-4 text-sm sm:text-base text-white font-medium font-sans leading-relaxed shadow-sm">
            {lastOutcome.narrative}
          </div>

          {/* DYNAMIC SUCCESS RATE BAR METER (BIGGER & MORE VISIBLE) */}
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
                  isPositive ? 'bg-emerald-500 text-black border-black' : 'bg-red-600 text-white border-black'
                }`}>
                  {isPositive ? '▲ +20% SUCCESS BOOST' : '▼ -15% RUNWAY PENALTY'}
                </span>
              </div>
            </div>

            {/* 3D Success Rate Bar (Expanded) */}
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
  // 2. CRISIS PR EMERGENCY OVERLAY (STAGE 7)
  // -----------------------------------------------------------------
  if (phase === 'crisis_active') {
    const crisis = chosenStartup.crisisType;

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="brawl-card w-full max-w-xl sm:max-w-2xl p-5 md:p-6 border-4 border-red-500 border-b-8 border-b-red-800 shadow-[0_0_50px_rgba(239,68,68,0.4)] bg-[#0c0816] max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="brawl-badge bg-red-600 text-white border-black text-xs py-0.5 px-2.5 animate-pulse">
                🚨 PR RED ALERT
              </span>
              <span className="brawl-text text-sm sm:text-base text-white">{crisis.title}</span>
            </div>
            <div className="flex items-center gap-1.5 font-brawl text-xs font-bold text-red-400 bg-black/60 px-2.5 py-1 rounded-lg border border-red-800">
              <Timer className="w-3.5 h-3.5 text-red-400" />
              <span>00:{crisisTimeLeft < 10 ? `0${crisisTimeLeft}` : crisisTimeLeft}s</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-red-100 mb-4 bg-black/60 p-4 rounded-xl border border-red-900/60 font-sans font-medium leading-relaxed">
            {crisis.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <button
              onClick={() => {
                applyDecision(
                  { score: -15 },
                  "Aggressive Public Attack",
                  crisis.consequences.choiceA.text,
                  "Public Relations is about emotional self-control. IEC SOA PR helps steer the narrative.",
                  false
                );
              }}
              className="p-3.5 rounded-xl bg-[#1a0f15] hover:bg-[#281320] border-2 border-red-800 hover:border-red-400 text-left transition-all active:translate-y-0.5"
            >
              <div className="text-sm sm:text-base font-bold font-sans text-white">A) Attack Publicly</div>
              <div className="text-xs sm:text-sm text-slate-200 font-sans font-medium mt-1">Flame critics on hostel Reddit & blame Razorpay</div>
              <div className="brawl-badge bg-red-950 text-red-400 border-red-700 text-[9px] mt-2.5 inline-block">
                DEFENSIVE AGGRESSION
              </div>
            </button>

            <button
              onClick={() => {
                applyDecision(
                  { score: -15 },
                  "Mute & Ignore",
                  crisis.consequences.choiceB.text,
                  "Silence is seen as guilt. IEC SOA PR teaches proactive communication.",
                  false
                );
              }}
              className="p-3.5 rounded-xl bg-[#181120] hover:bg-[#261833] border-2 border-purple-900 hover:border-purple-400 text-left transition-all active:translate-y-0.5"
            >
              <div className="text-sm sm:text-base font-bold font-sans text-white">B) Ignore & Ghost</div>
              <div className="text-xs sm:text-sm text-slate-200 font-sans font-medium mt-1">Turn off phone and wait for drama to fade</div>
              <div className="brawl-badge bg-purple-950 text-purple-300 border-purple-700 text-[9px] mt-2.5 inline-block">
                PASSIVE SILENCE
              </div>
            </button>

            <button
              onClick={() => {
                applyDecision(
                  { score: 20 },
                  "Radical Transparency & Refund",
                  crisis.consequences.choiceC.text,
                  "IEC SOA PR turns disasters into user loyalty through total transparency and actionable remediation.",
                  true
                );
              }}
              className="p-3.5 rounded-xl bg-[#0c1f19] hover:bg-[#122e26] border-2 border-emerald-600 hover:border-emerald-400 text-left transition-all active:translate-y-0.5"
            >
              <div className="text-sm sm:text-base font-bold font-sans text-white">C) Transparent Refund</div>
              <div className="text-xs sm:text-sm text-slate-200 font-sans font-medium mt-1">Apologize publicly, refund 2x & deploy hotfix</div>
              <div className="brawl-badge bg-emerald-950 text-emerald-300 border-emerald-600 text-[9px] mt-2.5 inline-block">
                RADICAL ACCOUNTABILITY
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // 3. ARRIVED AT LOCATION: POP-UP WINDOW MODAL DIALOGUE & CHOICES
  // -----------------------------------------------------------------
  const choices = currentStage.choices || [];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        className="relative w-full max-w-xl sm:max-w-2xl brawl-card p-5 sm:p-6 border-4 border-sky-400 border-b-8 border-b-sky-700 shadow-[0_0_60px_rgba(56,189,248,0.45),0_25px_60px_rgba(0,0,0,0.95)] bg-[#070f26] text-white max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col justify-between"
      >
        {/* Top Window Header */}
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-sky-500/30">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 border-2 border-white flex items-center justify-center text-xl shadow-md shrink-0">
              {currentStage.mentorAvatar}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="brawl-badge bg-sky-400 text-black border-black text-xs py-0.5 px-2.5 font-black uppercase tracking-wider">
                  {currentStage.departmentName}
                </span>
                <span className="text-xs sm:text-sm font-bold text-sky-200 font-sans truncate">
                  • {currentStage.mentorName}
                </span>
              </div>
              <div className="text-[11px] font-bold text-sky-400 font-mono tracking-wider mt-0.5">
                📍 {currentStage.locationName.toUpperCase()}
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

        {/* Small Question Banner - High Contrast & High Visibility */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-950 via-[#0c1a40] to-[#0a1533] border-2 border-sky-400 mb-3.5 shadow-md">
          <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>TACTICAL QUESTION</span>
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-white font-sans leading-snug tracking-normal">
            {currentStage.question}
          </h2>
        </div>

        {/* 3 Small, Quick-Answer Option Buttons - High Contrast & High Visibility */}
        <div className="space-y-2.5 mb-3.5">
          {choices.map((ch, idx) => {
            const isSelected = selectedOptionIndex === idx;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  sound.playClick();
                  applyDecision(ch.deltas, ch.title, ch.outcomeNarrative, ch.ecellTakeaway, ch.isCorrect);
                }}
                onMouseEnter={() => setSelectedOptionIndex(idx)}
                className={`w-full group relative flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-yellow-400 bg-[#162758] shadow-[0_0_25px_rgba(250,204,21,0.3)] ring-2 ring-yellow-400 -translate-y-0.5'
                    : 'border-sky-500/40 bg-[#0c1636] hover:border-yellow-400 hover:bg-[#13224d]'
                }`}
              >
                {/* Hotkey Badge */}
                <div className={`w-8 h-8 rounded-xl border-2 font-mono font-black text-sm flex items-center justify-center shrink-0 transition-colors shadow ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-black'
                    : 'border-sky-400/50 bg-[#081026] text-sky-300 group-hover:bg-yellow-400 group-hover:text-black group-hover:border-black'
                }`}>
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`text-sm sm:text-base font-bold font-sans tracking-wide leading-snug transition-colors ${
                    isSelected ? 'text-yellow-300' : 'text-white group-hover:text-yellow-300'
                  }`}>
                    {ch.title}
                  </div>
                  <div className="text-xs sm:text-sm text-sky-100 font-sans font-medium leading-normal mt-0.5 transition-colors">
                    {ch.description}
                  </div>
                </div>

                {/* Instant Action Badge */}
                <div className="shrink-0">
                  <span className={`brawl-badge text-[10px] py-1 px-2.5 font-bold transition-all ${
                    isSelected
                      ? 'bg-yellow-400 text-black border-black opacity-100'
                      : 'bg-[#081026] text-sky-300 border-sky-400/50 opacity-0 group-hover:opacity-100'
                  }`}>
                    TAP ➔
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Answer Instructions & Shortcuts */}
        <div className="flex items-center justify-between pt-2.5 border-t border-sky-500/30 text-xs font-sans text-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-yellow-300 font-bold">QUICK ANSWER:</span>
            <span>Tap any option or press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">1</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">2</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-sky-400/60 text-yellow-300 font-mono font-bold text-xs">3</kbd></span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-sky-300 font-extrabold text-xs">
            <span>⚡ 1-TAP</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
