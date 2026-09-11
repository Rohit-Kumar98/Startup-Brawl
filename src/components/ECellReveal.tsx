import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RegistrationPosterStep } from './finale/RegistrationPosterStep';
import { TeamPresentationStep } from './finale/TeamPresentationStep';
import { ThankYouStep } from './finale/ThankYouStep';
import { sound } from '../utils/soundEffects';
import { QrCode, Users, Heart } from 'lucide-react';

export type FinalePage = 'poster' | 'team' | 'thankyou';

export const ECellReveal: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<FinalePage>('poster');

  // Keyboard navigation support for presentation (ArrowRight = Next, ArrowLeft = Back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (currentPage === 'poster') {
          sound.playClick();
          setCurrentPage('team');
        } else if (currentPage === 'team') {
          sound.playClick();
          setCurrentPage('thankyou');
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentPage === 'thankyou') {
          sound.playClick();
          setCurrentPage('team');
        } else if (currentPage === 'team') {
          sound.playClick();
          setCurrentPage('poster');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  const steps = [
    { id: 'poster', label: '1. REGISTRATION POSTER', icon: QrCode },
    { id: 'team', label: '2. PRESENTING OUR TEAM', icon: Users },
    { id: 'thankyou', label: '3. THANK YOU', icon: Heart },
  ] as const;

  return (
    <div className="relative w-full h-full min-h-screen overflow-y-auto overflow-x-hidden flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 text-center select-none custom-scrollbar bg-[#050711]">
      
      {/* Background Ambient Grid & Glowing Lights */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-purple-600/15 via-fuchsia-500/15 to-sky-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Presentation Stepper Header */}
      <div className="relative z-20 w-full max-w-2xl mx-auto mb-4">
        <div className="p-1.5 rounded-2xl bg-[#0c071e]/90 border border-purple-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.25)] flex items-center justify-between gap-1 sm:gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentPage === step.id;
            return (
              <button
                key={step.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentPage(step.id);
                }}
                className={`flex-1 py-2 px-2 sm:px-4 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(192,132,252,0.5)] scale-[1.02]'
                    : 'text-purple-300/70 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slide Stage */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'poster' && (
            <RegistrationPosterStep
              key="poster"
              onNext={() => setCurrentPage('team')}
            />
          )}

          {currentPage === 'team' && (
            <TeamPresentationStep
              key="team"
              onBack={() => setCurrentPage('poster')}
              onNext={() => setCurrentPage('thankyou')}
            />
          )}

          {currentPage === 'thankyou' && (
            <ThankYouStep
              key="thankyou"
              onBackToTeam={() => setCurrentPage('team')}
              onBackToPoster={() => setCurrentPage('poster')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Subtle Slide Navigation Helper Footer */}
      <footer className="relative z-20 w-full max-w-xl mx-auto pt-3 text-center text-[10px] sm:text-xs font-mono text-purple-300/60 flex items-center justify-center gap-3">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-purple-950/90 border border-purple-800 text-purple-200">←</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-purple-950/90 border border-purple-800 text-purple-200">→</kbd> to navigate slides</span>
        <span>•</span>
        <span>IEC SOA 2026</span>
      </footer>

    </div>
  );
};
