import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ecellConfig } from '../config/ecellConfig';
import type { StartupOption } from '../types/game';
import { motion } from 'framer-motion';
import { Zap, Shield, Flame, Trophy, Play } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export const StartupSelection: React.FC = () => {
  const { selectStartup } = useGame();
  const [selectedStartup, setSelectedStartup] = useState<StartupOption>(ecellConfig.startups[0]);

  const handleBrawlStart = () => {
    sound.playSuccessFanfare();
    selectStartup(selectedStartup);
  };

  const getBrawlerMeta = (id: string) => {
    switch (id) {
      case 'plantspeak':
        return {
          rarity: 'EPIC BRAWLER',
          rarityColor: 'bg-purple-900 text-purple-200 border-purple-400',
          pedestalGlow: '#c026d3',
          brawlerClass: 'TECH DISRUPTOR',
          stats: { attack: 88, defense: 62, speed: 70 },
          quote: "AI plant vision computer models diagnose sick hostel plants in real-time.",
        };
      case 'campuseats':
        return {
          rarity: 'RARE BRAWLER',
          rarityColor: 'bg-sky-900 text-sky-200 border-sky-400',
          pedestalGlow: '#38bdf8',
          brawlerClass: 'HYPER LOGISTICS',
          stats: { attack: 75, defense: 50, speed: 96 },
          quote: "Peer-to-peer 10-minute hostel canteen snack delivery network.",
        };
      case 'skillswap':
      default:
        return {
          rarity: 'MYTHIC BRAWLER',
          rarityColor: 'bg-rose-900 text-rose-200 border-rose-400',
          pedestalGlow: '#f43f5e',
          brawlerClass: 'NETWORK TANK',
          stats: { attack: 68, defense: 94, speed: 82 },
          quote: "Student barter platform trading coding tutoring for exam notes and guitar lessons.",
        };
    }
  };

  const currentMeta = getBrawlerMeta(selectedStartup.id);

  return (
    <div className="relative min-h-screen bg-[#050711] flex flex-col justify-between p-4 md:p-8 overflow-hidden select-none">
      
      {/* Background ambient lighting from IEC SOA theme */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-[#38bdf8]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-[#c026d3]/15 rounded-full blur-[130px] pointer-events-none" />

      {/* TOP HEADER: BRAWL LOBBY BAR */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-800/80">
        
        {/* Left Club Pill */}
        <div className="flex items-center gap-2">
          <div className="brawl-badge bg-[#0b1227] border-[#38bdf8] text-[#38bdf8] text-xs py-1 px-3">
            <Trophy className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{ecellConfig.clubName} ({ecellConfig.clubShortName})</span>
          </div>
          <span className="brawl-badge bg-[#240c31] border-[#c026d3] text-[#e879f9] text-[10px] py-1 px-2">
            ORIENTATION 2026
          </span>
        </div>

        {/* Right Tagline */}
        <div className="hidden sm:block text-right">
          <div className="brawl-text text-xs sm:text-sm iec-gradient-text">
            “{ecellConfig.tagline}”
          </div>
          <div className="text-[11px] text-gray-400 font-sans">
            {ecellConfig.subtitle}
          </div>
        </div>
      </div>

      {/* CENTER STAGE: 3-COLUMN BRAWL STARS LOBBY */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center py-6">
        
        {/* LEFT COLUMN (COL-3): BRAWLER SELECTOR DECK */}
        <div className="lg:col-span-4 space-y-3">
          <div className="brawl-text text-xs text-sky-400 mb-1 tracking-wider">
            SELECT YOUR BRAWLER (3 AVAILABLE):
          </div>

          {ecellConfig.startups.map((st) => {
            const isSelected = selectedStartup.id === st.id;
            const meta = getBrawlerMeta(st.id);

            return (
              <div
                key={st.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedStartup(st);
                }}
                className={`brawl-card p-3 sm:p-4 cursor-pointer transition-all flex items-center gap-3.5 border-3 ${
                  isSelected
                    ? 'border-yellow-400 bg-[#0f1730] scale-102 shadow-[0_0_25px_rgba(250,204,21,0.4)]'
                    : 'border-[#1e293b] hover:border-slate-500 bg-[#090e1f]'
                }`}
              >
                {/* Brawler Square Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-white flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {st.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="brawl-text text-sm sm:text-base text-white truncate">
                      {st.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-yellow-400 text-black flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`brawl-badge text-[8px] py-0 px-1.5 ${meta.rarityColor}`}>
                      {meta.rarity}
                    </span>
                    <span className="text-[10px] text-sky-300 font-sans truncate">
                      {meta.brawlerClass}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER COLUMN (COL-5): 3D BRAWLER PEDESTAL DISPLAY */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
          
          {/* Overhead Brawler Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`brawl-badge text-xs py-1 px-3 ${currentMeta.rarityColor}`}>
              {currentMeta.rarity}
            </span>
            <div className="flex items-center gap-1 bg-yellow-400 border-2 border-black rounded-lg px-2 py-0.5 text-black font-brawl text-xs shadow-md">
              <span>★</span>
              <span>POWER 1</span>
            </div>
          </div>

          <h2 className="brawl-title text-3xl sm:text-4xl text-white mb-1">
            {selectedStartup.name}
          </h2>

          <div className="text-xs font-brawl text-sky-300 tracking-wider mb-4">
            CLASS: {currentMeta.brawlerClass}
          </div>

          {/* 3D Brawler on Glowing Pedestal */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            
            {/* Floating Brawler Character Avatar */}
            <motion.div
              key={selectedStartup.id}
              initial={{ scale: 0.6, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="relative z-10 text-8xl sm:text-9xl animate-bounce drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] cursor-pointer"
            >
              {selectedStartup.icon}
            </motion.div>

            {/* Glowing Neon Pedestal */}
            <div 
              className="brawl-pedestal mt-[-35px]"
              style={{
                borderColor: currentMeta.pedestalGlow,
                boxShadow: `0 0 35px ${currentMeta.pedestalGlow}`,
              }}
            />
          </div>

          {/* Perk & Description Box */}
          <div className="w-full max-w-sm p-3 rounded-2xl bg-[#0b1226] border-2 border-[#1e293b] mt-2 shadow-inner">
            <div className="flex items-center justify-center gap-1.5 text-yellow-300 font-brawl text-xs mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>SUPER PERK: {selectedStartup.initialPerk}</span>
            </div>
            <p className="text-xs text-gray-300 font-sans">
              {currentMeta.quote}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN (COL-3): EVENT MODE CARD & PLAY BUTTON */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
          
          {/* Event Selector Card (Matches Brawl Stars Mode Slot) */}
          <div className="brawl-card p-4 border-3 border-sky-400 border-b-6 border-b-sky-700 bg-[#0c142c]">
            <div className="flex items-center justify-between mb-2">
              <span className="brawl-badge bg-sky-950 text-sky-300 border-sky-400 text-[10px]">
                FEATURED EVENT
              </span>
              <span className="brawl-badge bg-emerald-950 text-emerald-300 border-emerald-500 text-[10px]">
                XP x2
              </span>
            </div>

            <h3 className="brawl-text text-lg sm:text-xl text-white mb-1">
              STARTUP: ZERO TO ONE
            </h3>

            <div className="text-xs text-sky-300 font-brawl mb-3">
              MAP: SOA CAMPUS ARENA (9 BATTLEGROUNDS)
            </div>

            <div className="space-y-2 bg-[#080d1e] p-3 rounded-xl border border-white/10 mb-3">
              <div className="flex justify-between text-[11px] font-brawl text-rose-400">
                <span className="flex items-center gap-1"><Flame className="w-3 h-3 fill-current" /> EXECUTION</span>
                <span>{currentMeta.stats.attack}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-black">
                <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400" style={{ width: `${currentMeta.stats.attack}%` }} />
              </div>

              <div className="flex justify-between text-[11px] font-brawl text-sky-400">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 fill-current" /> RESILIENCE</span>
                <span>{currentMeta.stats.defense}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-black">
                <div className="h-full bg-gradient-to-r from-sky-400 to-emerald-400" style={{ width: `${currentMeta.stats.defense}%` }} />
              </div>

              <div className="flex justify-between text-[11px] font-brawl text-yellow-400">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 fill-current" /> SPEED</span>
                <span>{currentMeta.stats.speed}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-black">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500" style={{ width: `${currentMeta.stats.speed}%` }} />
              </div>
            </div>

            <div className="text-[11px] text-gray-400 font-sans">
              Rule: Guide your solo founder across all 9 stations. Solo founders burn out without an ecosystem!
            </div>
          </div>

          {/* THE MASSIVE BRAWL STARS PLAY BUTTON */}
          <button
            onClick={handleBrawlStart}
            className="w-full py-5 sm:py-6 brawl-btn brawl-btn-yellow text-2xl sm:text-3xl tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(255,190,0,0.5)]"
          >
            <Play className="w-8 h-8 fill-black stroke-[3]" />
            <span>BRAWL!</span>
          </button>

        </div>

      </div>

      {/* FOOTER BAR */}
      <div className="relative z-10 text-center text-xs text-sky-400/80 font-brawl tracking-wider border-t-2 border-slate-800/80 pt-3">
        {ecellConfig.clubName} • SOA UNIVERSITY • CLICK BRAWL TO ENTER THE CAMPUS MAP
      </div>

    </div>
  );
};
