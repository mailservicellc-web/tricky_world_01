export type GameFeedbackEvent =
  | 'level-complete'
  | 'perfect'
  | 'streak'
  | 'world-complete'
  | 'boss-complete'
  | 'new-high-score'
  | 'failure';

export interface GameFeedbackContext {
  event: GameFeedbackEvent;
  world?: number;
  level?: number;
  score?: number;
  streak?: number;
  attempts?: number;
  perfect?: boolean;
}
