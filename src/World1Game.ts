import Phaser from 'phaser';
import { LEVELS, LEVELS_PER_WORLD } from './levels/LevelRegistry';
import { CHALLENGE_CATALOG } from './levels/ChallengeCatalog';
import { ChallengeEngine } from './levels/ChallengeEngine';
import { MemoryMechanic } from './levels/MemoryMechanic';

const C = { bg: 0x090b13, panel: 0x121625, panel2: 0x191e31, text: '#f7f8ff', muted: '#9ca6c3', accent: '#8b72ff', danger: '#ff5577', success: '#36e0a0', gold: '#ffd166', cyan: '#35d9ff' };
const FONT = 'Arial, sans-serif';

function button(scene: Phaser.Scene, x: number, y: number, w: number, h: number, label: string, action: () => void, color = C.accent) {
  const c = scene.add.container(x, y);
  const body = scene.add.rectangle(0, 0, w, h, color).setStrokeStyle(2, 0xffffff, 0.1).setInteractive({ useHandCursor: true });
  const text = scene.add.text(0, 0, label, { color: C.text, fontFamily: FONT, fontSize: '17px', fontStyle: 'bold' }).setOrigin(0.5);
  c.add([body, text]);
  body.on('pointerover', () => scene.tweens.add({ targets: c, scale: 1.04, duration: 80 }));
  body.on('pointerout', () => scene.tweens.add({ targets: c, scale: 1, duration: 80 }));
  body.on('pointerup', action);
  return c;
}

function funny(perfect: boolean): string {
  if (perfect) return Phaser.Utils.Array.GetRandom(['Okay... hacker.', 'Zero mistakes. Suspicious.', 'I am starting to regret this game.']);
  return Phaser.Utils.Array.GetRandom(['Tricky approves. Unfortunately.', 'Your brain survived another one.', 'One level down. Ego +10.', 'Okay... that was actually good.']);
}

export class World1Game extends Phaser.Scene {
  private index = 0;
  private elapsed = 0;
  private locked = false;
  private paused = false;
  private mistakes = 0;
  private engine = new ChallengeEngine(20260826);
  private memory?: MemoryMechanic;
  private timerFill!: Phaser.GameObjects.Rectangle;
  private timerText!: Phaser.GameObjects.Text;
  private score = 0;
  private streak = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private streakText!: Phaser.GameObjects.Text;
  private pauseOverlay?: Phaser.GameObjects.Container;

  constructor() { super('game'); }

  create() {
    this.index = 0;
    this.startLevel();
  }

  update(_: number, delta: number) {
    if (this.locked || this.paused) return;
    this.elapsed += delta;
    const level = LEVELS[this.index];
    const left = Math.max(0, level.timeLimitMs - this.elapsed);
    const ratio = left / level.timeLimitMs;
    this.timerFill.displayWidth = this.scale.width * 0.8 * ratio;
    const seconds = left / 1000;
    this.timerFill.setFillStyle(seconds < 1.8 ? C.danger : seconds < 3.5 ? C.gold : C.success);
    this.timerText.setText(`${seconds.toFixed(1)}s`);
    this.timerText.setColor(seconds < 1.8 ? C.danger : C.text);
    if (seconds < 1.8) this.timerFill.alpha = 0.55 + Math.sin(this.time.now / 70) * 0.45;
    else this.timerFill.alpha = 1;
    if (left <= 0) this.fail("TIME'S UP");
  }

