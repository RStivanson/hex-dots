import Button from "../button";

const DefaultUiDepth = 15;

export default class GameOverUiHandler {
    constructor(scene, canvas, config) {
        this.scene = scene;
        this.canvas = canvas;
        this.config = config;

        this.initializeUiComponents(this.canvas);
    }

    initializeUiComponents(canvas) {
        const halfScreenWidth = canvas.width / 2;
        const halfScreenHeight = canvas.height / 2;

        this.timesUpText = this.scene.add.text(halfScreenWidth, halfScreenHeight - 60, 'Time\'s up!', this.getHeaderStyle()).setDepth(DefaultUiDepth).setOrigin(0.5);
        this.gameOverScore = this.scene.add.text(halfScreenWidth, halfScreenHeight - 10, 'Final Score: 0', this.getStyle()).setDepth(DefaultUiDepth).setOrigin(0.5);

        this.restartButton = new Button(this.scene, {
            x: halfScreenWidth,
            y: halfScreenHeight + 60,
            width: 150,
            height: 30,
            style: this.getStyle(),
            text: 'Restart',
            onClickEvent: this.config.onRestartButtonClicked
        });
        this.exitButton = new Button(this.scene, {
            x: halfScreenWidth,
            y: halfScreenHeight + 110,
            width: 150,
            height: 30,
            style: this.getStyle(),
            text: 'Exit Game',
            onClickEvent: this.config.onExitButtonClicked
        });
    }

    setFinalScore(score) {
        this.gameOverScore.text = 'Final Score: ' + score;
    }

    getHeaderStyle() {
        return {
            fontFamily: 'Courier',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#454545'
        };
    }
    
    getStyle() {
        return {
            fontFamily: 'Courier',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#454545'
        };
    }
}