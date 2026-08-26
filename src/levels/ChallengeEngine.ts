import type { ChallengeSpec } from './ChallengeCatalog';

export interface RuntimeChallenge {
  spec: ChallengeSpec;
  seed: number;
  mistakes: number;
  startedAt: number;
}

/**
 * Keeps level selection and runtime state separate from Phaser rendering.
 * Rendering scenes can consume this object without embedding campaign rules.
 */
export class ChallengeEngine {
  private readonly seed: number;
  private current?: RuntimeChallenge;

  constructor(seed = Date.now()) {
    this.seed = seed;
  }

  start(spec: ChallengeSpec, now = Date.now()): RuntimeChallenge {
    this.current = {
      spec,
      seed: this.seed ^ this.hash(spec.id),
      mistakes: 0,
      startedAt: now,
    };
    return this.current;
  }

  recordMistake(): void {
    if (this.current) this.current.mistakes += 1;
  }

  get runtime(): RuntimeChallenge | undefined {
    return this.current;
  }

  get isPerfect(): boolean {
    return (this.current?.mistakes ?? 1) === 0;
  }

  getRemainingMs(now = Date.now()): number {
    if (!this.current) return 0;
    return Math.max(0, this.current.spec.timeLimitMs - (now - this.current.startedAt));
  }

  private hash(value: string): number {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
}
