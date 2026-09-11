import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { RegistrationPosterStep } from './finale/RegistrationPosterStep';
import { ThankYouStep } from './finale/ThankYouStep';
import { sound } from '../utils/soundEffects';

export type FinalePage = 'poster' | 'thankyou';

export const ECellReveal: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<FinalePage>('poster');

  // Keyboard navigation support for presentation (ArrowRight = Next, ArrowLeft = Back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (currentPage === 'poster') {
          sound.playClick();
          setCurrentPage('thankyou');
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentPage === 'thankyou') {
          sound.playClick();
          setCurrentPage('poster');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  return (
    <div className="relative w-full h-full min-h-screen overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 text-center select-none custom-scrollbar bg-[#050711]">
      
      {/* Background Ambient Grid & Glowing Lights */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-purple-600/15 via-fuchsia-500/15 to-sky-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Slide Stage */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'poster' && (
            <RegistrationPosterStep key="poster" />
          )}

          {currentPage === 'thankyou' && (
            <ThankYouStep key="thankyou" />
          )}
        </AnimatePresence>
      </main>

    </div>
  );
};
