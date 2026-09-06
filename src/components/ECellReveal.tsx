import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  RotateCcw, 
  ExternalLink,
  QrCode,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const ECellReveal: React.FC = () => {
  const { restartGame } = useGame();
  const [qrImgError, setQrImgError] = useState(false);

  useEffect(() => {
    sound.playSuccessFanfare();
    try {
      confetti({
        particleCount: 160,
        spread: 110,
        origin: { y: 0.55 }
      });
    } catch {
      // Confetti handled
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pb-14 md:pb-16 text-center select-none custom-scrollbar">
      
      {/* Background Ambient Glowing Lights */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#38bdf8]/20 via-[#2563eb]/15 to-[#c026d3]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main IEC Reveal & Registration Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 25 }}
        className="relative z-10 w-full max-w-2xl my-auto brawl-card p-6 sm:p-8 md:p-10 border-4 border-[#38bdf8] border-b-8 border-b-[#0284c7] shadow-[0_0_60px_rgba(56,189,248,0.4)] bg-[#090d1c]"
      >
        
        {/* 1. OFFICIAL IEC SOA LOGO */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-5">
          {/* Stylized IEC Monogram Pillar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#38bdf8] via-[#2563eb] to-[#c026d3] p-1 shadow-[0_0_25px_rgba(56,189,248,0.5)] shrink-0">
            <div className="w-full h-full bg-[#070b18] rounded-[12px] flex items-center justify-center">
              <svg className="w-10 h-10 text-white" viewBox="0 0 40 40" fill="currentColor">
                {/* Vertical Stem */}
                <rect x="7" y="7" width="6" height="26" rx="1.5" />
                {/* Top Serif & Bar */}
                <rect x="4" y="7" width="12" height="4" rx="1" />
                <rect x="13" y="7" width="18" height="4" rx="1.5" />
                {/* Middle Bar */}
                <rect x="13" y="18" width="14" height="4" rx="1.5" />
                {/* Bottom Serif & Bar */}
                <rect x="4" y="29" width="12" height="4" rx="1" />
                <rect x="13" y="29" width="18" height="4" rx="1.5" />
              </svg>
            </div>
          </div>

          {/* Logo Typography Matching Website Header */}
          <div className="text-center sm:text-left font-sans leading-none">
            <div className="text-lg sm:text-xl font-black tracking-wider text-white uppercase font-brawl">
              INNOVATION &
            </div>
            <div className="text-lg sm:text-xl font-black tracking-wider text-white uppercase font-brawl">
              ENTREPRENEURSHIP
            </div>
            <div className="text-xs sm:text-sm font-bold tracking-widest text-[#38bdf8] uppercase mt-0.5">
              CELL • SIKSHA 'O' ANUSANDHAN
            </div>
          </div>
        </div>

        {/* 2. CLUB MOTTO & SUBTITLE */}
        <div className="space-y-3 mb-6">
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wide font-brawl my-2 leading-tight">
            <span className="inline-block iec-gradient-text">
              DRIVING IDEAS TOWARDS IMPACT
            </span>
          </h1>

          <p className="text-sm sm:text-base font-bold text-yellow-300 font-sans tracking-wide">
            “{ecellConfig.subtitle}”
          </p>

          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto font-sans leading-relaxed pt-1">
            Empowering students to transform ideas into impactful ventures through mentorship, funding, and ecosystem support.
          </p>
        </div>

        {/* 3. RECRUITMENT POSTER & REGISTRATION SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 max-w-2xl mx-auto">
          {/* Recruitment Poster Container (Ready for user image drop-in: /recruitment_poster.png or /poster.png) */}
          <div className="p-4 rounded-3xl bg-[#060a16] border-3 border-sky-400/80 border-b-6 border-b-sky-700 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.2)] relative overflow-hidden min-h-[300px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-400 text-[10px] font-mono font-bold text-sky-300 uppercase mb-3">
              <span>📢 OFFICIAL RECRUITMENT POSTER</span>
            </div>

            <div className="w-full flex-1 flex flex-col items-center justify-center relative rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 p-3">
              {/* Attempt to load poster image if user drops it into public/recruitment_poster.png */}
              <img 
                src="/recruitment_poster.png" 
                alt="IEC SOA Recruitment 2026 Poster"
                className="max-h-[320px] w-auto object-contain rounded-xl shadow-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = document.getElementById('poster-fallback-frame');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />

              {/* Dynamic Styled Fallback Frame until poster is uploaded */}
              <div 
                id="poster-fallback-frame"
                className="w-full h-full flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-sky-500/40 bg-gradient-to-b from-[#091228] to-[#060a18]"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-2xl mb-2 shadow-md">
                  🚀
                </div>
                <h3 className="brawl-text text-base sm:text-lg text-white mb-1">
                  IEC SOA RECRUITMENT 2026
                </h3>
                <p className="text-xs text-sky-200 font-sans max-w-xs mb-3">
                  Join the Core Team across Tech, Media, PR, Design, Content & Venture Relations.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
                  <span className="brawl-badge text-[9px] bg-sky-950 text-sky-300 border-sky-700 px-2 py-0.5">DEV & TECH</span>
                  <span className="brawl-badge text-[9px] bg-purple-950 text-purple-300 border-purple-700 px-2 py-0.5">DESIGN</span>
                  <span className="brawl-badge text-[9px] bg-rose-950 text-rose-300 border-rose-700 px-2 py-0.5">CRISIS PR</span>
                  <span className="brawl-badge text-[9px] bg-emerald-950 text-emerald-300 border-emerald-700 px-2 py-0.5">MEDIA</span>
                  <span className="brawl-badge text-[9px] bg-amber-950 text-amber-300 border-amber-700 px-2 py-0.5">VENTURE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scan to Register Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#060a16] border-3 border-yellow-400/80 border-b-6 border-b-amber-600 flex flex-col items-center justify-between shadow-[0_0_35px_rgba(250,204,21,0.25)] relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-black border-2 border-black text-xs font-black uppercase font-brawl tracking-wider mb-2 shadow">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>SCAN TO REGISTER</span>
            </div>

            <p className="text-xs text-sky-200 font-sans mb-3 text-center">
              Scan with camera or Google Lens to join <strong className="text-yellow-400">IEC SOA</strong>.
            </p>

            {/* Crisp, Scannable QR Code */}
            <div className="relative p-3 rounded-2xl bg-white shadow-2xl mb-4 border-4 border-black">
              {!qrImgError ? (
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https%3A%2F%2Fiecsoa.com&color=050711&bgcolor=ffffff"
                  alt="Scan to Register - IEC SOA"
                  className="w-36 h-36 sm:w-40 sm:h-40 block rounded-lg"
                  onError={() => setQrImgError(true)}
                />
              ) : (
                /* High-fidelity Inline SVG QR Code Fallback */
                <svg className="w-36 h-36 sm:w-40 sm:h-40" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="25" height="25" fill="#060814" rx="4" />
                  <rect x="9" y="9" width="17" height="17" fill="#FFFFFF" rx="2" />
                  <rect x="13" y="13" width="9" height="9" fill="#060814" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="#060814" rx="4" />
                  <rect x="74" y="9" width="17" height="17" fill="#FFFFFF" rx="2" />
                  <rect x="78" y="13" width="9" height="9" fill="#060814" />
                  
                  <rect x="5" y="70" width="25" height="25" fill="#060814" rx="4" />
                  <rect x="9" y="74" width="17" height="17" fill="#FFFFFF" rx="2" />
                  <rect x="13" y="78" width="9" height="9" fill="#060814" />

                  <rect x="35" y="10" width="6" height="6" fill="#060814" />
                  <rect x="45" y="10" width="6" height="6" fill="#060814" />
                  <rect x="55" y="10" width="6" height="6" fill="#060814" />
                  <rect x="35" y="20" width="6" height="6" fill="#060814" />
                  <rect x="50" y="22" width="12" height="6" fill="#060814" />
                  <rect x="10" y="38" width="80" height="4" fill="#060814" />
                  
                  {/* Center IEC SOA Accent Tile */}
                  <rect x="38" y="35" width="24" height="24" fill="#0284c7" rx="4" />
                  <rect x="44" y="41" width="12" height="12" fill="#FFFFFF" rx="2" />
                  
                  <rect x="10" y="48" width="8" height="8" fill="#060814" />
                  <rect x="22" y="52" width="10" height="6" fill="#060814" />
                  <rect x="68" y="48" width="10" height="6" fill="#060814" />
                  <rect x="80" y="52" width="10" height="8" fill="#060814" />
                  <rect x="35" y="65" width="14" height="6" fill="#060814" />
                  <rect x="55" y="65" width="10" height="8" fill="#060814" />
                  <rect x="70" y="70" width="12" height="6" fill="#060814" />
                  <rect x="85" y="75" width="8" height="15" fill="#060814" />
                  <rect x="35" y="80" width="25" height="10" fill="#060814" />
                  <rect x="65" y="85" width="12" height="6" fill="#060814" />
                </svg>
              )}
            </div>

            {/* Direct Link CTA Button */}
            <a
              href={ecellConfig.qrCodeLink}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 brawl-btn brawl-btn-yellow text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform active:translate-y-1"
            >
              <QrCode className="w-4 h-4 stroke-[3]" />
              <span>CLICK TO REGISTER ONLINE</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* 4. PLAY AGAIN ACTION */}
        <button
          onClick={() => {
            sound.playClick();
            restartGame();
          }}
          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#0d1326] hover:bg-[#141d3b] text-gray-300 hover:text-white text-xs font-brawl tracking-wider flex items-center justify-center gap-2 transition-colors border-2 border-slate-700 active:translate-y-0.5 mx-auto"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>PLAY AGAIN / PASS TO NEXT JUNIOR</span>
        </button>

      </motion.div>

    </div>
  );
};
