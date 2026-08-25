import type { LevelDefinition } from './LevelDefinition';

/**
 * Hand-designed starter campaign.
 * The mechanics deliberately escalate instead of repeating the same puzzle.
 */
export const LEVELS: readonly LevelDefinition[] = [
  {
    id: 'world-01-level-01', world: 1, number: 1, type: 'find-odd', difficulty: 1,
    timeLimitMs: 9_000, title: 'Warm Up', instruction: 'Find the odd one.', accent: 0x7c5cff,
  },
  {
    id: 'world-01-level-02', world: 1, number: 2, type: 'safe-target', difficulty: 2,
    timeLimitMs: 7_000, title: 'Trust Your Eyes', instruction: 'Tap the only safe shape.', accent: 0x00d4a8,
  },
  {
    id: 'world-01-level-03', world: 1, number: 3, type: 'dont-touch', difficulty: 2,
    timeLimitMs: 6_000, title: 'Do Nothing', instruction: 'Whatever you do... don\'t tap.', accent: 0xffb020,
  },
  {
    id: 'world-01-level-04', world: 1, number: 4, type: 'memory', difficulty: 3,
    timeLimitMs: 8_000, title: 'Remember Me', instruction: 'Watch the sequence. Repeat it.', accent: 0xff5c8a,
  },
  {
    id: 'world-01-level-05', world: 1, number: 5, type: 'fake-button', difficulty: 3,
    timeLimitMs: 6_000, title: 'Too Obvious', instruction: 'Press the button that is NOT obvious.', accent: 0xff6b6bff,
  },
  {
    id: 'world-01-level-06', world: 1, number: 6, type: 'moving-target', difficulty: 4,
    timeLimitMs: 5_000, title: 'Catch Me', instruction: 'Catch the target before it escapes.', accent: 0x00b8d9,
  },
  {
    id: 'world-01-level-07', world: 1, number: 7, type: 'reverse', difficulty: 4,
    timeLimitMs: 6_000, title: 'Think Backwards', instruction: 'Do the opposite of what you expect.', accent: 0xff5277,
  },
  {
    id: 'world-01-level-08', world: 1, number: 8, type: 'pattern', difficulty: 5,
    timeLimitMs: 7_000, title: 'Spot The Rule', instruction: 'Find what the pattern is hiding.', accent: 0x8ed081,
  },
  {
    id: 'world-01-level-09', world: 1, number: 9, type: 'boss', difficulty: 6,
    timeLimitMs: 12_000, title: 'The Trickster', instruction: 'The rules are about to change.', accent: 0xff4d8d,
  },
  {
    id: 'world-01-level-10', world: 1, number: 10, type: 'boss', difficulty: 7,
    timeLimitMs: 15_000, title: 'DON\'T TRUST ANYTHING', instruction: 'Beat the world\'s first real trick.', accent: 0xffd166,
  },
];
