import Phaser from 'phaser';
import './main';
import { World1Game } from './World1Game';

// main.ts creates the Phaser instance. Wait until Phaser has booted before
// replacing the gameplay scene; replacing it synchronously can leave the
// active scene half-initialized and produce a frozen first level.
function installWorld1Game(): void {
  const game = Phaser.GAMES[0];
  if (!game || !game.isBooted) {
    window.requestAnimationFrame(installWorld1Game);
    return;
  }

  if (game.scene.keys.game) {
    game.scene.stop('game');
    game.scene.remove('game');
  }

  game.scene.add('game', World1Game, true);
}

installWorld1Game();
