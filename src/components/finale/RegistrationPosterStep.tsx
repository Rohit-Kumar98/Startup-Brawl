import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const RegistrationPosterStep: React.FC = () => {
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

      {/* Poster Showcase Container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <div className="relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-purple-400/60 via-purple-700/40 to-fuchsia-500/50 shadow-[0_0_55px_rgba(168,85,247,0.4)] border border-purple-300/40 backdrop-blur-md">
          <img
            src="/aarambh_poster.jpg"
            alt="Aarambh - Scan to Join Us | Official IEC SOA Registration Poster"
            onLoad={() => setImgLoaded(true)}
            className={`max-h-[78vh] sm:max-h-[82vh] md:max-h-[84vh] w-auto object-contain rounded-xl sm:rounded-2xl transition-opacity duration-300 ${
              imgLoaded ? 'opacity-100' : 'opacity-90'
            }`}
          />

          {/* Subtle Ambient Lens Glow along poster frame */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none ring-1 ring-inset ring-white/20" />
        </div>
      </div>
    </motion.div>
  );
};
