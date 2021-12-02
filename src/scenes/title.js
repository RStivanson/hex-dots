import Phaser from 'phaser';
import TitleUiHandler from '../core/ui/handlers/titleUiHandler';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('title');
    }

	preload() {
        this.titleUiHandler = new TitleUiHandler(this, this.sys.game.canvas, {
            onStartGameButtonClicked: this.onStartGameClicked
        });
    }

    create() {
        this.add.image(400, 300, 'background').setDepth(-100);
	}

    onStartGameClicked(scene) {
        scene.scene.start('game');
    }
}