import type Phaser from 'phaser';
import type { ChallengeSpec } from './ChallengeCatalog';

export interface ChallengeView {
  root: Phaser.GameObjects.Container;
  cleanup: () => void;
}

/** Shared visual language for challenge types. Phaser scene owns input wiring. */
export function challengeHeadline(scene: Phaser.Scene, spec: ChallengeSpec): Phaser.GameObjects.Text {
  return scene.add.text(scene.scale.width / 2, 112, spec.title.toUpperCase(), {
    fontFamily: 'Arial Black, sans-serif',
    fontSize: '26px',
    color: '#ffffff',
    align: 'center',
  }).setOrigin(0.5);
}

export function challengeHint(scene: Phaser.Scene, spec: ChallengeSpec): Phaser.GameObjects.Text {
  return scene.add.text(scene.scale.width / 2, 148, spec.instruction, {
    fontFamily: 'Arial, sans-serif',
    fontSize: '15px',
    color: '#aeb8d8',
    align: 'center',
    wordWrap: { width: Math.min(scene.scale.width - 48, 520) },
  }).setOrigin(0.5);
}

export function makeChallengeRoot(scene: Phaser.Scene): Phaser.GameObjects.Container {
  return scene.add.container(0, 0);
}
