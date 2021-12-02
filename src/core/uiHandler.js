import Button from "./ui/button";
import { GameConfig } from "./gameConfig";

const DefaultUiDepth = 15;

export const UiState = {
    None: 0,
    Hud: 1,
    GameOver: 2,
    Exited: 3,
};

export default class UiHandler {
    constructor(scene, canvas, config) {
        this.scene = scene;
        this.canvas = canvas;
        this.config = config;

        this.halfScreenWidth = this.canvas.width / 2;
        this.halfScreenHeight = this.canvas.height / 2;

        this.scoreText = this.scene.add.text(this.halfScreenWidth + 120, 30, 'Score: 0', this.getHudStyle()).setDepth(DefaultUiDepth);
        this.timerText = this.scene.add.text(75, 30, 'Time: 0:00.00', this.getHudStyle()).setDepth(DefaultUiDepth);
        this.timesUpText = this.scene.add.text(this.halfScreenWidth, this.halfScreenHeight - 60, 'Time\'s up!', this.getGameOverHeaderStyle()).setDepth(DefaultUiDepth).setOrigin(0.5);
        this.gameOverScore = this.scene.add.text(this.halfScreenWidth, this.halfScreenHeight - 10, 'Final Score: 0', this.getGameOverStyle()).setDepth(DefaultUiDepth).setOrigin(0.5);

        this.exitedText = this.scene.add.text(this.halfScreenWidth, this.halfScreenHeight - 60, 'Game Exited!', this.getGameOverHeaderStyle()).setDepth(DefaultUiDepth).setOrigin(0.5);

        this.restartButton = new Button(this.scene, {
            x: this.halfScreenWidth,
            y: this.halfScreenHeight + 60,
            width: 150,
            height: 30,
            style: this.getGameOverStyle(),
            text: 'Restart',
            onClickEvent: this.config.onRestartButtonClicked
        });
        this.exitButton = new Button(this.scene, {
            x: this.halfScreenWidth,
            y: this.halfScreenHeight + 110,
            width: 150,
            height: 30,
            style: this.getGameOverStyle(),
            text: 'Exit Game',
            onClickEvent: this.config.onExitButtonClicked
        });

        this.setUiState(UiState.None);
    }

    setUiState(state) {
        this.uiState = state;

        this.hideHud();
        this.hideGameOver();
        this.hideExited();

        switch (state) {
            case UiState.Hud:
                this.showHud();
                break;
            case UiState.GameOver:
                this.showGameOver();
                break;
            case UiState.Exited:
                this.showExited();
                break;
        }
    }

    getHudStyle() {
        return {
            fontFamily: 'Courier',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#454545'
        };
    }

    getGameOverHeaderStyle() {
        return {
            fontFamily: 'Courier',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#454545'
        };
    }
    
    getGameOverStyle() {
        return {
            fontFamily: 'Courier',
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#454545'
        };
    }

    update(scoreKeeper, timer) {
        this.scoreText.text = 'Score: ' + scoreKeeper.score;
        this.timerText.text = 'Timer: ' + ((GameConfig.Gameplay.GameLengthTime - timer.getElapsed()) / 1000).toFixed(0);
        this.gameOverScore.text = 'Final Score: ' + scoreKeeper.score;
    }

    showHud() {
        this.timerText.setVisible(true);
        this.scoreText.setVisible(true);
    }

    hideHud() {
        this.timerText.setVisible(false);
        this.scoreText.setVisible(false);
    }

    showGameOver() {
        this.timesUpText.setVisible(true);
        this.gameOverScore.setVisible(true);
        this.restartButton.setVisible(true);
        this.exitButton.setVisible(true);
    }

    hideGameOver() {
        this.timesUpText.setVisible(false);
        this.gameOverScore.setVisible(false);
        this.restartButton.setVisible(false);
        this.exitButton.setVisible(false);
    }

    showExited() {
        this.exitedText.setVisible(true);
    }

    hideExited() {
        this.exitedText.setVisible(false);
    }
}