import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, QrCode } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface RegistrationPosterStepProps {
  onNext: () => void;
}

export const RegistrationPosterStep: React.FC<RegistrationPosterStepProps> = ({ onNext }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      key="step-poster"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-2 py-1 select-none"
    >
      {/* Radiant Background Aura tailored to the Aarambh Purple Poster */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-purple-700/25 via-fuchsia-600/20 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Orientation Banner Pill */}
      <div className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-400/50 text-[11px] font-mono font-bold text-purple-200 uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(192,132,252,0.3)]">
        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
        <span>OFFICIAL REGISTRATION POSTER • IEC SOA</span>
        <QrCode className="w-3.5 h-3.5 text-purple-300" />
      </div>

      {/* Poster Showcase Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center mb-5">
        <div className="relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-purple-400/60 via-purple-700/40 to-fuchsia-500/50 shadow-[0_0_55px_rgba(168,85,247,0.4)] border border-purple-300/40 backdrop-blur-md">
          
          <img
            src="/aarambh_poster.jpg"
            alt="Aarambh - Scan to Join Us | Official IEC SOA Registration Poster"
            onLoad={() => setImgLoaded(true)}
            className={`max-h-[70vh] sm:max-h-[74vh] md:max-h-[76vh] w-auto object-contain rounded-xl sm:rounded-2xl transition-opacity duration-300 ${
              imgLoaded ? 'opacity-100' : 'opacity-90'
            }`}
          />

          {/* Subtle Ambient Lens Glow along poster frame */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none ring-1 ring-inset ring-white/20" />
        </div>
      </div>

      {/* Primary Forward Action (NO quick link, NO copy url, NO replay button) */}
      <div className="relative z-10 flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="brawl-btn brawl-btn-purple py-3.5 px-8 text-sm sm:text-base flex items-center gap-2 shadow-[0_0_35px_rgba(192,38,211,0.45)]"
        >
          <span>PRESENTING OUR TEAM</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </motion.button>
      </div>

    </motion.div>
  );
};
