import Phaser from 'phaser'

import GameScene from './scenes/game';
import GameOverScene from './scenes/gameOver';
import InitScene from './scenes/init';
import TitleScene from './scenes/title';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [InitScene, TitleScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
game.scene.start('init');