import { GameConfig } from "../../gameConfig";
import Button from "../button";

const DefaultUiDepth = 15;

export default class HudUiHandler {
    constructor(scene, canvas, config) {
        this.scene = scene;
        this.canvas = canvas;
        this.config = config;

        this.initializeUiComponents(this.canvas);
    }

    initializeUiComponents(canvas) {
        const halfScreenWidth = canvas.width / 2;
        const halfScreenHeight = canvas.height / 2;

        this.scoreText = this.scene.add.text(75, 30, 'Score: 0', this.getStyle()).setDepth(DefaultUiDepth);
        this.timerText = this.scene.add.text(halfScreenWidth + 140, 30, 'Time: 0:00.00', this.getStyle()).setDepth(DefaultUiDepth);
    }

    update(scoreKeeper, timer) {
        this.scoreText.text = 'Score: ' + scoreKeeper.score;

        let elapsedTime = '-';
        if (timer) {
            elapsedTime = ((GameConfig.Gameplay.GameLengthTime - timer.getElapsed()) / 1000).toFixed(0);
        }
        this.timerText.text = 'Timer: ' + elapsedTime;
    }

    getStyle() {
        return {
            fontFamily: 'Courier',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#454545'
        };
    }

    hide() {
        this.scoreText.setVisible(false);
        this.timerText.setVisible(false);
    }
}