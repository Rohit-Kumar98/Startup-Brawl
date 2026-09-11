import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Crown, Shield } from 'lucide-react';
import { teamConfig } from '../../config/teamConfig';
import { sound } from '../../utils/soundEffects';

interface TeamPresentationStepProps {
  onBack: () => void;
  onNext: () => void;
}

export const TeamPresentationStep: React.FC<TeamPresentationStepProps> = ({ onBack, onNext }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const centerMembers = teamConfig.members.filter(m => m.position === 'center');
  const leftMembers = teamConfig.members.filter(m => m.position === 'left');
  const rightMembers = teamConfig.members.filter(m => m.position === 'right');

  return (
    <motion.div
      key="step-team"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative w-full max-w-7xl mx-auto flex flex-col items-center px-2 sm:px-4 py-2"
    >
      {/* Ambient Dispersing Light Purple Glow Orbs */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-purple-500/20 via-fuchsia-600/15 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-fuchsia-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Banner with Light Purple Glow */}
      <div className="relative z-10 text-center mb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-400/50 text-[11px] font-mono font-bold text-purple-200 uppercase tracking-widest mb-2 shadow-[0_0_20px_rgba(192,132,252,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>INNOVATION & ENTREPRENEURSHIP CELL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wide font-brawl leading-tight mb-2">
          <span className="inline-block bg-gradient-to-r from-purple-200 via-fuchsia-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]">
            PRESENTING OUR TEAM
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-purple-200/90 font-sans max-w-xl mx-auto leading-relaxed">
          {teamConfig.sectionDescription}
        </p>
      </div>

      {/* ======================================================== */}
      {/* 1. CENTER STAGE: 2 CORE LEADS (Center, Elevated & Glowing) */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Crown className="w-4 h-4 text-purple-300" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-300">
            CORE EXECUTIVE LEADERSHIP
          </span>
          <Crown className="w-4 h-4 text-purple-300" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 max-w-3xl mx-auto">
          {centerMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="relative group w-full sm:w-72 rounded-3xl p-5 bg-gradient-to-b from-[#1c1038] to-[#0f0822] border-2 border-purple-400/60 shadow-[0_0_40px_rgba(192,132,252,0.35)] hover:shadow-[0_0_60px_rgba(192,132,252,0.6)] hover:border-purple-300 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Dispersing Glow Ring Behind Center Leader */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/30 rounded-full blur-2xl group-hover:bg-purple-400/40 transition-all duration-500 pointer-events-none" />

              {/* Leadership Crown Pill */}
              <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-900/80 border border-purple-400/70 text-[10px] font-mono font-bold text-purple-200 uppercase tracking-wider mb-3 shadow">
                <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                <span>{member.badge}</span>
              </div>

              {/* Photo Frame with Light Purple Aura */}
              <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-tr from-purple-400 via-fuchsia-300 to-purple-600 shadow-[0_0_25px_rgba(192,132,252,0.5)] mb-3">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0518] relative">
                  {!imageErrors[member.id] ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(member.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-900 to-indigo-900 text-2xl font-black text-purple-200 font-brawl">
                      {member.initials}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Role */}
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-black text-white font-brawl tracking-wide group-hover:text-purple-200 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-purple-300 font-sans mt-0.5">
                  {member.role}
                </p>
                <p className="text-[11px] text-gray-400 font-sans mt-1.5 px-2 line-clamp-2 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Department Tag */}
              <div className="relative z-10 mt-3 pt-2 border-t border-purple-900/60 w-full flex items-center justify-between text-[10px] font-mono text-purple-300/80 px-1">
                <span>{member.department}</span>
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FLANKING WINGS: ONE BESIDE ONE ON EACH SIDE (4 Left, 4 Right) */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-purple-500/50" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-300/90 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            DEPARTMENT DIRECTORS & HEADS
          </span>
          <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>

        {/* Panoramic Symmetrical Grid: Left Wing (4) and Right Wing (4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 max-w-6xl mx-auto">
          
          {/* Left Wing Container (4 Members Side-by-Side) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#12092b]/70 border border-purple-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.12)]">
            <div className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
              <span>TECH, DESIGN & BRAND WING</span>
              <span className="text-[10px] text-purple-400/80">4 HEADS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {leftMembers.map((member) => (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="group relative rounded-2xl p-3 bg-[#190d38]/80 border border-purple-400/25 hover:border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(192,132,252,0.4)] transition-all flex flex-col items-center text-center overflow-hidden"
                >
                  {/* Subtle Dispersing Glow */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl group-hover:bg-purple-400/30 transition-all pointer-events-none" />

                  {/* Photo Frame */}
                  <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 bg-gradient-to-tr from-purple-400 to-indigo-400 shadow-[0_0_15px_rgba(192,132,252,0.35)] mb-2">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#070314]">
                      {!imageErrors[member.id] ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={() => handleImageError(member.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-950 text-sm font-bold text-purple-200 font-brawl">
                          {member.initials}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="relative z-10 text-[9px] font-mono font-bold text-purple-300 bg-purple-950/90 border border-purple-700 px-1.5 py-0.2 rounded mb-1">
                    {member.badge}
                  </span>

                  <h4 className="relative z-10 text-xs sm:text-sm font-bold text-white font-sans leading-tight group-hover:text-purple-200">
                    {member.name}
                  </h4>
                  <p className="relative z-10 text-[10px] text-purple-300/80 font-sans mt-0.5 leading-snug">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Wing Container (4 Members Side-by-Side) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#12092b]/70 border border-purple-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.12)]">
            <div className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
              <span>GROWTH, MEDIA & VENTURES WING</span>
              <span className="text-[10px] text-purple-400/80">4 HEADS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {rightMembers.map((member) => (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="group relative rounded-2xl p-3 bg-[#190d38]/80 border border-purple-400/25 hover:border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(192,132,252,0.4)] transition-all flex flex-col items-center text-center overflow-hidden"
                >
                  {/* Subtle Dispersing Glow */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-fuchsia-500/20 rounded-full blur-xl group-hover:bg-fuchsia-400/30 transition-all pointer-events-none" />

                  {/* Photo Frame */}
                  <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 bg-gradient-to-tr from-fuchsia-400 to-purple-400 shadow-[0_0_15px_rgba(216,180,254,0.35)] mb-2">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#070314]">
                      {!imageErrors[member.id] ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={() => handleImageError(member.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-950 text-sm font-bold text-purple-200 font-brawl">
                          {member.initials}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="relative z-10 text-[9px] font-mono font-bold text-purple-300 bg-purple-950/90 border border-purple-700 px-1.5 py-0.2 rounded mb-1">
                    {member.badge}
                  </span>

                  <h4 className="relative z-10 text-xs sm:text-sm font-bold text-white font-sans leading-tight group-hover:text-purple-200">
                    {member.name}
                  </h4>
                  <p className="relative z-10 text-[10px] text-purple-300/80 font-sans mt-0.5 leading-snug">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Controls: Back to Poster or Proceed to Thank You (NO replay button!) */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 mt-2">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="py-3 px-6 rounded-2xl bg-[#190d33] hover:bg-[#25144a] text-purple-200 hover:text-white text-xs sm:text-sm font-brawl tracking-wider flex items-center gap-2 border border-purple-400/40 transition-colors active:translate-y-0.5 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>REGISTRATION POSTER</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="brawl-btn brawl-btn-purple py-3.5 px-8 text-sm sm:text-base flex items-center gap-2 shadow-[0_0_35px_rgba(192,38,211,0.45)]"
        >
          <span>PROCEED TO THANK YOU</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </motion.button>
      </div>

    </motion.div>
  );
};
