export type GamePhase = 'menu' | 'playing' | 'result';

export interface GameState {
  phase: GamePhase;
  levelId: string | null;
  score: number;
  streak: number;
  lastLevelPerfect: boolean;
}

export const createInitialGameState = (): GameState => ({
  phase: 'menu',
  levelId: null,
  score: 0,
  streak: 0,
  lastLevelPerfect: false,
});
