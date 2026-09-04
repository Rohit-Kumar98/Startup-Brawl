import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  AlertTriangle, 
  Timer,
  Bug,
  Trophy
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const StageHost: React.FC = () => {
  const { 
    currentStageIndex, 
    chosenStartup, 
    applyDecision, 
    lastOutcome, 
    advanceToNextStage, 
    phase, 
    openAskECellHelp,
    askECellUses,
    stats
  } = useGame();

  const currentStage = ecellConfig.stages[currentStageIndex];

  // Mini-Game 1: Survey Tap Blitz (Canteen)
  const [surveyScore, setSurveyScore] = useState<number>(0);
  const [surveyTimeLeft, setSurveyTimeLeft] = useState<number>(6);
  const [surveyBubbles, setSurveyBubbles] = useState<Array<{
    id: number;
    text: string;
    isGood: boolean;
    x: number;
    y: number;
  }>>([]);

  // Mini-Game 2: Code Smash & Bug Whack (Tech Lab)
  const [codeProgress, setCodeProgress] = useState<number>(0);
  const [bugs, setBugs] = useState<Array<{ id: number; name: string; x: number; y: number }>>([]);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);

  // Mini-Game 3: Brand Skin Forge (Design Studio)
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  // Mini-Game 4: Viral Power Gauge (Content Room)
  const [gaugeValue, setGaugeValue] = useState<number>(50);
  const [gaugeDirection, setGaugeDirection] = useState<'up' | 'down'>('up');
  const [gaugeStopped, setGaugeStopped] = useState<boolean>(false);

  // Mini-Game 5: Growth Chip Allocator (Marketing Hub)
  const [allocatedBudget, setAllocatedBudget] = useState<Record<string, number>>({
    social: 0,
    posters: 0,
    memes: 0,
    booth: 0,
  });

  // Mini-Game 6: Action Clapper Rush (Media Lab)
  const [lightingLevel, setLightingLevel] = useState<number>(20);
  const [focusLocked, setFocusLocked] = useState<boolean>(false);

  // Mini-Game 7: Crisis Red Alert (PR War Room)
  const [crisisTimeLeft, setCrisisTimeLeft] = useState<number>(6);

  // Reset states on stage change
  useEffect(() => {
    setSurveyScore(0);
    setSurveyTimeLeft(6);
    setCodeProgress(0);
    setBugs([]);
    setGaugeValue(40);
    setGaugeStopped(false);
    setLightingLevel(20);
    setFocusLocked(false);
    setCrisisTimeLeft(6);
    setSelectedBrandId(chosenStartup?.brandingOptions[0]?.id || '');
    setAllocatedBudget({ social: 0, posters: 0, memes: 0, booth: 0 });
  }, [currentStageIndex, chosenStartup]);

  // Stage 1: Survey Bubbles Spawner
  useEffect(() => {
    if (phase !== 'stage_active' || currentStageIndex !== 0) return;

    const spawnBubble = () => {
      const positiveLines = [
        "Take my money!", "Hostel need!", "Sign me up!", "10/10 idea!", "Need this ASAP!"
      ];
      const negativeLines = [
        "Play BGMI?", "Free samosa?", "Mid idea", "Skip class?"
      ];
      const isGood = Math.random() > 0.3;
      const text = isGood 
        ? positiveLines[Math.floor(Math.random() * positiveLines.length)]
        : negativeLines[Math.floor(Math.random() * negativeLines.length)];

      const newBubble = {
        id: Date.now() + Math.random(),
        text,
        isGood,
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 60) + 20,
      };

      setSurveyBubbles((prev) => [...prev.slice(-5), newBubble]);
    };

    const spawner = setInterval(spawnBubble, 700);
    const countdown = setInterval(() => {
      setSurveyTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          clearInterval(spawner);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawner);
      clearInterval(countdown);
    };
  }, [phase, currentStageIndex]);

  // Stage 4: Viral Needle Oscillator
  useEffect(() => {
    if (phase !== 'stage_active' || currentStageIndex !== 3 || gaugeStopped) return;

    const interval = setInterval(() => {
      setGaugeValue((prev) => {
        if (prev >= 96) {
          setGaugeDirection('down');
          return 95;
        }
        if (prev <= 4) {
          setGaugeDirection('up');
          return 5;
        }
        return gaugeDirection === 'up' ? prev + 6 : prev - 6;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [phase, currentStageIndex, gaugeStopped, gaugeDirection]);

  // Stage 7: Crisis Countdown Timer
  useEffect(() => {
    if (phase !== 'crisis_active') return;
    if (crisisTimeLeft <= 0) {
      applyDecision(
        { reputation: -25, score: -15, energy: -20 },
        "Frozen in Panic",
        "You hesitated and let rumors spin out of control across WhatsApp and Reddit!",
        "In a PR crisis, silence is treated as admission. IEC SOA's PR team drafts immediate containment statements."
      );
      return;
    }
    const timer = setInterval(() => {
      setCrisisTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, crisisTimeLeft, chosenStartup, applyDecision]);

  if (!chosenStartup) return null;

  // -------------------------------------------------------------
  // RENDER: BRAWL ROUND COMPLETE / OUTCOME SCREEN
  // -------------------------------------------------------------
  if (phase === 'stage_outcome' && lastOutcome) {
    return (
      <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 md:p-8 select-none">
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 w-full max-w-2xl brawl-card p-6 md:p-8 border-4 border-sky-400 border-b-8 border-b-sky-700 shadow-[0_0_50px_rgba(56,189,248,0.35)]"
        >
          {/* Header Ribbon */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="brawl-badge bg-yellow-400 text-black border-black text-xs py-1 px-3">
              <Trophy className="w-4 h-4 fill-black" />
              ROUND COMPLETED • {currentStage?.departmentName || 'STAGE'}
            </span>

            <span className="brawl-font text-xs text-sky-400 tracking-wider">
              STAGE {currentStageIndex + 1} OF 9
            </span>
          </div>

          {/* Big Outcome Title */}
          <h2 className="brawl-text text-2xl md:text-3xl text-white mb-2">
            {lastOutcome.choiceTitle}
          </h2>

          {/* Narrative Result */}
          <div className="bg-[#090e1e] p-4 rounded-2xl border-2 border-[#1e293b] mb-5">
            <p className="text-sm md:text-base text-gray-200 leading-relaxed font-sans">
              {lastOutcome.narrative}
            </p>
          </div>

          {/* DYNAMIC STARTUP SUCCESS RATE BAR */}
          <div className="p-3.5 rounded-2xl bg-[#060a18] border-2 border-[#1e293b] mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="brawl-text text-xs text-gray-300 tracking-wider">
                STARTUP SUCCESS RATE:
              </span>
              <span className="brawl-text text-base text-yellow-400">
                {Math.max(0, Math.min(100, stats.score))}%
              </span>
            </div>
            <div className="relative w-full h-6 bg-[#090d19] rounded-full border-2 border-black overflow-hidden p-0.5 shadow-inner">
              <div className="w-full h-full bg-[#050711] rounded-full overflow-hidden relative">
                <div
                  style={{ width: `${Math.max(0, Math.min(100, stats.score))}%` }}
                  className="h-full bg-gradient-to-r from-yellow-400 via-amber-300 to-sky-400 rounded-full relative"
                />
              </div>
            </div>
          </div>

          {/* IEC SOA Wing Takeaway Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 via-indigo-950/60 to-purple-950/80 border-2 border-[#38bdf8] mb-6 shadow-md">
            <div className="flex items-center gap-2 text-yellow-300 font-brawl text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>THE IEC SOA ECOSYSTEM LESSON</span>
            </div>
            <p className="text-xs md:text-sm text-sky-100 font-medium italic font-sans">
              “{lastOutcome.ecellTakeaway}”
            </p>
          </div>

          {/* Next Stage Push Button */}
          <button
            onClick={() => {
              sound.playClick();
              advanceToNextStage();
            }}
            className="w-full py-4 brawl-btn brawl-btn-yellow text-base tracking-wider flex items-center justify-center gap-3"
          >
            <span>NEXT BATTLEGROUND</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: CRISIS PR RED-ALERT QTE (STAGE 7)
  // -------------------------------------------------------------
  if (phase === 'crisis_active') {
    const crisis = chosenStartup.crisisType;

    return (
      <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 md:p-8 select-none">
        <div className="absolute inset-0 bg-red-950/30 animate-pulse pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-2xl brawl-card p-6 md:p-8 border-4 border-red-500 border-b-8 border-b-red-800 shadow-[0_0_60px_rgba(239,68,68,0.5)]"
        >
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-red-900/50">
            <div className="flex items-center gap-2 bg-red-600 border-2 border-black text-white font-brawl px-3 py-1 rounded-xl text-xs tracking-wider animate-bounce">
              <AlertTriangle className="w-4 h-4" />
              <span>EMERGENCY CRISIS!</span>
            </div>

            <div className="flex items-center gap-2 font-brawl text-sm text-red-300">
              <Timer className="w-4 h-4 text-yellow-400 animate-spin" />
              <span>00:{crisisTimeLeft < 10 ? `0${crisisTimeLeft}` : crisisTimeLeft}s LEFT!</span>
            </div>
          </div>

          <h2 className="brawl-text text-2xl md:text-3xl text-white mb-2">
            {crisis.title}
          </h2>

          <p className="text-xs md:text-sm text-red-100 leading-relaxed mb-6 bg-black/50 p-4 rounded-xl border border-red-500/30 font-sans">
            {crisis.description}
          </p>

          <div className="brawl-text text-xs text-yellow-400 mb-3 tracking-wider">
            QUICK TIME EVENT: SLAM YOUR RESPONSE STRATEGY!
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => {
                sound.playNegative();
                applyDecision(
                  { reputation: crisis.consequences.choiceA.repDelta, score: -15 },
                  crisis.consequences.choiceA.label,
                  crisis.consequences.choiceA.text,
                  "Public relations requires emotional discipline. IEC SOA teaches founders never to flame customers."
                );
              }}
              className="p-4 rounded-xl bg-[#1e1014] hover:bg-[#2d121b] border-2 border-red-800 hover:border-red-400 text-left transition-all group active:translate-y-1"
            >
              <div className="brawl-text text-sm text-red-300 group-hover:text-white">
                A) {crisis.consequences.choiceA.label}
              </div>
              <div className="text-xs text-gray-400 font-sans mt-1">
                Aggressive defense, flame the haters on Reddit and hostel groups.
              </div>
            </button>

            <button
              onClick={() => {
                sound.playNegative();
                applyDecision(
                  { reputation: crisis.consequences.choiceB.repDelta, users: crisis.consequences.choiceB.userDelta, score: -10 },
                  crisis.consequences.choiceB.label,
                  crisis.consequences.choiceB.text,
                  "Silence creates a vacuum for rumors. IEC SOA PR helps you steer the narrative."
                );
              }}
              className="p-4 rounded-xl bg-[#181318] hover:bg-[#261c27] border-2 border-purple-900 hover:border-purple-400 text-left transition-all group active:translate-y-1"
            >
              <div className="brawl-text text-sm text-purple-300 group-hover:text-white">
                B) {crisis.consequences.choiceB.label}
              </div>
              <div className="text-xs text-gray-400 font-sans mt-1">
                Ghost everyone, turn off phone, pray the exam week distracts students.
              </div>
            </button>

            <button
              onClick={() => {
                sound.playPositive();
                applyDecision(
                  { reputation: crisis.consequences.choiceC.repDelta, score: 20 },
                  crisis.consequences.choiceC.label,
                  crisis.consequences.choiceC.text,
                  "IEC SOA PR turns disasters into user loyalty through total transparency and actionable remediation."
                );
              }}
              className="p-4 rounded-xl bg-[#0d221c] hover:bg-[#123129] border-2 border-emerald-600 hover:border-emerald-400 text-left transition-all group active:translate-y-1"
            >
              <div className="brawl-text text-sm text-emerald-300 group-hover:text-white">
                C) {crisis.consequences.choiceC.label}
              </div>
              <div className="text-xs text-gray-400 font-sans mt-1">
                Own the mistake transparently, issue immediate refund credits & public postmortem.
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: ACTIVE ARCADE MINI-GAME BY STAGE
  // -------------------------------------------------------------
  return (
    <div className={`relative min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 md:p-8 max-w-5xl mx-auto select-none ${isScreenShaking ? 'animate-shake' : ''}`}>
      
      {/* Top Mentor Card Header */}
      <div className="relative z-10 brawl-card p-4 sm:p-5 border-3 border-sky-400 border-b-6 border-b-sky-700 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-900 border-2 border-white flex items-center justify-center text-3xl shadow-md">
              {currentStage.mentorAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="brawl-badge bg-sky-950 text-sky-300 border-sky-500 text-[10px] py-0 px-2">
                  {currentStage.departmentName}
                </span>
              </div>
              <h2 className="brawl-text text-lg sm:text-xl text-white">
                {currentStage.mentorName}
              </h2>
              <div className="text-xs text-sky-200/80 font-sans">
                {currentStage.mentorRole}
              </div>
            </div>
          </div>

          {askECellUses > 0 && (
            <button
              onClick={openAskECellHelp}
              className="brawl-btn brawl-btn-yellow text-xs px-3 py-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              <span>ASK MENTOR ({askECellUses})</span>
            </button>
          )}
        </div>

        <div className="mt-3 p-3 rounded-xl bg-[#090e1d] border border-[#1e293b] text-xs sm:text-sm text-sky-100 italic font-sans">
          “{currentStage.mentorDialogue}”
        </div>
      </div>

      {/* 1. STAGE 1 (CANTEEN): SURVEY TAP BLITZ */}
      {currentStageIndex === 0 && (
        <div className="relative z-10 my-auto">
          <div className="brawl-card p-6 border-3 border-yellow-400 border-b-6 border-b-yellow-700 bg-[#090e1f]">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-800">
              <div>
                <div className="brawl-text text-yellow-400 text-lg sm:text-xl">
                  SURVEY TAP BLITZ! 🎯
                </div>
                <div className="text-xs text-gray-300 font-sans">
                  Tap green student responses! Avoid distractions before the clock hits 0!
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="brawl-badge bg-yellow-400 text-black border-black text-xs">
                  SURVEYS: {surveyScore}/5
                </div>
                <div className="brawl-badge bg-red-600 text-white border-black text-xs">
                  ⏱️ {surveyTimeLeft}s
                </div>
              </div>
            </div>

            <div className="relative w-full h-64 sm:h-72 bg-[#060814] rounded-2xl border-2 border-[#1e293b] overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

              {surveyBubbles.map((bubble) => (
                <button
                  key={bubble.id}
                  onClick={() => {
                    if (bubble.isGood) {
                      sound.playPositive();
                      setSurveyScore((prev) => prev + 1);
                    } else {
                      sound.playNegative();
                      setSurveyScore((prev) => Math.max(0, prev - 1));
                    }
                    setSurveyBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
                  }}
                  style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-2xl font-brawl text-xs shadow-lg border-2 active:scale-95 transition-transform ${
                    bubble.isGood
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white shadow-emerald-500/50'
                      : 'bg-gradient-to-r from-slate-700 to-slate-800 text-gray-300 border-slate-600'
                  }`}
                >
                  <span>{bubble.isGood ? '💬 ' : '🙅 '}</span>
                  <span>{bubble.text}</span>
                </button>
              ))}

              {(surveyTimeLeft === 0 || surveyScore >= 5) && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                  <div className="brawl-text text-2xl text-yellow-400 mb-2">
                    {surveyScore >= 5 ? "SURVEY FRENZY ACED! 🔥" : "TIME'S UP!"}
                  </div>
                  <p className="text-xs text-gray-300 max-w-sm text-center mb-4 font-sans">
                    You gathered {surveyScore} validation points alone across 4 hostel blocks. Energy exhausted!
                  </p>
                  <button
                    onClick={() => {
                      sound.playSuccessFanfare();
                      applyDecision(
                        { mentorship: 45, score: 20, energy: -25, users: surveyScore * 30 },
                        "Exhausting Solo Survey Blitz",
                        `You personally gathered ${surveyScore} student surveys in the canteen. Real customer validation proved the need, but running 50 surveys alone drained your stamina.`,
                        "IEC SOA's Research & Mentorship team coordinates campus-wide validation surveys in hours so you don't burn out."
                      );
                    }}
                    className="brawl-btn brawl-btn-yellow text-sm py-3 px-8"
                  >
                    COMPLETE VALIDATION ➔
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. STAGE 2 (TECH LAB): CODE SMASH & BUG SLAM */}
      {currentStageIndex === 1 && (
        <div className="relative z-10 my-auto">
          <div className="brawl-card p-6 border-3 border-sky-400 border-b-6 border-b-sky-700 bg-[#090e1f]">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-800">
              <div>
                <div className="brawl-text text-sky-400 text-lg sm:text-xl">
                  CODE SMASH: SHIP THE MVP! 💻
                </div>
                <div className="text-xs text-gray-300 font-sans">
                  Mash the button to write code! Whack bugs as they crawl out!
                </div>
              </div>

              <div className="brawl-badge bg-sky-400 text-black border-black text-xs">
                PROGRESS: {codeProgress}%
              </div>
            </div>

            <div className="w-full h-5 bg-slate-900 rounded-full border-2 border-black overflow-hidden mb-6 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 rounded-full transition-all duration-75"
                style={{ width: `${codeProgress}%` }}
              />
            </div>

            <div className="relative h-44 bg-[#060814] rounded-2xl border-2 border-[#1e293b] flex items-center justify-center overflow-hidden mb-4">
              
              {bugs.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    sound.playClick();
                    setBugs((prev) => prev.filter((x) => x.id !== b.id));
                  }}
                  style={{ left: `${b.x}%`, top: `${b.y}%` }}
                  className="absolute p-2 bg-red-600 border-2 border-white rounded-xl text-white font-brawl text-xs animate-bounce shadow-lg"
                >
                  <Bug className="w-4 h-4 inline mr-1" />
                  <span>{b.name}</span>
                </button>
              ))}

              {codeProgress < 100 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setCodeProgress((prev) => Math.min(100, prev + 12));
                    if (Math.random() > 0.45) {
                      const bugNames = ["Memory Leak", "502 Gateway", "Null Pointer", "CSS Crash"];
                      setBugs((prev) => [
                        ...prev.slice(-3),
                        {
                          id: Date.now() + Math.random(),
                          name: bugNames[Math.floor(Math.random() * bugNames.length)],
                          x: Math.floor(Math.random() * 70) + 15,
                          y: Math.floor(Math.random() * 60) + 20,
                        }
                      ]);
                      setIsScreenShaking(true);
                      setTimeout(() => setIsScreenShaking(false), 300);
                    }
                  }}
                  className="py-5 px-10 brawl-btn brawl-btn-yellow text-base sm:text-lg tracking-wider"
                >
                  <span>MASH TO CODE! ⚡ ({codeProgress}%)</span>
                </button>
              ) : (
                <div className="text-center">
                  <div className="brawl-text text-xl text-emerald-400 mb-2">
                    MVP CODEBASE SHIPPED! 🚀
                  </div>
                  <button
                    onClick={() => {
                      sound.playSuccessFanfare();
                      applyDecision(
                        { product: 50, score: 20, energy: -35 },
                        "Sleepless Solo Dev Sprint",
                        "You hammered out frontend + backend alone at 4 AM. The prototype works, but technical debt and unpatched edge cases threaten to explode under load.",
                        "IEC SOA's Tech Lab provides dedicated full-stack peers, architecture reviews, and DevOps so code doesn't crumble."
                      );
                    }}
                    className="brawl-btn brawl-btn-green text-sm py-3 px-8"
                  >
                    DEPLOY MVP ➔
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 3. STAGE 3 (DESIGN STUDIO): BRAWLER SKIN & LOGO FORGE */}
      {currentStageIndex === 2 && (
        <div className="relative z-10 my-auto">
          <div className="brawl-card p-6 border-3 border-fuchsia-400 border-b-6 border-b-fuchsia-700 bg-[#090e1f]">
            
            <div className="mb-4 pb-3 border-b-2 border-slate-800">
              <div className="brawl-text text-fuchsia-400 text-lg sm:text-xl">
                BRAWLER SKIN & BRAND FORGE 🎨
              </div>
              <div className="text-xs text-gray-300 font-sans">
                Select your brand visual identity kit to equip your startup brawler!
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {chosenStartup.brandingOptions.map((brand) => {
                const isSelected = selectedBrandId === brand.id;

                return (
                  <div
                    key={brand.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedBrandId(brand.id);
                    }}
                    className={`brawl-card p-4 cursor-pointer transition-all border-3 ${
                      isSelected
                        ? 'border-yellow-400 bg-purple-950/70 scale-105 shadow-[0_0_25px_rgba(250,204,21,0.5)]'
                        : 'border-[#1e293b] hover:border-fuchsia-400'
                    }`}
                  >
                    <div className={`w-full h-24 rounded-xl bg-gradient-to-tr ${brand.stylePreview} p-3 flex flex-col justify-between mb-3 shadow`}>
                      <span className="brawl-text text-xs text-white drop-shadow">
                        {chosenStartup.icon} {brand.visualPreview.vibe}
                      </span>
                      <span className="text-[10px] font-mono bg-black/60 px-2 py-0.5 rounded text-white self-start">
                        {brand.visualPreview.fontStyle}
                      </span>
                    </div>

                    <h4 className="brawl-text text-sm text-white mb-1">{brand.name}</h4>
                    <p className="text-[11px] text-gray-300 leading-tight font-sans">{brand.description}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                const picked = chosenStartup.brandingOptions.find((b) => b.id === selectedBrandId) || chosenStartup.brandingOptions[0];
                sound.playSuccessFanfare();
                applyDecision(
                  { brand: picked.brandDelta, score: picked.scoreDelta, energy: -15 },
                  `Equipped ${picked.name}`,
                  `You forged the ${picked.name} identity kit. The aesthetic resonated with early campus adopters!`,
                  "IEC SOA's Design Studio crafts cohesive visual languages, logos, and UI components in Figma."
                );
              }}
              className="w-full py-4 brawl-btn brawl-btn-purple text-sm tracking-wider"
            >
              EQUIP BRAND SKIN & PROCEED ➔
            </button>

          </div>
        </div>
      )}

      {/* 4. STAGE 4 (CONTENT ROOM): VIRAL TIMING GAUGE */}
      {currentStageIndex === 3 && (
        <div className="relative z-10 my-auto">
          <div className="brawl-card p-6 border-3 border-yellow-400 border-b-6 border-b-yellow-700 bg-[#090e1f]">
            
            <div className="mb-4 pb-3 border-b-2 border-slate-800">
              <div className="brawl-text text-yellow-400 text-lg sm:text-xl">
                VIRAL POWER CANNON 📢
              </div>
              <div className="text-xs text-gray-300 font-sans">
                Stop the oscillating needle in the green VIRAL ZONE (65%–85%) to launch the campus hook!
              </div>
            </div>

            <div className="relative w-full h-14 bg-slate-900 rounded-2xl border-3 border-black overflow-hidden mb-6 p-1">
              <div className="absolute inset-y-0 left-0 w-[65%] bg-gradient-to-r from-sky-900 to-indigo-900 opacity-60" />
              <div className="absolute inset-y-0 left-[65%] w-[20%] bg-emerald-500/80 border-x-2 border-white flex items-center justify-center">
                <span className="brawl-text text-[10px] text-black font-black">VIRAL ZONE</span>
              </div>
              <div className="absolute inset-y-0 left-[85%] right-0 bg-red-900/60" />
              <div 
                className="absolute top-0 bottom-0 w-3 bg-yellow-400 border-2 border-black rounded-full shadow-[0_0_15px_rgba(250,204,21,1)] transition-all duration-75"
                style={{ left: `${gaugeValue}%` }}
              />
            </div>

            {!gaugeStopped ? (
              <button
                onClick={() => {
                  setGaugeStopped(true);
                  const isHit = gaugeValue >= 65 && gaugeValue <= 85;
                  if (isHit) {
                    sound.playSuccessFanfare();
                  } else {
                    sound.playClick();
                  }
                }}
                className="w-full py-4 brawl-btn brawl-btn-yellow text-base tracking-wider"
              >
                SLAM TO LAUNCH VIRAL HOOK! 🎯
              </button>
            ) : (
              <div className="text-center">
                <div className="brawl-text text-xl mb-2 text-white">
                  {gaugeValue >= 65 && gaugeValue <= 85 ? (
                    <span className="text-emerald-400">🔥 PERFECT HIT! REEL WENT CAMPUS VIRAL! (+800 ATTENTION)</span>
                  ) : (
                    <span className="text-yellow-400">MODEST HIT: REACHED 250 STUDENTS</span>
                  )}
                </div>

                <button
                  onClick={() => {
                    const isHit = gaugeValue >= 65 && gaugeValue <= 85;
                    applyDecision(
                      { content: isHit ? 40 : 20, score: isHit ? 20 : 10, users: isHit ? 450 : 180 },
                      isHit ? "Viral Hook Cannon Master" : "Decent Reel Launch",
                      isHit 
                        ? "Your hook went viral on campus stories! But with no content pipeline, the algorithm will bury you in 48 hours."
                        : "The headline resonated with some classmates, but campus attention drifted quickly.",
                      "IEC SOA's Content & Editorial wing develops enduring story arcs, newsletters, and scripts so campus engagement doesn't die after one post."
                    );
                  }}
                  className="brawl-btn brawl-btn-green text-sm py-3 px-8"
                >
                  RECORD METRICS ➔
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 5. STAGE 5 (MARKETING HUB): GROWTH BUDGET ALLOCATOR */}
      {currentStageIndex === 4 && (
        <div className="relative z-10 my-auto">
          <div className="brawl-card p-6 border-3 border-emerald-400 border-b-6 border-b-emerald-700 bg-[#090e1f]">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-800">
              <div>
                <div className="brawl-text text-emerald-400 text-lg sm:text-xl">
                  GROWTH CHIP ALLOCATOR 📈
                </div>
                <div className="text-xs text-gray-300 font-sans">
                  Select campus growth channels to amplify your Startup Success Rate!
                </div>
              </div>

              {(() => {
                const totalActive = Object.values(allocatedBudget).filter((v) => v > 0).length;

                return (
                  <div className="brawl-badge bg-[#071711] text-emerald-300 border-emerald-500 text-xs">
                    ACTIVE CHANNELS: {totalActive} / 4
                  </div>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { key: 'social', name: '📱 Instagram Influencers', boost: 15 },
                { key: 'posters', name: '📜 Canteen Standees & Posters', boost: 8 },
                { key: 'memes', name: '🎭 Campus Meme Page Blitz', boost: 12 },
                { key: 'booth', name: '🍕 Free Pizza Demo Booth', boost: 10 },
              ].map((ch) => {
                const isSelected = (allocatedBudget[ch.key] || 0) > 0;

                return (
                  <div
                    key={ch.key}
                    onClick={() => {
                      sound.playClick();
                      const current = allocatedBudget[ch.key] || 0;
                      const next = current > 0 ? 0 : ch.boost;
                      setAllocatedBudget((prev) => ({ ...prev, [ch.key]: next }));
                    }}
                    className={`brawl-card p-4 cursor-pointer transition-all border-3 ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'border-[#1e293b] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="brawl-text text-sm text-white">{ch.name}</span>
                      <span className="brawl-badge bg-emerald-950 text-emerald-400 text-[10px] border-emerald-600">
                        ▲ +{ch.boost}%
                      </span>
                    </div>
                    <div className="text-xs text-sky-300 font-sans">
                      Direct Success Rate Boost
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                const totalBoost = Object.values(allocatedBudget).reduce((a, b) => a + b, 0);

                if (totalBoost === 0) {
                  alert("Tap at least 1 channel to allocate funds!");
                  return;
                }

                sound.playSuccessFanfare();
                applyDecision(
                  { score: totalBoost },
                  "Targeted Campus Distribution Campaign",
                  `Your campaigns supercharged campus reach! But managing 4 distribution channels alone leaves you no time to build the product.`,
                  "IEC SOA's Growth & Marketing wing operates a full street team and digital funnel so founders focus on product."
                );
              }}
              className="w-full py-4 brawl-btn brawl-btn-green text-sm tracking-wider"
            >
              DEPLOY GROWTH CHANNELS ➔
            </button>

          </div>
        </div>
      )}

      {/* 6. STAGE 6 (MEDIA LAB): ACTION CLAPPER RUSH */}
      {currentStageIndex === 5 && (
        <div className="relative z-10 my-auto">
          <div className="brawl-card p-6 border-3 border-pink-400 border-b-6 border-b-pink-700 bg-[#090e1f]">
            
            <div className="mb-4 pb-3 border-b-2 border-slate-800">
              <div className="brawl-text text-pink-400 text-lg sm:text-xl">
                ACTION CLAPPER RUSH! 🎬
              </div>
              <div className="text-xs text-gray-300 font-sans">
                Set lighting, lock camera focus, and SLAM the clapper board to film the commercial!
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              
              <button
                onClick={() => {
                  sound.playClick();
                  setLightingLevel(100);
                }}
                className={`p-4 rounded-xl border-3 font-brawl text-xs transition-all ${
                  lightingLevel === 100
                    ? 'bg-yellow-400 text-black border-white shadow-lg'
                    : 'bg-slate-900 text-gray-300 border-slate-700'
                }`}
              >
                <div className="text-2xl mb-1">💡</div>
                <span>1. {lightingLevel === 100 ? "STUDIO LIGHTS READY!" : "TAP TO SET LIGHTS"}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setFocusLocked(true);
                }}
                className={`p-4 rounded-xl border-3 font-brawl text-xs transition-all ${
                  focusLocked
                    ? 'bg-sky-400 text-black border-white shadow-lg'
                    : 'bg-slate-900 text-gray-300 border-slate-700'
                }`}
              >
                <div className="text-2xl mb-1">📷</div>
                <span>2. {focusLocked ? "4K FOCUS LOCKED!" : "TAP TO LOCK FOCUS"}</span>
              </button>

              <button
                disabled={lightingLevel !== 100 || !focusLocked}
                onClick={() => {
                  sound.playSuccessFanfare();
                  setIsScreenShaking(true);
                  setTimeout(() => setIsScreenShaking(false), 300);
                  applyDecision(
                    { media: 40, score: 20, users: 500, energy: -20 },
                    "Cinematic Promo Reveal",
                    "You directed, filmed, and edited the video alone. The production went viral on Instagram, but you collapsed with fatigue right before pitch day.",
                    "IEC SOA's Media Production team brings cinema cameras, gimbal operators, and editing rigs to create high-octane startup videos."
                  );
                }}
                className={`p-4 rounded-xl border-3 font-brawl text-xs transition-all ${
                  lightingLevel === 100 && focusLocked
                    ? 'brawl-btn-yellow text-black border-white animate-pulse'
                    : 'bg-slate-950 text-gray-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <div className="text-2xl mb-1">🎬</div>
                <span>3. SLAM CLAPPER!</span>
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 8. STAGE 8 (INVESTOR SUITE): SHARK TANK OFFERS */}
      {currentStageIndex === 7 && (
        <div className="relative z-10 my-auto">
          <div className="brawl-card p-6 border-3 border-yellow-400 border-b-6 border-b-yellow-700 bg-[#090e1f]">
            
            <div className="mb-4 pb-3 border-b-2 border-slate-800">
              <div className="brawl-text text-yellow-400 text-lg sm:text-xl">
                SHARK TANK TERM SHEET SUITE 🤝
              </div>
              <div className="text-xs text-gray-300 font-sans">
                Review capital offers from angels and VCs. Weigh equity dilution against mentorship!
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {ecellConfig.investorOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => {
                    sound.playSuccessFanfare();
                    applyDecision(
                      { funding: offer.fundingDelta, score: offer.scoreDelta, money: offer.cashValue },
                      offer.name,
                      offer.narrative,
                      "IEC SOA's Corporate Relations & BD wing guides founders through term sheets, founder dilution, and venture debt."
                    );
                  }}
                  className="brawl-card p-4 cursor-pointer hover:border-yellow-400 border-3 border-[#1e293b] flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="brawl-badge bg-emerald-950 text-emerald-400 border-emerald-500 text-[10px]">
                        {offer.equity}
                      </span>
                      <span className="brawl-text text-xs text-yellow-400">
                        {offer.amount}
                      </span>
                    </div>

                    <h4 className="brawl-text text-sm text-white mb-2">{offer.name}</h4>
                    <p className="text-[11px] text-gray-300 mb-3 font-sans">
                      {offer.pros}
                    </p>
                  </div>

                  <button className="w-full py-2.5 brawl-btn brawl-btn-yellow text-xs tracking-wide">
                    SIGN OFFER ➔
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="relative z-10 text-center text-[11px] text-sky-400/80 font-brawl tracking-wider">
        {ecellConfig.clubName} • STAGE {currentStageIndex + 1} OF 9
      </div>

    </div>
  );
};
