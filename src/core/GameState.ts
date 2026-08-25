export type GamePhase = 'menu' | 'playing' | 'result';

export interface GameState {
  phase: GamePhase;
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
  currentLevelIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  lastLevelScore: 0,
  lastLevelPerfect: false,
  totalMistakes: 0,
});
