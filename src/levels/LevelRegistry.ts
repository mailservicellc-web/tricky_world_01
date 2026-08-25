import type { LevelDefinition } from './LevelDefinition';

export const LEVELS: readonly LevelDefinition[] = [
  {
    id: 'world-01-level-01',
    world: 1,
    number: 1,
    type: 'find-odd',
    difficulty: 1,
    timeLimitMs: 10_000,
    title: 'Find the Odd One',
  },
  {
    id: 'world-01-level-02',
    world: 1,
    number: 2,
    type: 'find-odd',
    difficulty: 2,
    timeLimitMs: 9_000,
    title: 'Look Closer',
  },
  {
    id: 'world-01-level-03',
    world: 1,
    number: 3,
    type: 'find-odd',
    difficulty: 3,
    timeLimitMs: 8_000,
    title: 'Not So Obvious',
  },
];
