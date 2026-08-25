export type LevelType = 'find-odd' | 'reaction' | 'trick';

export interface LevelDefinition {
  readonly id: string;
  readonly world: number;
  readonly number: number;
  readonly type: LevelType;
  readonly difficulty: number;
  readonly timeLimitMs: number;
  readonly title: string;
}
