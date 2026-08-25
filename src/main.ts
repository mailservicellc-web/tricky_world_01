import Phaser from 'phaser';
import { createInitialGameState, type GameState } from './core/GameState';
import { LEVELS } from './levels/LevelRegistry';
import type { LevelDefinition } from './levels/LevelDefinition';

const state: GameState = createInitialGameState();

const UI = {
  bg: 0x090b13,
  panel: 0x121625,
  panel2: 0x191e31,
  text: '#f7f8ff',
  muted: '#9ca6c3',
  accent: '#8b72ff',
  danger: '#ff5577',
  success: '#36e0a0',
  gold: '#ffd166',
};

const font = 'Arial, sans-serif';

function roundedButton(scene: Phaser.Scene, x: number, y: number, width: number, height: number, label: string, onClick: () => void): void {
  const container = scene.add.container(x, y);
  const shadow = scene.add.rectangle(0, 7, width, height, 0x000000, 0.28).setOrigin(0.5);
  const body = scene.add.rectangle(0, 0, width, height, UI.accent, 1).setOrigin(0.5).setStrokeStyle(2, 0xffffff, 0.08);
  const text = scene.add.text(0, 0, label, { color: UI.text, fontFamily: font, fontSize: '22px', fontStyle: 'bold' }).setOrigin(0.5);
  container.add([shadow, body, text]);
  body.setInteractive({ useHandCursor: true });
  body.on('pointerover', () => scene.tweens.add({ targets: container, scale: 1.04, duration: 100, ease: 'Quad.out' }));
  body.on('pointerout', () => scene.tweens.add({ targets: container, scale: 1, duration: 100 }));
  body.on('pointerdown', () => scene.tweens.add({ targets: container, scale: 0.96, duration: 60 }));
  body.on('pointerup', () => {
    scene.tweens.add({ targets: container, scale: 1, duration: 80 });
    onClick();
  });
}

function addBackground(scene: Phaser.Scene): void {
  const { width, height } = scene.scale;
  scene.cameras.main.setBackgroundColor(UI.bg);
  for (let i = 0; i < 16; i += 1) {
    const x = Phaser.Math.Between(0, width);
    const y = Phaser.Math.Between(0, height);
    const dot = scene.add.circle(x, y, Phaser.Math.Between(1, 3), 0xffffff, Phaser.Math.FloatBetween(0.04, 0.12));
    scene.tweens.add({ targets: dot, alpha: 0.02, duration: Phaser.Math.Between(1800, 3500), yoyo: true, repeat: -1 });
  }
}

class BootScene extends Phaser.Scene {
  constructor() { super('boot'); }
  create(): void { this.scene.start('menu'); }
}

class MenuScene extends Phaser.Scene {
  constructor() { super('menu'); }

