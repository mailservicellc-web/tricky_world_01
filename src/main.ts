import Phaser from 'phaser';
import { createInitialGameState } from './core/GameState';
import { LEVELS } from './levels/LevelRegistry';

const state = createInitialGameState();

class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    this.scene.start('menu');
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#10131a');

    this.add.text(width / 2, height * 0.28, 'TRICKY WORLD', {
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.1, 56)}px`,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.38, "The game that doesn't play fair.", {
      color: '#aeb7c7',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.04, 22)}px`,
    }).setOrigin(0.5);

    const button = this.add.text(width / 2, height * 0.58, 'PLAY', {
      backgroundColor: '#6c5ce7',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.055, 28)}px`,
      fontStyle: 'bold',
      padding: { left: 36, right: 36, top: 18, bottom: 18 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerup', () => {
      state.phase = 'playing';
      state.levelId = LEVELS[0]?.id ?? null;
      this.scene.start('game');
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#171b25');

    const level = LEVELS[0];
    if (!level) {
      throw new Error('No levels are registered.');
    }

    this.add.text(width / 2, height * 0.14, `LEVEL ${level.number}`, {
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.055, 28)}px`,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.22, level.title, {
      color: '#aeb7c7',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.04, 20)}px`,
    }).setOrigin(0.5);

    const positions = [
      [0.35, 0.42], [0.5, 0.42], [0.65, 0.42],
      [0.35, 0.55], [0.5, 0.55], [0.65, 0.55],
      [0.35, 0.68], [0.5, 0.68], [0.65, 0.68],
    ];

    const oddIndex = 7;
    positions.forEach(([x, y], index) => {
      const isOdd = index === oddIndex;
      const color = isOdd ? 0xff8a65 : 0xff7f50;
      const circle = this.add.circle(width * x, height * y, Math.min(width, height) * 0.045, color);
      circle.setInteractive({ useHandCursor: true });
      circle.on('pointerup', () => {
        if (isOdd) {
          state.score += 100;
          state.streak += 1;
          state.lastLevelPerfect = true;
          state.phase = 'result';
          this.scene.start('result');
        } else {
          state.streak = 0;
          this.cameras.main.shake(120, 0.006);
        }
      });
    });
  }
}

class ResultScene extends Phaser.Scene {
  constructor() {
    super('result');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#10131a');

    this.add.text(width / 2, height * 0.3, 'NICE! 🎯', {
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.09, 48)}px`,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.42, `Score: ${state.score}`, {
      color: '#aeb7c7',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.05, 26)}px`,
    }).setOrigin(0.5);

    const retry = this.add.text(width / 2, height * 0.6, 'PLAY AGAIN', {
      backgroundColor: '#6c5ce7',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.min(width * 0.045, 24)}px`,
      fontStyle: 'bold',
      padding: { left: 28, right: 28, top: 16, bottom: 16 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retry.on('pointerup', () => {
      state.phase = 'playing';
      state.levelId = LEVELS[0]?.id ?? null;
      this.scene.start('game');
    });
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#10131a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [BootScene, MenuScene, GameScene, ResultScene],
  input: {
    activePointers: 2,
  },
};

new Phaser.Game(config);
