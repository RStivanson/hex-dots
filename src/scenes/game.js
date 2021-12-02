import Phaser from 'phaser'
import DotGrid from '../core/dotGrid'
import ScoreKeeper from '../core/scoreKeeper';
import { GameConfig } from '../Core/gameConfig'
import UiHandler, { UiState } from '../core/uiHandler';

import BackgroundTexturePath from './../assets/background4.png';
import DotTexturePath from './../assets/dot.png';

const GameState = {
    Playing: 0,
    Paused: 1
}

export default class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('background', BackgroundTexturePath);
        this.load.image('dot', DotTexturePath);

        this.input.on('pointerup', () => this.onPointerUp());

        this.scoreKeeper = new ScoreKeeper(GameConfig.Gameplay.ScorePerDot, GameConfig.Gameplay.ScoreLoopMultiplier);
        this.uiHandler = new UiHandler(this, this.sys.game.canvas, {
            onRestartButtonClicked: () => {
                this.beginGame();
            },
            onExitButtonClicked: () => {
                this.uiHandler.setUiState(UiState.Exited);
            }
        });
        this.gridConfig = {
            x: 75,
            y: 140,
            width: this.sys.game.canvas.width - 80,
            height: this.sys.game.canvas.height - 80,
            numRows: GameConfig.Grid.NumOfGridRows,
            numColumns: GameConfig.Grid.NumOfGridColumns,
            numOfDotColors: GameConfig.Grid.NumOfDotColors,
            dotScale: 0.3
        };
        this.dotGrid = new DotGrid(this, this.gridConfig);
    }

    create() {
        this.add.image(400, 300, 'background').setDepth(-100);
        this.particles = this.add.particles('dot').setDepth(10);
        this.dotLine = this.add.graphics();

        this.beginGame();
    }

    update() {
        this.dotGrid.update();
        this.uiHandler.update(this.scoreKeeper, this.gameTimer);
        this.drawLineBetweenDots(this.selection.dots);
    }

    beginGame() {
        this.dotGrid.resumeRefill();
        this.dotGrid.randomizeDots();
        this.scoreKeeper.reset();
        this.resetSelection();
        this.restartGameTimer();
        this.gameState = GameState.Playing;
        this.uiHandler.setUiState(UiState.Hud);
    }

    endGame() {
        this.dotGrid.pauseRefill();
        this.dotGrid.explodeClear();
        this.gameState = GameState.Paused;
        this.resetSelection();
        this.gameTimer.paused = true;
        this.uiHandler.setUiState(UiState.GameOver);
    }

    restartGameTimer() {
        let timerConfig = {
            delay: GameConfig.Gameplay.GameLengthTime,
            callback: this.endGame,
            callbackScope: this,
            paused: false,
        };

        if (this.gameTimer) {
            this.time.removeEvent(this.gameTimer);

            this.gameTimer.reset(timerConfig);
            this.time.addEvent(this.gameTimer);
        } else {
            this.gameTimer = this.time.addEvent(timerConfig);
        }
    }

    generateGraphicsDotLinePath(gfx, dots, endingPosition) {
        if (!dots || dots.length === 0)
            return;

        let dot = dots[0];

        gfx.lineStyle(15, dot.getEffectiveTint()._color);
        gfx.beginPath();

        gfx.moveTo(dot.x, dot.y);
        for (let i = 1; i < dots.length; i++) {
            dot = dots[i];
            gfx.lineTo(dot.x, dot.y);
            gfx.fillPath()
        }
        gfx.lineTo(endingPosition.x, endingPosition.y);
    }

    drawLineBetweenDots(dots) {
        this.dotLine.clear();
        this.generateGraphicsDotLinePath(this.dotLine, dots, this.game.input.mousePointer);
        this.dotLine.strokePath();
    }

    createExplodeEffectAt(x, y, tint = 0xffffff) {
        let emitter = this.particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 75, max: 175 },
            scale: { start: 0.2, end: 0.1 },
            maxParticles: 15,
            lifespan: 350,
            tint: tint,
        });
        for (let i = 0; i < 5; i++)
            emitter.explode();
    }

    resetSelection() {
        if (this.selection) {
            this.selection.dots.forEach(dot => {
                dot.unselect();
            });
        } 

        this.selection = {
            dots: [],
            colorId: null,
            isLoop: false,
        };
    }

    addToSelection(dot) {
        if (!this.selection) {
            this.resetSelection();
        }

        this.selection.dots.push(dot);
        dot.select();
    }

    onDotClicked(dot) {
        if (this.gameState !== GameState.Playing)
            return;

        this.resetSelection();
        this.selection.colorId = dot.colorData.id;
        this.selection.dots.push(dot);
        dot.select();
    }

    onDotHovered(dot) {
        if (this.gameState !== GameState.Playing)
            return;
        if (this.selection.dots.length == 0)
            return;

        let firstSeletedDot = this.selection.dots[0];
        let lastSelectedDot = this.selection.dots[this.selection.dots.length - 1];

        if (dot.colorData.id === this.selection.colorId) {
            if (this.dotGrid.isDotAdjacent(lastSelectedDot, dot)) {
                if (!dot.selected) {
                    this.addToSelection(dot);
                } else if (this.selection.dots.length >= GameConfig.Gameplay.MinLoopAmount && dot === firstSeletedDot) {
                    this.addToSelection(dot);
                    this.selection.isLoop = true;
                    this.dotGrid.setColorIdLightened(this.selection.colorId, true);
                }
            } else if (dot.row === lastSelectedDot.row && dot.column === lastSelectedDot.column) {
                let lastDot = this.selection.dots.pop();

                if (lastDot === firstSeletedDot && this.selection.isLoop) {
                    this.selection.isLoop = false;
                    this.dotGrid.setColorIdLightened(this.selection.colorId, false);
                } else {
                    lastDot.unselect();
                }
            }
        }
    }

    onPointerUp() {
        if (this.gameState !== GameState.Playing)
            return;

        if (this.selection.dots.length < GameConfig.Gameplay.MinLineCompletionAmount) {
            this.resetSelection();
            return;
        }
        
        if (this.selection.isLoop) {
            this.dotGrid.removeDotsByColorId(this.selection.colorId);
        } else {
            this.dotGrid.removeDots(this.selection.dots);
        }

        this.scoreKeeper.addScore(this.selection.dots, this.selection.isLoop);
        this.resetSelection();
    }
}