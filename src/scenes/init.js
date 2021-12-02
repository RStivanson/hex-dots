import Phaser from 'phaser';

import BackgroundTexturePath from '../assets/background5.png';
import DotTexturePath from '../assets/dot.png';

export default class InitScene extends Phaser.Scene {
    constructor() {
        super('init');
    }

	preload() {
        this.load.image('background', BackgroundTexturePath);
        this.load.image('dot', DotTexturePath);
    }

    create() {
        this.scene.start('title');
    }
}