  create(): void {
    addBackground(this);
    const { width, height } = this.scale;

    this.add.text(width / 2, height * 0.18, 'TRICKY', { color: UI.text, fontFamily: font, fontSize: '64px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.25, 'WORLD', { color: UI.accent, fontFamily: font, fontSize: '64px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.34, "THE GAME THAT DOESN'T PLAY FAIR.", { color: UI.muted, fontFamily: font, fontSize: '17px', letterSpacing: 2 }).setOrigin(0.5);

    const card = this.add.rectangle(width / 2, height * 0.54, width * 0.82, height * 0.19, UI.panel, 1).setOrigin(0.5).setStrokeStyle(1, 0xffffff, 0.08);
    this.add.text(width / 2, height * 0.49, 'WORLD 01', { color: UI.gold, fontFamily: font, fontSize: '16px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.55, '10 levels of tricks, speed & chaos', { color: UI.text, fontFamily: font, fontSize: '20px' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.61, 'Think fast. Trust nothing.', { color: UI.muted, fontFamily: font, fontSize: '15px' }).setOrigin(0.5);
    card.setDepth(-1);

    roundedButton(this, width / 2, height * 0.76, width * 0.58, 66, 'PLAY WORLD 01', () => {
      state.phase = 'playing';
      state.currentLevelIndex = 0;
      state.score = 0;
      state.streak = 0;
      state.bestStreak = 0;
      state.totalMistakes = 0;
      this.scene.start('game');
    });
  }
}

class GameScene extends Phaser.Scene {
  private level!: LevelDefinition;
  private levelStart = 0;
  private timeLeft = 0;
  private timerText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private locked = false;
  private targetIndex = -1;
  private cleanup: Array<() => void> = [];

  constructor() { super('game'); }

  create(): void {
    addBackground(this);
    this.locked = false;
    this.cleanup = [];
    this.level = LEVELS[state.currentLevelIndex] ?? LEVELS[0];
    this.levelStart = this.time.now;
    this.timeLeft = this.level.timeLimitMs;

    const { width, height } = this.scale;
    this.add.text(28, 30, `WORLD 01  •  ${String(this.level.number).padStart(2, '0')}/10`, { color: UI.muted, fontFamily: font, fontSize: '15px', fontStyle: 'bold' });
    this.add.text(width - 28, 30, `🔥 ${state.streak}`, { color: UI.gold, fontFamily: font, fontSize: '17px', fontStyle: 'bold' }).setOrigin(1, 0);

    this.timerText = this.add.text(width / 2, 54, '', { color: UI.text, fontFamily: font, fontSize: '22px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.rectangle(width * 0.12, 88, width * 0.76, 6, UI.panel2).setOrigin(0, 0.5);

    this.add.text(width / 2, height * 0.15, this.level.title, { color: UI.text, fontFamily: font, fontSize: '30px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.20, this.level.instruction, { color: UI.muted, fontFamily: font, fontSize: '17px' }).setOrigin(0.5);
    this.feedbackText = this.add.text(width / 2, height * 0.88, '', { color: UI.text, fontFamily: font, fontSize: '20px', fontStyle: 'bold' }).setOrigin(0.5);

    this.renderLevel();
    this.events.once('shutdown', () => this.cleanup.forEach((fn) => fn()));
  }

  update(): void {
    if (this.locked) return;
    const elapsed = this.time.now - this.levelStart;
    this.timeLeft = Math.max(0, this.level.timeLimitMs - elapsed);
    const seconds = this.timeLeft / 1000;
    this.timerText.setText(`${seconds.toFixed(1)}s`);
    this.timerText.setColor(seconds < 2 ? UI.danger : UI.text);
    if (this.timeLeft <= 0) this.fail('TIME\'S UP');
  }

  private renderLevel(): void {
    switch (this.level.type) {
      case 'find-odd': this.renderFindOdd(); break;
      case 'safe-target': this.renderSafeTarget(); break;
      case 'dont-touch': this.renderDontTouch(); break;
      case 'memory': this.renderMemory(); break;
      case 'fake-button': this.renderFakeButton(); break;
      case 'moving-target': this.renderMovingTarget(); break;
      case 'reverse': this.renderReverse(); break;
      case 'pattern': this.renderPattern(); break;
      case 'boss': this.renderBoss(); break;
    }
  }

  private renderFindOdd(): void {
    const { width, height } = this.scale;
    const grid = this.level.difficulty >= 4 ? 5 : 4;
    const count = grid * grid;
    this.targetIndex = Phaser.Math.Between(0, count - 1);
    const gap = Math.min(width, height) * 0.15;
    const startX = width / 2 - ((grid - 1) * gap) / 2;
    const startY = height * 0.47 - ((grid - 1) * gap) / 2;
    const base = Phaser.Display.Color.GetColor(80 + this.level.difficulty * 4, 92, 150);
    const odd = Phaser.Display.Color.GetColor(100 + this.level.difficulty * 8, 92, 150);

    for (let i = 0; i < count; i += 1) {
      const row = Math.floor(i / grid);
      const col = i % grid;
      const circle = this.add.circle(startX + col * gap, startY + row * gap, Math.min(width, height) * (grid === 5 ? 0.035 : 0.042), i === this.targetIndex ? odd : base);
      circle.setInteractive({ useHandCursor: true });
      circle.on('pointerup', () => i === this.targetIndex ? this.win() : this.mistake(circle));
      this.cleanup.push(() => circle.destroy());
    }
  }

  private renderSafeTarget(): void {
    const { width, height } = this.scale;
    const count = 5;
    this.targetIndex = Phaser.Math.Between(0, count - 1);
    for (let i = 0; i < count; i += 1) {
      const x = width * (0.18 + i * 0.16);
      const y = height * 0.5;
      const shape = this.add.star(x, y, 5, 34, 15, i === this.targetIndex ? 0x36e0a0 : 0xff5577);
      shape.setInteractive({ useHandCursor: true });
      shape.on('pointerup', () => i === this.targetIndex ? this.win() : this.mistake(shape));
    }
  }

  private renderDontTouch(): void {
    const { width, height } = this.scale;
    const danger = this.add.circle(width / 2, height * 0.52, Math.min(width, height) * 0.1, UI.danger, 0.9);
    danger.setInteractive({ useHandCursor: true });
    danger.on('pointerup', () => this.fail('YOU TOUCHED IT'));
    this.tweens.add({ targets: danger, scale: 1.18, alpha: 0.5, duration: 700, yoyo: true, repeat: -1 });
    this.time.delayedCall(2500, () => { if (!this.locked) this.win(); });
  }

  private renderMemory(): void {
    const { width, height } = this.scale;
    const buttons = [0, 1, 2, 3];
    const sequence = Phaser.Utils.Array.Shuffle([...buttons]).slice(0, 3) as number[];
    let accepting = false;
    let position = 0;
    const pads = buttons.map((i) => {
      const x = width * (i % 2 === 0 ? 0.37 : 0.63);
      const y = height * (i < 2 ? 0.43 : 0.58);
      const pad = this.add.rectangle(x, y, 90, 90, [0x7c5cff, 0x00b8d9, 0xff5577, 0xffb020][i], 0.85).setInteractive({ useHandCursor: true });
      pad.on('pointerup', () => {
        if (!accepting || this.locked) return;
        if (i !== sequence[position]) { this.mistake(pad); return; }
        position += 1;
        this.tweens.add({ targets: pad, scale: 1.12, duration: 80, yoyo: true });
        if (position === sequence.length) this.win();
      });
      return pad;
    });
    sequence.forEach((index, step) => {
      this.time.delayedCall(650 + step * 650, () => {
        const pad = pads[index];
        this.tweens.add({ targets: pad, alpha: 1, scale: 1.16, duration: 140, yoyo: true });
      });
    });
    this.time.delayedCall(650 + sequence.length * 650, () => { accepting = true; });
  }

  private renderFakeButton(): void {
    const { width, height } = this.scale;
    const labels = ['OBVIOUS', 'NOPE', 'CLICK ME', 'NOT THAT'];
    const safe = Phaser.Math.Between(0, labels.length - 1);
    labels.forEach((label, i) => {
      const y = height * 0.40 + i * 72;
      const button = this.add.rectangle(width / 2, y, width * 0.62, 54, i === safe ? UI.panel2 : UI.accent).setInteractive({ useHandCursor: true });
      this.add.text(width / 2, y, label, { color: UI.text, fontFamily: font, fontSize: '17px', fontStyle: 'bold' }).setOrigin(0.5);
      button.on('pointerup', () => i === safe ? this.win() : this.fail('TRICKED'));
    });
  }

  private renderMovingTarget(): void {
    const { width, height } = this.scale;
    const target = this.add.circle(width * 0.25, height * 0.5, 30, UI.success).setInteractive({ useHandCursor: true });
    target.on('pointerup', () => this.win());
    this.tweens.add({ targets: target, x: width * 0.75, y: height * 0.42, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  private renderReverse(): void {
    const { width, height } = this.scale;
    this.add.text(width / 2, height * 0.40, 'TAP THE', { color: UI.muted, fontFamily: font, fontSize: '18px' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.46, 'WRONG', { color: UI.danger, fontFamily: font, fontSize: '42px', fontStyle: 'bold' }).setOrigin(0.5);
    const left = this.add.circle(width * 0.35, height * 0.6, 48, UI.success).setInteractive({ useHandCursor: true });
    const right = this.add.circle(width * 0.65, height * 0.6, 48, UI.danger).setInteractive({ useHandCursor: true });
    left.on('pointerup', () => this.win());
    right.on('pointerup', () => this.fail('TOO OBVIOUS'));
  }

  private renderPattern(): void {
    const { width, height } = this.scale;
    const values = [1, 2, 3, 1, 2, 3, 1, 2, 0];
    const gap = 55;
    values.forEach((value, i) => {
      const x = width / 2 - 2 * gap + (i % 5) * gap;
      const y = height * 0.48 + Math.floor(i / 5) * gap;
      const dot = this.add.circle(x, y, 17, [UI.accent, UI.success, UI.gold][value]);
      if (i === values.length - 1) {
        dot.setInteractive({ useHandCursor: true });
        dot.on('pointerup', () => this.win());
      }
    });
    this.add.text(width / 2, height * 0.68, 'Tap the missing pattern.', { color: UI.muted, fontFamily: font, fontSize: '16px' }).setOrigin(0.5);
  }

  private renderBoss(): void {
    const { width, height } = this.scale;
    const boss = this.add.container(width / 2, height * 0.48);
    const ring = this.add.circle(0, 0, 105, this.level.accent, 0.14).setStrokeStyle(3, this.level.accent, 0.7);
    const core = this.add.circle(0, 0, 60, this.level.accent, 1).setInteractive({ useHandCursor: true });
    const eye = this.add.circle(-16, -8, 8, 0xffffff).setDepth(1);
    const eye2 = this.add.circle(16, -8, 8, 0xffffff).setDepth(1);
    const smile = this.add.arc(0, 10, 24, 15, 160, false, 0xffffff, 1).setStrokeStyle(5, 0xffffff);
    boss.add([ring, core, eye, eye2, smile]);
    this.tweens.add({ targets: boss, angle: 360, duration: 3000, repeat: -1 });
    core.on('pointerup', () => {
      if (this.level.number === 10) {
        this.fail('THE BOSS WAS A DECOY');
      } else {
        this.win();
      }
    });
    this.time.delayedCall(5000, () => { if (!this.locked && this.level.number === 10) this.win(); });
  }

  private mistake(target: Phaser.GameObjects.GameObject): void {
    if (this.locked) return;
    state.totalMistakes += 1;
    state.streak = 0;
    this.cameras.main.shake(120, 0.004);
    this.feedbackText.setText('NOPE').setColor(UI.danger);
    this.tweens.add({ targets: target, alpha: 0.35, duration: 80, yoyo: true, repeat: 2 });
  }

  private win(): void {
    if (this.locked) return;
    this.locked = true;
    const elapsed = this.time.now - this.levelStart;
    const speedBonus = Math.max(0, Math.floor((this.level.timeLimitMs - elapsed) / 100));
    const perfect = state.totalMistakes === 0 || state.streak > 0;
    const base = 100 + this.level.difficulty * 25;
    const streakBonus = state.streak * 20;
    const gained = base + speedBonus + streakBonus + (perfect ? 50 : 0);
    state.score += gained;
    state.lastLevelScore = gained;
    state.lastLevelPerfect = perfect;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    this.feedbackText.setText(perfect ? `PERFECT  +${gained}` : `CLEARED  +${gained}`).setColor(UI.success);
    this.cameras.main.flash(120, 54, 224, 160, false);
    this.time.delayedCall(550, () => this.scene.start('result'));
  }

  private fail(message: string): void {
    if (this.locked) return;
    this.locked = true;
    state.streak = 0;
    state.lastLevelScore = 0;
    state.lastLevelPerfect = false;
    this.feedbackText.setText(message).setColor(UI.danger);
    this.cameras.main.shake(180, 0.008);
    this.time.delayedCall(450, () => this.scene.start('result'));
  }
}

class ResultScene extends Phaser.Scene {
  constructor() { super('result'); }

  create(): void {
    addBackground(this);
    const { width, height } = this.scale;
    const levelComplete = state.lastLevelScore > 0;
    const last = LEVELS[state.currentLevelIndex];

    this.add.text(width / 2, height * 0.19, levelComplete ? 'LEVEL CLEARED!' : 'TRICKED!', {
      color: levelComplete ? UI.success : UI.danger, fontFamily: font, fontSize: '32px', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.27, last?.title ?? '', { color: UI.muted, fontFamily: font, fontSize: '16px' }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.39, `${state.score}`, { color: UI.text, fontFamily: font, fontSize: '56px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.44, 'TOTAL SCORE', { color: UI.muted, fontFamily: font, fontSize: '13px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.51, `🔥 BEST STREAK  ${state.bestStreak}`, { color: UI.gold, fontFamily: font, fontSize: '18px', fontStyle: 'bold' }).setOrigin(0.5);

    const next = levelComplete && state.currentLevelIndex < LEVELS.length - 1;
    const label = next ? `NEXT: ${state.currentLevelIndex + 2}/10` : levelComplete ? 'WORLD COMPLETE' : 'TRY AGAIN';
    roundedButton(this, width / 2, height * 0.67, width * 0.62, 62, label, () => {
      if (next) state.currentLevelIndex += 1;
      this.scene.start(next ? 'game' : levelComplete ? 'menu' : 'game');
    });

    roundedButton(this, width / 2, height * 0.77, width * 0.48, 54, 'REPLAY LEVEL', () => this.scene.start('game'));
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#090b13',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 720, height: 1280 },
  scene: [BootScene, MenuScene, GameScene, ResultScene],
  input: { activePointers: 2 },
};

new Phaser.Game(config);
