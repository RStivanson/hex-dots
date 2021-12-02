import Button from "../button";

const DefaultUiDepth = 15;

export default class TitleUiHandler {
    constructor(scene, canvas, config) {
        this.scene = scene;
        this.canvas = canvas;
        this.config = config;

        this.initializeUiComponents(this.canvas);
    }

    initializeUiComponents(canvas) {
        const halfScreenWidth = canvas.width / 2;
        const halfScreenHeight = canvas.height / 2;

        this.titleText = this.scene.add.text(halfScreenWidth, halfScreenHeight - 30, 'Hex Dots', this.getHeaderStyle()).setOrigin(0.5).setDepth(DefaultUiDepth);
        
        this.startGameButton = new Button(this.scene, {
            x: halfScreenWidth,
            y: halfScreenHeight + 60,
            width: 215,
            height: 30,
            style: this.getStyle(),
            text: 'Start Game',
            onClickEvent: this.config.onStartGameButtonClicked
        });
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
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#454545'
        };
    }
}