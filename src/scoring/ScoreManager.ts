export interface ScoreResult {
  readonly total: number;
  readonly speedBonus: number;
  readonly perfectBonus: number;
  readonly streakBonus: number;
}

export class ScoreManager {
  private readonly baseScore = 100;
  private readonly perfectBonus = 50;
  private readonly streakStep = 25;

  calculate(elapsedMs: number, timeLimitMs: number, streak: number): ScoreResult {
    const speedRatio = Math.max(0, 1 - elapsedMs / timeLimitMs);
    const speedBonus = Math.round(speedRatio * 50);
    const perfectBonus = elapsedMs <= timeLimitMs * 0.5 ? this.perfectBonus : 0;
    const streakBonus = Math.max(0, streak - 1) * this.streakStep;

    return {
      total: this.baseScore + speedBonus + perfectBonus + streakBonus,
      speedBonus,
      perfectBonus,
      streakBonus,
    };
  }
}
