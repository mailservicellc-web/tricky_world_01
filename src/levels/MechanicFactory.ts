import type Phaser from 'phaser';
import type { ChallengeKind } from './ChallengeCatalog';

export interface MechanicContext {
  scene: Phaser.Scene;
  width: number;
  height: number;
  seed: number;
  difficulty: number;
}

export interface MechanicController {
  kind: ChallengeKind;
  mount(): Phaser.GameObjects.GameObject[];
  destroy(): void;
}

const makeText = (ctx: MechanicContext, text: string, x: number, y: number, size = 18) =>
  ctx.scene.add.text(x, y, text, {
    fontFamily: 'Arial, sans-serif',
    fontSize: `${size}px`,
    color: '#ffffff',
    align: 'center',
  }).setOrigin(0.5);

/** Lightweight, deterministic mechanic primitives. Input rules stay in the game scene. */
export function createMechanic(kind: ChallengeKind, ctx: MechanicContext): MechanicController {
  const objects: Phaser.GameObjects.GameObject[] = [];
  return {
    kind,
    mount() {
      const cx = ctx.width / 2;
      const cy = ctx.height / 2 + 45;
      if (kind === 'observation') objects.push(makeText(ctx, 'LOOK CLOSER', cx, cy, 28));
      if (kind === 'memory') objects.push(makeText(ctx, 'WATCH • REMEMBER • REPEAT', cx, cy, 22));
      if (kind === 'reaction') objects.push(makeText(ctx, 'GET READY…', cx, cy, 28));
      if (kind === 'pattern') objects.push(makeText(ctx, 'WHAT COMES NEXT?', cx, cy, 24));
      if (kind === 'logic') objects.push(makeText(ctx, 'THINK BEFORE YOU TAP', cx, cy, 22));
      if (kind === 'deception') objects.push(makeText(ctx, 'NOT EVERYTHING IS TRUE', cx, cy, 22));
      if (kind === 'timing') objects.push(makeText(ctx, 'WAIT FOR THE MOMENT', cx, cy, 22));
      if (kind === 'reverse') objects.push(makeText(ctx, 'DO THE OPPOSITE', cx, cy, 26));
      if (kind === 'combination') objects.push(makeText(ctx, 'USE EVERYTHING YOU LEARNED', cx, cy, 21));
      return objects;
    },
    destroy() {
      for (const object of objects) object.destroy();
      objects.length = 0;
    },
  };
}
