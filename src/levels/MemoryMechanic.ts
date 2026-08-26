import type Phaser from 'phaser';

export interface MemoryMechanicOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  difficulty: number;
  seed: number;
  onComplete: (correct: boolean) => void;
}

const SYMBOLS = ['◆', '●', '▲', '■', '★', '✚'];

/** A reusable memory challenge: watch a sequence, then reproduce it. */
export class MemoryMechanic {
  private readonly scene: Phaser.Scene;
  private readonly x: number;
  private readonly y: number;
  private readonly difficulty: number;
  private readonly seed: number;
  private readonly onComplete: (correct: boolean) => void;
  private readonly objects: Phaser.GameObjects.GameObject[] = [];
  private sequence: string[] = [];
  private answer: string[] = [];
  private acceptingInput = false;

  constructor(options: MemoryMechanicOptions) {
    Object.assign(this, options);
    this.scene = options.scene;
    this.x = options.x;
    this.y = options.y;
    this.difficulty = options.difficulty;
    this.seed = options.seed;
    this.onComplete = options.onComplete;
  }

  mount(): void {
    const length = Math.min(6, 2 + Math.ceil(this.difficulty / 2));
    this.sequence = this.makeSequence(length);
    this.showSequence();
  }

  destroy(): void {
    this.scene.tweens.killTweensOf(this.objects);
    this.objects.forEach((object) => object.destroy());
    this.objects.length = 0;
  }

  private showSequence(): void {
    const label = this.scene.add.text(this.x, this.y - 120, 'WATCH CAREFULLY', {
      fontFamily: 'Arial Black, sans-serif', fontSize: '18px', color: '#9ea8ca'
    }).setOrigin(0.5);
    this.objects.push(label);

    const symbol = this.scene.add.text(this.x, this.y, '', {
      fontFamily: 'Arial Black, sans-serif', fontSize: '76px', color: '#ffffff'
    }).setOrigin(0.5);
    this.objects.push(symbol);

    let index = 0;
    const showNext = () => {
      if (index >= this.sequence.length) {
        symbol.setText('?').setColor('#7c5cff');
        label.setText('NOW REPEAT THE SEQUENCE');
        this.mountChoices();
        return;
      }
      symbol.setText(this.sequence[index]);
      index += 1;
      this.scene.time.delayedCall(Math.max(300, 720 - this.difficulty * 35), showNext);
    };
    showNext();
  }

  private mountChoices(): void {
    this.acceptingInput = true;
    const choices = [...new Set([...this.sequence, ...SYMBOLS])].slice(0, 6);
    const shuffled = choices.sort(() => this.random() - 0.5);
    shuffled.forEach((value, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const button = this.scene.add.rectangle(
        this.x - 120 + col * 120,
        this.y + 100 + row * 86,
        92, 64, 0x151b35, 1
      ).setStrokeStyle(2, 0x3a456d).setInteractive({ useHandCursor: true });
      const text = this.scene.add.text(button.x, button.y, value, {
        fontFamily: 'Arial Black, sans-serif', fontSize: '30px', color: '#ffffff'
      }).setOrigin(0.5);
      this.objects.push(button, text);
      button.on('pointerdown', () => this.choose(value, button, text));
    });
  }

  private choose(value: string, button: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text): void {
    if (!this.acceptingInput) return;
    this.answer.push(value);
    button.setStrokeStyle(3, 0x7c5cff);
    text.setColor('#b9adff');

    const index = this.answer.length - 1;
    if (value !== this.sequence[index]) {
      this.acceptingInput = false;
      this.onComplete(false);
      return;
    }
    if (this.answer.length === this.sequence.length) {
      this.acceptingInput = false;
      this.onComplete(true);
    }
  }

  private makeSequence(length: number): string[] {
    const result: string[] = [];
    let state = this.seed >>> 0;
    for (let i = 0; i < length; i += 1) {
      state = Math.imul(state ^ (state >>> 16), 2246822519) >>> 0;
      result.push(SYMBOLS[state % SYMBOLS.length]);
    }
    return result;
  }

  private random(): number {
    const n = Math.sin(this.seed + this.answer.length * 17 + this.objects.length) * 10000;
    return n - Math.floor(n);
  }
}
