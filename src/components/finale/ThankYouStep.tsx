import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, Sparkles, Heart, Globe } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface ThankYouStepProps {
  onBackToTeam: () => void;
  onBackToPoster: () => void;
}

export const ThankYouStep: React.FC<ThankYouStepProps> = ({ onBackToTeam, onBackToPoster }) => {
  useEffect(() => {
    sound.playSuccessFanfare();
    try {
      confetti({
        particleCount: 170,
        spread: 120,
        origin: { y: 0.55 },
        colors: ['#c084fc', '#38bdf8', '#fbbf24', '#f472b6', '#a855f7']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <motion.div
      key="step-thankyou"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4 py-4 select-none"
    >
      {/* Radiant Glowing Background Bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-purple-600/25 via-fuchsia-500/20 to-sky-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphic Thank You Card */}
      <div className="relative z-10 w-full rounded-3xl p-6 sm:p-10 md:p-12 bg-gradient-to-b from-[#140b2e]/90 to-[#090518]/95 border-3 border-purple-400/70 border-b-6 border-b-purple-800 shadow-[0_0_60px_rgba(168,85,247,0.3)] backdrop-blur-xl">
        
        {/* Top Trophy / Heart Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/90 border border-purple-400/60 text-xs font-mono font-bold text-purple-200 uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(192,132,252,0.4)]">
          <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span>STARTUP BRAWL: ZERO TO ONE</span>
          <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
        </div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-wider font-brawl my-2 leading-tight">
          <span className="inline-block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(234,179,8,0.5)]">
            THANK YOU!
          </span>
        </h1>

        <p className="text-base sm:text-lg font-bold text-purple-200 font-sans tracking-wide mt-1">
          Presented with <Heart className="inline w-4 h-4 text-pink-500 fill-pink-500 mx-1 align-baseline" /> by IEC SOA
        </p>

        <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-xl mx-auto mt-3 leading-relaxed">
          Whether your venture raised millions or crashed in the campus canteen, every great founder starts by taking that first bold leap. IEC SOA is here to ensure you never build alone.
        </p>

        {/* 3 Pillar Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-8 max-w-2xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-[#1d1040]/70 border border-purple-500/30 flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-900/80 flex items-center justify-center text-xl mb-1.5 shadow">
              💡
            </div>
            <h4 className="font-brawl text-xs sm:text-sm text-white uppercase tracking-wider">
              IDEA INCUBATION
            </h4>
            <p className="text-[10px] text-purple-200/80 font-sans mt-0.5">
              From whiteboard concept to validated MVP.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1d1040]/70 border border-purple-500/30 flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-900/80 flex items-center justify-center text-xl mb-1.5 shadow">
              🤝
            </div>
            <h4 className="font-brawl text-xs sm:text-sm text-white uppercase tracking-wider">
              1-ON-1 MENTORSHIP
            </h4>
            <p className="text-[10px] text-purple-200/80 font-sans mt-0.5">
              Industry leaders, alumni & ecosystem guidance.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#1d1040]/70 border border-purple-500/30 flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-900/80 flex items-center justify-center text-xl mb-1.5 shadow">
              🚀
            </div>
            <h4 className="font-brawl text-xs sm:text-sm text-white uppercase tracking-wider">
              GRANTS & FUNDING
            </h4>
            <p className="text-[10px] text-purple-200/80 font-sans mt-0.5">
              Access to institutional seed capital.
            </p>
          </div>
        </div>

        {/* Official Channels & Contact Badges */}
        <div className="p-4 rounded-2xl bg-[#0d0720]/80 border border-purple-900/80 max-w-xl mx-auto mb-8">
          <p className="text-[11px] font-mono uppercase tracking-widest text-purple-300 font-bold mb-3">
            CONNECT WITH IEC SOA
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://ecellsoa.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-700/60 text-xs font-sans transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>ecellsoa.in</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-950/70 hover:bg-pink-900/80 text-pink-200 hover:text-white border border-pink-700/60 text-xs font-sans transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current text-pink-400" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@ecell.soa</span>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 text-sky-200 hover:text-white border border-sky-700/60 text-xs font-sans transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>IEC SOA</span>
            </a>
          </div>
        </div>

        {/* Navigation: Review Team / Poster (NO replay button!) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onBackToTeam();
            }}
            className="py-3 px-6 rounded-2xl bg-[#1d1040] hover:bg-[#2c1861] text-purple-200 hover:text-white text-xs sm:text-sm font-brawl tracking-wider flex items-center gap-2 border border-purple-500/40 transition-colors active:translate-y-0.5 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>MEET OUR TEAM</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onBackToPoster();
            }}
            className="py-3 px-6 rounded-2xl bg-[#140b2e] hover:bg-[#201149] text-gray-300 hover:text-white text-xs sm:text-sm font-brawl tracking-wider flex items-center gap-2 border border-purple-800 transition-colors active:translate-y-0.5"
          >
            <span>REGISTRATION POSTER</span>
          </button>
        </div>

      </div>

    </motion.div>
  );
};
