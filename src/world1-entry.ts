import Phaser from 'phaser';
import './main';
import { World1Game } from './World1Game';

// main.ts owns the existing menu/world-map shell. Replace only its gameplay scene
// at startup so the existing navigation continues to work without duplicating it.
const game = Phaser.GAMES[0];
if (game) {
  game.scene.remove('game');
  game.scene.add('game', World1Game, false);
}
