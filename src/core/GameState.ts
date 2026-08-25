export type GamePhase = 'menu' | 'world-select' | 'playing' | 'paused' | 'result';

export interface GameState {
  phase: GamePhase;
  selectedWorld: number;
  currentLevelIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  lastLevelScore: number;
  lastLevelPerfect: boolean;
  totalMistakes: number;
}

export const createInitialGameState = (): GameState => ({
  phase: 'menu',
  selectedWorld: 1,
  currentLevelIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lastLevelScore: 0,
  lastLevelPerfect: false,
  totalMistakes: 0,
});