  private startLevel() {
    this.children.removeAll(true);
    this.memory?.destroy();
    this.memory = undefined;
    this.elapsed = 0;
    this.locked = false;
    this.paused = false;
    this.mistakes = 0;

    const level = LEVELS[this.index];
    const spec = CHALLENGE_CATALOG.find(x => x.id === level.id);
    if (spec) this.engine.start(spec, performance.now());

    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(C.bg);

    for (let i = 0; i < 14; i++) {
      const dot = this.add.circle(Phaser.Math.Between(0, width), Phaser.Math.Between(0, height), Phaser.Math.Between(1, 3), 0xffffff, 0.04);
      this.tweens.add({ targets: dot, alpha: 0.01, scale: 0.3, duration: Phaser.Math.Between(1400, 3000), yoyo: true, repeat: -1 });
    }

    this.add.text(24, 22, `WORLD 01  •  LEVEL ${String(level.number).padStart(2, '0')}/${LEVELS_PER_WORLD}`, { color: C.muted, fontFamily: FONT, fontSize: '13px', fontStyle: 'bold' });
    this.scoreText = this.add.text(24, 48, `SCORE  ${this.score.toLocaleString()}`, { color: C.gold, fontFamily: FONT, fontSize: '16px', fontStyle: 'bold' });
    this.streakText = this.add.text(width - 70, 25, `🔥 ${this.streak}`, { color: C.gold, fontFamily: FONT, fontSize: '17px', fontStyle: 'bold' }).setOrigin(1, 0);
    this.add.rectangle(width * 0.1, 91, width * 0.8, 12, C.panel2).setOrigin(0, 0.5);
    this.timerFill = this.add.rectangle(width * 0.1, 91, width * 0.8, 12, C.success).setOrigin(0, 0.5);
    this.timerText = this.add.text(width / 2, 91, '', { color: C.text, fontFamily: FONT, fontSize: '12px', fontStyle: 'bold' }).setOrigin(0.5);
    const pause = this.add.text(width - 22, 59, 'Ⅱ', { color: C.text, fontFamily: FONT, fontSize: '23px', fontStyle: 'bold' }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    pause.on('pointerup', () => this.togglePause());

    this.add.text(width / 2, height * 0.15, level.title, { color: C.text, fontFamily: FONT, fontSize: '29px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.205, level.instruction, { color: C.muted, fontFamily: FONT, fontSize: '16px', align: 'center', wordWrap: { width: width * 0.82 } }).setOrigin(0.5);

    if (level.type === 'memory') this.mountMemory();
    else this.mountWorld1Challenge(level.type);
  }

  private mountMemory() {
    const level = LEVELS[this.index];
    this.memory = new MemoryMechanic({
      scene: this,
      x: this.scale.width / 2,
      y: this.scale.height * 0.43,
      difficulty: level.difficulty,
      seed: this.index + 101,
      onComplete: correct => correct ? this.win() : this.mistake(),
    });
    this.memory.mount();
  }

  private mountWorld1Challenge(type: string) {
    const { width, height } = this.scale;
    if (type === 'find-odd') {
      const count = 16 + this.index * 2;
      const target = Phaser.Math.Between(0, count - 1);
      const cols = this.index > 4 ? 6 : 4;
      const gap = Math.min(width, height) * (cols === 6 ? 0.095 : 0.14);
      const startX = width / 2 - ((cols - 1) * gap) / 2;
      const startY = height * 0.48 - (Math.ceil(count / cols) - 1) * gap / 2;
      for (let i = 0; i < count; i++) {
        const odd = i === target;
        const dot = this.add.circle(startX + (i % cols) * gap, startY + Math.floor(i / cols) * gap, cols === 6 ? 9 : 13, odd ? 0x6878ff : 0x505c98).setInteractive({ useHandCursor: true });
        dot.on('pointerup', () => odd ? this.win() : this.mistake());
        this.tweens.add({ targets: dot, scale: { from: 0.5, to: 1 }, alpha: { from: 0, to: 1 }, duration: 180, delay: i * 10 });
      }
      return;
    }
    if (type === 'safe-target') {
      for (let i = 0; i < 7; i++) {
        const a = Math.PI * 2 * i / 7;
        const good = i === 3;
        const shape = this.add.star(width / 2 + Math.cos(a) * width * 0.27, height * 0.5 + Math.sin(a) * height * 0.16, 5, 31, 14, good ? C.success : C.danger).setInteractive({ useHandCursor: true });
        shape.on('pointerup', () => good ? this.win() : this.mistake());
        this.tweens.add({ targets: shape, angle: good ? 360 : -360, duration: 1400 + i * 80, repeat: -1 });
      }
      return;
    }
    if (type === 'dont-touch') {
      const ring = this.add.circle(width / 2, height * 0.5, 76, C.danger, 0.12).setStrokeStyle(7, C.danger, 0.75);
      const core = this.add.circle(width / 2, height * 0.5, 52, C.danger).setInteractive({ useHandCursor: true });
      core.on('pointerup', () => this.mistake());
      this.tweens.add({ targets: ring, scale: 1.35, alpha: 0.15, duration: 650, yoyo: true, repeat: -1 });
      this.add.text(width / 2, height * 0.66, 'DO NOT TAP', { color: C.text, fontFamily: FONT, fontSize: '18px', fontStyle: 'bold' }).setOrigin(0.5);
      this.time.delayedCall(2200, () => !this.locked && this.win());
      return;
    }
    if (type === 'fake-button') {
      const labels = ['CLICK ME', 'SAFE', 'OBVIOUS', 'DO NOT PRESS'];
      const safe = Phaser.Math.Between(0, 3);
      labels.forEach((label, i) => {
        const b = this.add.rectangle(width / 2, height * 0.36 + i * 70, width * 0.65, 54, i === safe ? C.panel2 : C.accent).setInteractive({ useHandCursor: true });
        this.add.text(b.x, b.y, label, { color: C.text, fontFamily: FONT, fontSize: '16px', fontStyle: 'bold' }).setOrigin(0.5);
        b.on('pointerup', () => i === safe ? this.win() : this.mistake());
      });
      return;
    }
    if (type === 'moving-target') {
      const target = this.add.circle(width * 0.18, height * 0.5, 32, C.success).setInteractive({ useHandCursor: true });
      target.on('pointerup', () => this.win());
      this.tweens.add({ targets: target, x: width * 0.82, y: height * 0.43, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      return;
    }
    if (type === 'reverse') {
      this.add.text(width / 2, height * 0.37, 'YOUR FIRST INSTINCT IS WRONG', { color: C.gold, fontFamily: FONT, fontSize: '15px', fontStyle: 'bold' }).setOrigin(0.5);
      const left = this.add.circle(width * 0.34, height * 0.57, 53, C.success).setInteractive({ useHandCursor: true });
      const right = this.add.circle(width * 0.66, height * 0.57, 53, C.danger).setInteractive({ useHandCursor: true });
      left.on('pointerup', () => this.win()); right.on('pointerup', () => this.mistake());
      return;
    }
    if (type === 'pattern') {
      const gap = 54;
      for (let i = 0; i < 10; i++) {
        const good = i === 9;
        const dot = this.add.circle(width / 2 - 2 * gap + (i % 5) * gap, height * 0.48 + Math.floor(i / 5) * gap, 18, good ? C.panel2 : [C.accent, C.success, C.gold][i % 3]);
        if (good) dot.setInteractive({ useHandCursor: true }).on('pointerup', () => this.win());
      }
      return;
    }
    if (type === 'boss') {
      const core = this.add.circle(width / 2, height * 0.5, 58, C.accent).setInteractive({ useHandCursor: true });
      const ring = this.add.circle(width / 2, height * 0.5, 108, C.accent, 0.12).setStrokeStyle(4, C.accent, 0.8);
      core.on('pointerup', () => this.win());
      this.tweens.add({ targets: ring, scale: 1.35, alpha: 0.15, duration: 650, yoyo: true, repeat: -1 });
      this.tweens.add({ targets: core, scale: 1.12, duration: 450, yoyo: true, repeat: -1 });
      this.add.text(width / 2, height * 0.68, 'BOSS — DON’T BLINK', { color: C.danger, fontFamily: FONT, fontSize: '16px', fontStyle: 'bold' }).setOrigin(0.5);
    }
  }

  private mistake() {
    if (this.locked) return;
    this.mistakes += 1;
    this.engine.recordMistake();
    this.streak = 0;
    this.streakText.setText('🔥 0');
    this.cameras.main.shake(90, 0.004);
    if (this.mistakes >= 2) this.add.text(this.scale.width / 2, this.scale.height * 0.83, 'Careful... Tricky is watching. 😈', { color: C.danger, fontFamily: FONT, fontSize: '15px', fontStyle: 'bold' }).setOrigin(0.5);
  }

  private win() {
    if (this.locked) return;
    this.locked = true;
    const level = LEVELS[this.index];
    const left = Math.max(0, level.timeLimitMs - this.elapsed);
    const perfect = this.mistakes === 0;
    const gain = 900 + level.difficulty * 70 + Math.round(left / 18) + (perfect ? 500 : 0) + this.streak * 90;
    this.score += gain;
    this.streak += 1;
    this.scoreText.setText(`SCORE  ${this.score.toLocaleString()}`);
    this.streakText.setText(`🔥 ${this.streak}`);
    this.showResult(gain, perfect);
  }

  private showResult(gain: number, perfect: boolean) {
    const { width, height } = this.scale;
    this.cameras.main.flash(150, 255, 255, 255);
    const panel = this.add.rectangle(width / 2, height * 0.53, width * 0.84, height * 0.42, C.panel, 0.98).setStrokeStyle(2, perfect ? C.gold : C.success, 0.8).setScale(0.65);
    const title = this.add.text(width / 2, height * 0.39, perfect ? '✦ PERFECT ✦' : 'LEVEL CLEAR', { color: perfect ? C.gold : C.success, fontFamily: FONT, fontSize: '31px', fontStyle: 'bold' }).setOrigin(0.5).setAlpha(0);
    const score = this.add.text(width / 2, height * 0.51, '+0', { color: C.text, fontFamily: FONT, fontSize: '43px', fontStyle: 'bold' }).setOrigin(0.5).setAlpha(0);
    const quote = this.add.text(width / 2, height * 0.62, funny(perfect), { color: C.muted, fontFamily: FONT, fontSize: '15px', align: 'center', wordWrap: { width: width * 0.68 } }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: panel, scale: 1, duration: 260, ease: 'Back.out' });
    this.tweens.add({ targets: [title, score, quote], alpha: 1, duration: 200, delay: 120, stagger: 80 });
    this.tweens.addCounter({ from: 0, to: gain, duration: 600, delay: 140, onUpdate: t => score.setText(`+${Math.round(t.getValue()).toLocaleString()}`) });
    this.time.delayedCall(1250, () => this.nextLevel());
  }

  private nextLevel() {
    if (this.index >= LEVELS_PER_WORLD - 1) {
      this.showWorldComplete();
      return;
    }
    this.index += 1;
    this.startLevel();
  }

  private showWorldComplete() {
    const { width, height } = this.scale;
    this.children.removeAll(true);
    this.add.text(width / 2, height * 0.22, 'WORLD 01 COMPLETE!', { color: C.gold, fontFamily: FONT, fontSize: '31px', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.34, Phaser.Utils.Array.GetRandom(['You survived the tutorial. Unfortunately, it gets worse.','Your brain is officially doing overtime.','Okay... you are actually good.']), { color: C.text, fontFamily: FONT, fontSize: '18px', align: 'center', wordWrap: { width: width * 0.75 } }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.47, `SCORE  ${this.score.toLocaleString()}\n🔥 BEST STREAK  ${this.streak}`, { color: C.muted, fontFamily: FONT, fontSize: '18px', align: 'center' }).setOrigin(0.5);
    button(this, width / 2, height * 0.64, width * 0.58, 58, 'PLAY WORLD 01 AGAIN', () => { this.index = 0; this.score = 0; this.streak = 0; this.startLevel(); });
    button(this, width / 2, height * 0.74, width * 0.5, 48, '← WORLD MAP', () => this.scene.start('world-select'), C.panel2);
  }

  private fail(reason: string) {
    if (this.locked) return;
    this.locked = true;
    this.streak = 0;
    this.cameras.main.shake(160, 0.008);
    this.time.delayedCall(350, () => {
      const { width, height } = this.scale;
      this.add.rectangle(width / 2, height / 2, width, height, 0x05060b, 0.84).setDepth(80);
      this.add.text(width / 2, height * 0.34, 'TRICKY WINS 😈', { color: C.danger, fontFamily: FONT, fontSize: '31px', fontStyle: 'bold' }).setOrigin(0.5).setDepth(81);
      this.add.text(width / 2, height * 0.43, reason, { color: C.text, fontFamily: FONT, fontSize: '17px', fontStyle: 'bold' }).setOrigin(0.5).setDepth(81);
      this.add.text(width / 2, height * 0.51, 'Your brain needs a software update.', { color: C.muted, fontFamily: FONT, fontSize: '16px' }).setOrigin(0.5).setDepth(81);
      button(this, width / 2, height * 0.64, width * 0.58, 54, '↻ TRY AGAIN', () => this.startLevel(), C.accent).setDepth(82);
      button(this, width / 2, height * 0.74, width * 0.58, 48, '← WORLD MAP', () => this.scene.start('world-select'), C.panel2).setDepth(82);
    });
  }

  private togglePause() {
    if (this.locked) return;
    this.paused = !this.paused;
    if (this.paused) {
      this.tweens.pauseAll();
      this.pauseOverlay = this.add.container(0, 0).setDepth(100);
      this.pauseOverlay.add(this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x05060b, 0.86));
      this.pauseOverlay.add(this.add.text(this.scale.width / 2, this.scale.height * 0.3, 'PAUSED', { color: C.text, fontFamily: FONT, fontSize: '38px', fontStyle: 'bold' }).setOrigin(0.5));
      button(this, this.scale.width / 2, this.scale.height * 0.5, this.scale.width * 0.56, 54, '▶ RESUME', () => this.togglePause(), C.success).setDepth(101);
      button(this, this.scale.width / 2, this.scale.height * 0.62, this.scale.width * 0.56, 50, '↻ RESTART', () => this.startLevel()).setDepth(101);
    } else {
      this.pauseOverlay?.destroy();
      this.pauseOverlay = undefined;
      this.tweens.resumeAll();
    }
  }
}
