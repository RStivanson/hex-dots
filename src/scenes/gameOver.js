import Phaser from 'phaser';
import GameOverUiHandler from '../core/ui/handlers/gameOverUiHandler';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        this.finalScore = data.finalScore;
    }

    preload() {
        this.uiHandler = new GameOverUiHandler(this, this.sys.game.canvas, {
            onRestartButtonClicked: this.onRestartButtonClicked,
            onExitButtonClicked: this.onExitButtonClicked
        });
        this.uiHandler.setFinalScore(this.finalScore);
    }

    create() {
        this.add.image(400, 300, 'background').setDepth(-100);
    }

    onRestartButtonClicked(scene) {
        scene.scene.start('game');
    }

    onExitButtonClicked(scene) {
        scene.scene.start('title');
    }
}