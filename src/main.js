import Phaser from 'phaser'

import GameScene from './scenes/game';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600
};

const game = new Phaser.Game(config);

game.scene.add('game', GameScene);
game.scene.start('game');