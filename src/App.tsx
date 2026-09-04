import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HUD } from './components/HUD';
import { CinematicIntro } from './components/CinematicIntro';
import { StartupSelection } from './components/StartupSelection';
import { CampusCanvas } from './game/CampusCanvas';
import { ArcadeDialogueBox } from './components/ArcadeDialogueBox';
import { PitchArena } from './components/PitchArena';
import { ResultsScreen } from './components/ResultsScreen';
import { ECellReveal } from './components/ECellReveal';
import { AskECellModal } from './components/AskECellModal';

const GameRouter: React.FC = () => {
  const { phase } = useGame();

  const isCampusWorldActive = 
    phase === 'map_journey' || 
    phase === 'stage_active' || 
    phase === 'stage_outcome' || 
    phase === 'crisis_active';

  const showHUD = phase !== 'cinematic_intro' && phase !== 'ecell_reveal';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070B12] text-white flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Game HUD (Header) - Hidden on Cinematic Intro & Finale Reveal */}
      {showHUD && <HUD />}

      {/* Main Game Screen Router */}
      <main className="relative flex-1 w-full min-h-0 overflow-hidden">
        {phase === 'cinematic_intro' && <CinematicIntro />}
        {phase === 'select_startup' && <StartupSelection />}
        
        {/* 2D Animated Campus World with Avatar */}
        {isCampusWorldActive && (
          <div className="relative w-full h-full">
            <CampusCanvas />
            {/* Bottom Arcade RPG Dialogue Box */}
            <ArcadeDialogueBox />
          </div>
        )}

        {phase === 'pitch_arena' && <PitchArena />}
        {phase === 'results' && <ResultsScreen />}
        {phase === 'ecell_reveal' && <ECellReveal />}
      </main>

      {/* Global Ask E-Cell Mentor SOS Modal */}
      <AskECellModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
