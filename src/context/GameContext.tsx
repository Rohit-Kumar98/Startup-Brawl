import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { 
  GamePhase, 
  GameStats, 
  VerticalScores, 
  StartupOption, 
  FloatingDelta, 
  DecisionHistoryItem 
} from '../types/game';
import { ecellConfig } from '../config/ecellConfig';
import { sound } from '../utils/soundEffects';

interface LastOutcome {
  narrative: string;
  ecellTakeaway: string;
  choiceTitle: string;
  deltasSummary: Record<string, number>;
  isCorrect?: boolean;
}

interface GameContextType {
  phase: GamePhase;
  chosenStartup: StartupOption | null;
  currentStageIndex: number;
  stats: GameStats;
  verticalScores: VerticalScores;
  decisionHistory: DecisionHistoryItem[];
  askECellUses: number;
  isHelpModalOpen: boolean;
  isMuted: boolean;
  floatingDeltas: FloatingDelta[];
  lastOutcome: LastOutcome | null;
  founderOwnership: number;
  
  // Actions
  startIntroduction: () => void;
  selectStartup: (startup: StartupOption) => void;
  proceedFromMapToStage: () => void;
  applyDecision: (
    deltas: Partial<GameStats> & Partial<VerticalScores>,
    choiceTitle: string,
    narrative: string,
    takeaway: string,
    isCorrect?: boolean
  ) => void;
  advanceToNextStage: () => void;
  openAskECellHelp: () => void;
  closeAskECellHelp: () => void;
  toggleSound: () => void;
  finishPitchMontage: () => void;
  openECellReveal: () => void;
  restartGame: () => void;
  triggerDelta: (text: string, type: 'positive' | 'negative' | 'neutral', statName?: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<GamePhase>('cinematic_intro');
  const [chosenStartup, setChosenStartup] = useState<StartupOption | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [stats, setStats] = useState<GameStats>(ecellConfig.initialStats);
  const [verticalScores, setVerticalScores] = useState<VerticalScores>(ecellConfig.initialVerticals);
  const [decisionHistory, setDecisionHistory] = useState<DecisionHistoryItem[]>([]);
  const [askECellUses, setAskECellUses] = useState<number>(2);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [floatingDeltas, setFloatingDeltas] = useState<FloatingDelta[]>([]);
  const [lastOutcome, setLastOutcome] = useState<LastOutcome | null>(null);
  const [founderOwnership, setFounderOwnership] = useState<number>(100);

  // Sync mute with sound engine
  const toggleSound = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playClick();
    }
  }, []);

  const triggerDelta = useCallback((text: string, type: 'positive' | 'negative' | 'neutral', statName?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setFloatingDeltas((prev) => [...prev, { id, text, type, statName }]);
    setTimeout(() => {
      setFloatingDeltas((prev) => prev.filter((d) => d.id !== id));
    }, 2800);
  }, []);

  const startIntroduction = useCallback(() => {
    sound.playTransition();
    setPhase('select_startup');
  }, []);

  const selectStartup = useCallback((startup: StartupOption) => {
    sound.playPositive();
    setChosenStartup(startup);
    setCurrentStageIndex(0);
    // Add custom startup perk
    if (startup.id === 'plantspeak') {
      setVerticalScores((prev) => ({ ...prev, product: 60 }));
      triggerDelta('+10 Tech Moat', 'positive', 'product');
    } else if (startup.id === 'campuseats') {
      setStats((prev) => ({ ...prev, users: 150 }));
      triggerDelta('+150 Initial Beta Users', 'positive', 'users');
    } else if (startup.id === 'skillswap') {
      setStats((prev) => ({ ...prev, reputation: 65 }));
      triggerDelta('+15 Student Trust', 'positive', 'reputation');
    }
    setPhase('map_journey');
  }, [triggerDelta]);

  const proceedFromMapToStage = useCallback(() => {
    sound.playTransition();
    const currentStage = ecellConfig.stages[currentStageIndex];
    if (currentStage.id === 'stage-pr') {
      sound.playCrisisAlarm();
      setPhase('crisis_active');
    } else if (currentStage.id === 'stage-pitch') {
      setPhase('pitch_arena');
    } else {
      setPhase('stage_active');
    }
  }, [currentStageIndex]);

  const applyDecision = useCallback((
    deltas: Partial<GameStats> & Partial<VerticalScores>,
    choiceTitle: string,
    narrative: string,
    takeaway: string,
    isCorrect?: boolean
  ) => {
    const currentStage = ecellConfig.stages[currentStageIndex];
    const scoreDiff = deltas.score ?? 0;
    const isWin = isCorrect !== undefined ? isCorrect : scoreDiff > 0;

    if (isWin) {
      sound.playPositive();
      triggerDelta(`▲ +${Math.abs(scoreDiff) || 20}% SUCCESS RATE`, 'positive', 'score');
    } else {
      sound.playNegative();
      triggerDelta(`▼ -${Math.abs(scoreDiff) || 15}% SUCCESS RATE`, 'negative', 'score');
    }

    // Update Core Stats
    setStats((prev) => {
      const nextScore = Math.max(0, Math.min(100, prev.score + (deltas.score ?? 0)));
      const nextEnergy = Math.max(0, Math.min(100, prev.energy + (deltas.energy ?? 0)));
      const nextRep = Math.max(0, Math.min(100, prev.reputation + (deltas.reputation ?? 0)));
      const nextMoney = Math.max(0, prev.money + (deltas.money ?? 0));
      const nextTime = Math.max(0, prev.time + (deltas.time ?? 0));
      const nextUsers = Math.max(0, prev.users + (deltas.users ?? 0));

      return {
        score: nextScore,
        money: nextMoney,
        time: nextTime,
        energy: nextEnergy,
        reputation: nextRep,
        users: nextUsers,
      };
    });

    // Update Vertical Scores
    setVerticalScores((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as (keyof VerticalScores)[]).forEach((key) => {
        if (deltas[key] !== undefined) {
          updated[key] = Math.max(0, Math.min(100, updated[key] + (deltas[key] as number)));
        }
      });
      return updated;
    });

    // Build deltas summary for the outcome display
    const summary: Record<string, number> = {};
    if (deltas.score) summary['Startup Score'] = deltas.score;
    if (deltas.reputation) summary['Reputation'] = deltas.reputation;
    if (deltas.product) summary['Tech Quality'] = deltas.product;
    if (deltas.brand) summary['Brand Power'] = deltas.brand;
    if (deltas.users) summary['Active Users'] = deltas.users;
    if (deltas.money) summary['Capital'] = deltas.money;
    if (deltas.energy) summary['Energy'] = deltas.energy;
    if (deltas.time) summary['Time (Days)'] = deltas.time;

    setLastOutcome({
      narrative,
      ecellTakeaway: takeaway,
      choiceTitle,
      deltasSummary: summary,
      isCorrect: isWin
    });

    // Log decision
    setDecisionHistory((prev) => [
      ...prev,
      {
        stageId: currentStage.id,
        stageName: currentStage.locationName,
        department: currentStage.departmentName,
        choiceTitle,
        outcomeText: narrative,
        scoreChange: scoreDiff,
      }
    ]);

    setPhase('stage_outcome');
  }, [currentStageIndex, triggerDelta]);

  const advanceToNextStage = useCallback(() => {
    sound.playTransition();
    const nextIdx = currentStageIndex + 1;
    if (nextIdx < ecellConfig.stages.length) {
      setCurrentStageIndex(nextIdx);
      setPhase('map_journey');
    } else {
      sound.playSuccessFanfare();
      setPhase('results');
    }
  }, [currentStageIndex]);

  const openAskECellHelp = useCallback(() => {
    if (askECellUses > 0) {
      sound.playClick();
      setAskECellUses((prev) => prev - 1);
      setIsHelpModalOpen(true);
      triggerDelta('E-Cell Mentorship Active', 'positive');
    }
  }, [askECellUses, triggerDelta]);

  const closeAskECellHelp = useCallback(() => {
    sound.playClick();
    setIsHelpModalOpen(false);
  }, []);

  const finishPitchMontage = useCallback(() => {
    if (stats.score >= 50) {
      sound.playSuccessFanfare();
    } else {
      sound.playFailureDrone();
    }
    setPhase('results');
  }, [stats.score]);

  const openECellReveal = useCallback(() => {
    sound.playSuccessFanfare();
    setPhase('ecell_reveal');
  }, []);

  const restartGame = useCallback(() => {
    sound.playClick();
    setChosenStartup(null);
    setCurrentStageIndex(0);
    setStats(ecellConfig.initialStats);
    setVerticalScores(ecellConfig.initialVerticals);
    setDecisionHistory([]);
    setAskECellUses(2);
    setIsHelpModalOpen(false);
    setFloatingDeltas([]);
    setLastOutcome(null);
    setFounderOwnership(100);
    setPhase('cinematic_intro');
  }, []);

  // Keyboard shortcut listener (Space = Next, 1/2/3 = Choice, H = Help, M = Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      } else if (e.key === 'h' || e.key === 'H') {
        if (!isHelpModalOpen && askECellUses > 0 && phase === 'stage_active') {
          openAskECellHelp();
        } else if (isHelpModalOpen) {
          closeAskECellHelp();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSound, openAskECellHelp, closeAskECellHelp, isHelpModalOpen, askECellUses, phase]);

  return (
    <GameContext.Provider
      value={{
        phase,
        chosenStartup,
        currentStageIndex,
        stats,
        verticalScores,
        decisionHistory,
        askECellUses,
        isHelpModalOpen,
        isMuted,
        floatingDeltas,
        lastOutcome,
        founderOwnership,
        startIntroduction,
        selectStartup,
        proceedFromMapToStage,
        applyDecision,
        advanceToNextStage,
        openAskECellHelp,
        closeAskECellHelp,
        toggleSound,
        finishPitchMontage,
        openECellReveal,
        restartGame,
        triggerDelta
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
};
