export type LevelType =
  | 'find-odd'
  | 'safe-target'
  | 'dont-touch'
  | 'memory'
  | 'reaction'
  | 'fake-button'
  | 'moving-target'
  | 'reverse'
  | 'pattern'
  | 'boss';

export interface LevelDefinition {
  readonly id: string;
  readonly world: number;
  readonly number: number;
  readonly type: LevelType;
  readonly difficulty: number;
  readonly timeLimitMs: number;
  readonly title: string;
  readonly instruction: string;
  readonly accent: number;
}
