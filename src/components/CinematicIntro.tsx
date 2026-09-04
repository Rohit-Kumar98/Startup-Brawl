import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lightbulb, Rocket, Trophy } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const CinematicIntro: React.FC = () => {
  const { startIntroduction } = useGame();
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Relaxed, readable pacing so students can comfortably read every line
    const timer1 = setTimeout(() => {
      setStep(1);
    }, 4000); // 4.0s for Step 0

    const timer2 = setTimeout(() => {
      setStep(2);
      sound.playClick();
    }, 8200); // 4.2s for Step 1

    const timer3 = setTimeout(() => {
      setStep(3);
      sound.playPositive();
    }, 13200); // 5.0s for Step 2

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#050711] flex flex-col items-center justify-center p-6 text-center overflow-hidden select-none">
      
      {/* Ambient background particles & cyber glow */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-[#38bdf8]/15 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] bg-[#c026d3]/15 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      {/* Skip / Next Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2.5 z-30">
        {step < 3 && (
          <button
            onClick={() => {
              sound.playClick();
              setStep((s) => Math.min(3, s + 1));
            }}
            className="text-xs font-brawl uppercase text-yellow-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-[#0e162e] border-2 border-yellow-500/60 border-b-4 border-b-amber-700 active:translate-y-0.5 transition-all"
            title="Next slide"
          >
            NEXT ➔
          </button>
        )}
        <button
          onClick={() => {
            sound.playClick();
            startIntroduction();
          }}
          className="text-xs font-brawl uppercase text-sky-400 hover:text-white px-3.5 py-1.5 rounded-xl bg-[#0e162e] border-2 border-[#1e293b] border-b-4 border-b-[#0a0f1d] active:translate-y-0.5 transition-all"
          title="Skip straight to startup selection"
        >
          SKIP INTRO ⏭️
        </button>
      </div>

      {/* Main Cinematic Sequence */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[380px]">
        
        <AnimatePresence mode="wait">
          
          {/* Step 0: "Every startup begins with something small..." */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <span className="brawl-badge bg-sky-950 text-sky-300 border-sky-400 text-xs py-1 px-3">
                {ecellConfig.clubName} ({ecellConfig.clubShortName})
              </span>
              <h1 className="brawl-text text-3xl md:text-5xl text-white tracking-wide leading-tight">
                EVERY STARTUP BEGINS WITH SOMETHING SMALL.
              </h1>
              <p className="text-xs sm:text-sm text-sky-200/80 font-sans">
                A spark of curiosity inside the hostel room...
              </p>
            </motion.div>
          )}

          {/* Step 1: "...An idea." */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-5"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-yellow-400 border-4 border-black flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.6)] animate-bounce">
                <Lightbulb className="w-10 h-10 text-black fill-black" />
              </div>
              <h1 className="brawl-text text-5xl md:text-7xl text-yellow-300 tracking-tight">
                AN IDEA! 💡
              </h1>
              <p className="brawl-font text-sky-200 text-base md:text-lg">
                “{ecellConfig.subtitle}”
              </p>
            </motion.div>
          )}

          {/* Step 2: Student Avatar on Campus thinking */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center space-y-5"
            >
              {/* Stylized Student Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-[#0e162e] border-4 border-sky-400 flex items-center justify-center text-5xl shadow-[0_0_35px_rgba(56,189,248,0.4)]">
                  🧑‍🎓
                </div>
                {/* Thought bubble */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="absolute -top-10 -right-32 bg-slate-900 border-2 border-yellow-400 text-yellow-300 text-xs px-3 py-1.5 rounded-2xl rounded-bl-none shadow-xl font-brawl"
                >
                  “I have an idea for campus...”
                </motion.div>
              </div>

              <div className="space-y-1.5">
                <p className="brawl-text text-xl md:text-2xl text-white">
                  SITTING IN HOSTEL, STARING AT A BLANK SCREEN...
                </p>
                <p className="text-sm md:text-base text-sky-200 font-sans italic">
                  “Where do I even start? Can I really do this alone?”
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Game Title Climax & Launch Button */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-5 max-w-xl"
            >
              <div className="brawl-badge bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500 text-xs py-1 px-3">
                <Trophy className="w-3.5 h-3.5 fill-current" />
                <span>{ecellConfig.orientationEvent}</span>
              </div>

              <h1 className="brawl-text text-4xl md:text-6xl text-white tracking-tight leading-none">
                STARTUP BRAWL: <span className="iec-gradient-text">ZERO TO ONE</span>
              </h1>

              <p className="brawl-font text-base md:text-lg text-sky-200">
                “{ecellConfig.tagline}”
              </p>

              <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-md mx-auto leading-relaxed">
                Navigate the 9 battlegrounds of startup building. Can a solo founder survive the pitch arena?
              </p>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    startIntroduction();
                  }}
                  className="px-10 py-4 brawl-btn brawl-btn-yellow text-base sm:text-lg tracking-wider flex items-center justify-center gap-3 mx-auto shadow-xl"
                >
                  <Rocket className="w-5 h-5 fill-black" />
                  <span>START BRAWL! 🚀</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Step Indicator Dots */}
        <div className="flex items-center gap-2 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                step === i
                  ? 'w-8 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]'
                  : i < step
                  ? 'w-3 bg-sky-400'
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Bottom Subtitle */}
      <div className="absolute bottom-6 text-xs text-sky-400/70 font-brawl tracking-wider">
        {ecellConfig.clubName} • SOA UNIVERSITY • BRAWL ORIENTATION
      </div>

    </div>
  );
};
