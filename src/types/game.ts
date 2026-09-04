export type GamePhase = 
  | 'cinematic_intro'
  | 'select_startup'
  | 'map_journey'
  | 'stage_active'
  | 'stage_outcome'
  | 'crisis_active'
  | 'pitch_arena'
  | 'pitch_montage'
  | 'results'
  | 'ecell_reveal';

export interface GameStats {
  score: number;       // 0 - 100
  money: number;       // In Rupees
  time: number;        // Days left
  energy: number;      // 0 - 100
  reputation: number;  // 0 - 100
  users: number;       // Count
}

export interface VerticalScores {
  mentorship: number;
  product: number;
  brand: number;
  content: number;
  marketing: number;
  media: number;
  pr: number;
  funding: number;
}

export interface StartupOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  strengths: string[];
  weaknesses: string[];
  initialPerk: string;
  // Specific stage variants
  brandingOptions: {
    id: string;
    name: string;
    stylePreview: string; // Tailwind colors or gradient
    description: string;
    brandDelta: number;
    scoreDelta: number;
    visualPreview: {
      primaryColor: string;
      accentColor: string;
      vibe: string;
      fontStyle: string;
    };
  }[];
  taglineOptions: {
    id: string;
    text: string;
    style: string;
    attentionDelta: number;
    scoreDelta: number;
    reactionText: string;
  }[];
  crisisType: {
    title: string;
    description: string;
    source: string;
    consequences: {
      choiceA: { label: string; repDelta: number; text: string };
      choiceB: { label: string; repDelta: number; userDelta: number; text: string };
      choiceC: { label: string; repDelta: number; text: string };
    };
  };
}

export interface DecisionChoice {
  id: string;
  title: string;
  description: string;
  isCorrect?: boolean;
  costMoney?: number;
  costTime?: number;
  costEnergy?: number;
  deltas: Partial<GameStats> & Partial<VerticalScores>;
  outcomeNarrative: string;
  ecellTakeaway: string;
}

export interface StageConfig {
  id: string;
  index: number;
  departmentKey: keyof VerticalScores;
  departmentName: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  locationName: string;
  mentorDialogue: string;
  mentorHint: string;
  question?: string;
  choices?: DecisionChoice[];
  customStageType?: 'standard' | 'design_branding' | 'content_tagline' | 'marketing_budget' | 'media_production' | 'crisis_pr' | 'investor_terms';
}

export interface FloatingDelta {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral';
  statName?: string;
}

export interface DecisionHistoryItem {
  stageId: string;
  stageName: string;
  department: string;
  choiceTitle: string;
  outcomeText: string;
  scoreChange: number;
}
